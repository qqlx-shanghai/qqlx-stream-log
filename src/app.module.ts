import { Module, Injectable } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PondDropet, SHANGHAI_POSTGRESQL_DROPET, POND_LOG_DROPET } from "qqlx-core";
import { PondLogSchema } from "qqlx-cdk";
import { getLocalNetworkIPs, PondDropetMessenger } from "qqlx-sdk";

import { DropletModule } from "./droplet/module";
import { PondLogController } from "./log/controller.rest";
import { PondLogDao } from "./log/dao";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [DropletModule],
            useFactory: async (pondDropetMessenger: PondDropetMessenger) => {
                // 1.建立数据库链接
                const node_db = await pondDropetMessenger.get({ name: SHANGHAI_POSTGRESQL_DROPET });
                const username = node_db.dropet?.text?.split(";")[0];
                const passwd = node_db.dropet?.text?.split(";")[1];
                console.log(`1.从 pond-droplet 成功取得数据库`);

                // 2.推送服务信息
                const ips = getLocalNetworkIPs();
                const dropet: PondDropet = {
                    name: POND_LOG_DROPET,
                    lan_ip: ips[0].ip,
                    port: 1002,
                };
                await pondDropetMessenger.patch({ name: POND_LOG_DROPET, dropet });
                console.log(`2.共享 pond-log 成功`);

                return {
                    type: "postgres",
                    host: node_db.dropet?.lan_ip,
                    port: node_db.dropet?.port,
                    username: username,
                    password: passwd,
                    database: node_db.dropet?.name,
                    logging: false,
                    entities: [PondLogSchema],
                };
            },
            inject: [PondDropetMessenger],
        }),
        TypeOrmModule.forFeature([PondLogSchema]),
    ],
    controllers: [PondLogController],
    providers: [PondLogDao],
})
export class AppModule {}
