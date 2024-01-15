import { Module, Injectable } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DropletHost, DROPLET_SHANGHAI_POSTGRESQL, DROPLET_STREAM_LOG } from "qqlx-core";
import { StreamLogSchema } from "qqlx-cdk";
import { getLocalNetworkIPs, DropletHostRpc } from "qqlx-sdk";

import { DropletModule } from "../_/droplet.module";
import StreamLogController from "./log.controller";
import { StreamLogService } from "./log.service";
import { StreamLogDao } from "./log.dao";

export const HTTP_PORT = 8002

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
            inject: [DropletHostRpc],
            useFactory: async (pondDropletMessenger: DropletHostRpc) => {
                const node_db = await pondDropletMessenger.get({ key: DROPLET_SHANGHAI_POSTGRESQL });
                const mess = node_db?.remark?.split(";") || [];
                const dbname = mess[0];
                const username = mess[1];
                const passwd = mess[2];

                console.log("\n");
                console.log(`🌊 qqlx-droplet-host:get - ${DROPLET_SHANGHAI_POSTGRESQL}`);
                console.log(`🌊 rest.module.ts at ${HTTP_PORT} ✔`);
                console.log("\n");

                return {
                    type: "postgres",
                    host: node_db?.lan_ip,
                    port: node_db?.port,
                    username: username,
                    password: passwd,
                    database: dbname,
                    logging: false,
                    entities: [StreamLogSchema],
                };
            },
        }),
        TypeOrmModule.forFeature([StreamLogSchema]),
    ],
    providers: [DropletHostRpc, StreamLogDao, StreamLogService],
    controllers: [StreamLogController],
})
export class RestModule { }
