import { Module, Injectable } from "@nestjs/common";
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PondNode, SHANGHAI_PG_SERVICE_NAME, POND_LOG_SERVICE_NAME } from "qqlx-core"
import { PondLogSchema } from "qqlx-cdk"
import { getLocalNetworkIPs, PondNodeService } from "qqlx-sdk";

import { HTTP_PORT } from "./const";
import { DbConnectionModule } from "./dao/_"
import { PondLogController } from "./log/controller.rest";
import { PondLogDao } from "./dao/log";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [DbConnectionModule],
            useFactory: async (pondNodeService: PondNodeService) => {

                // 1.建立数据库链接
                const node_db = await pondNodeService.getService({ keyword: SHANGHAI_PG_SERVICE_NAME })
                const username = node_db.node?.text?.split(";")[0]
                const passwd = node_db.node?.text?.split(";")[1]
                console.log(`1.建立数据库链接 成功`)

                // 2.推送服务信息
                const ips = getLocalNetworkIPs()
                const node: PondNode = {
                    name: POND_LOG_SERVICE_NAME,
                    lan_ip: ips[0].ip,
                    port: HTTP_PORT
                }
                await pondNodeService.patchService({ key: POND_LOG_SERVICE_NAME, node })
                console.log(`2.推送服务信息 成功`)

                return {
                    type: "postgres",
                    host: node_db.node?.lan_ip,
                    port: node_db.node?.port,
                    username: username,
                    password: passwd,
                    database: node_db.node?.name,
                    logging: false,
                    entities: [PondLogSchema],
                };
            },
            inject: [PondNodeService],
        }),
        TypeOrmModule.forFeature([PondLogSchema])
    ],
    controllers: [
        PondLogController
    ],
    providers: [
        PondNodeService, PondLogDao
    ],
})
export class AppModule { }
