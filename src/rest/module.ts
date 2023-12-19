import { Module, Injectable } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DropletHost, SHANGHAI_POSTGRESQL_DROPLET, DROPLET_POND_LOG } from "qqlx-core";
import { PondLogSchema } from "qqlx-cdk";
import { getLocalNetworkIPs, DropletHostMessenger, StreamUserMessenger } from "qqlx-sdk";

import { DropletModule } from "../_/droplet.module";
import PondLogController from "./log.controller";
import { PondLogService } from "./log.service";
import { PondLogDao } from "./log.dao";

/** 相关解释
 * @imports 导入一个模块中 exports 的内容，放入公共资源池中
 * @providers 将公共资源池中的内容，放入应用池 controller 之中，所以其才能够使用/注入各种内容
 * @inject 将公共资源池中的内容，放入应用池 controller 之中，所以其才能够使用/注入各种内容
 * @controllers 指明哪些应用需要被加载
 */
@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [DropletModule],
            inject: [DropletHostMessenger],
            useFactory: async (pondDropletMessenger: DropletHostMessenger) => {
                const node_db = await pondDropletMessenger.get({ key: SHANGHAI_POSTGRESQL_DROPLET });
                const mess = node_db.droplet?.remark?.split(";") || [];
                const dbname = mess[0];
                const username = mess[1];
                const passwd = mess[2];

                console.log("\n---- ---- ---- rest.module.ts");
                console.log(`droplet-location:get - ${SHANGHAI_POSTGRESQL_DROPLET}:${node_db.droplet?.lan_ip}:${node_db.droplet?.port}`);
                console.log("---- ---- ----\n");

                return {
                    type: "postgres",
                    host: node_db.droplet?.lan_ip,
                    port: node_db.droplet?.port,
                    username: username,
                    password: passwd,
                    database: dbname,
                    logging: false,
                    entities: [PondLogSchema],
                };
            },
        }),
        TypeOrmModule.forFeature([PondLogSchema]),
    ],
    providers: [DropletHostMessenger, StreamUserMessenger, PondLogDao, PondLogService],
    controllers: [PondLogController],
})
export class RestModule { }
