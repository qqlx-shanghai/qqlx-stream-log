import { Module, Injectable } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DropletHost, SHANGHAI_POSTGRESQL_DROPLET, DROPLET_STREAM_LOG } from "qqlx-core";
import { StreamLogSchema } from "qqlx-cdk";
import { getLocalNetworkIPs, DropletHostMessenger } from "qqlx-sdk";

import { DropletModule } from "../_/droplet.module";
import StreamLogController from "./log.controller";
import { StreamLogService } from "../rest/log.service";
import { StreamLogDao } from "../rest/log.dao";

/** 相关解释
 * @imports 导入一个模块中 exports 的内容，放入公共资源池中
 * @providers 以及 inject，都是将公共资源池中的内容，放入应用池 controller 之中，所以其才能够使用/注入各种内容
 * @controllers 指明哪些应用需要被加载
 */
@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [DropletModule],
            inject: [DropletHostMessenger],
            useFactory: async (pondDropletMessenger: DropletHostMessenger) => {
                const node_db = await pondDropletMessenger.get({ key: SHANGHAI_POSTGRESQL_DROPLET });
                const mess = node_db?.remark?.split(";") || [];
                const dbname = mess[0];
                const username = mess[1];
                const passwd = mess[2];

                console.log("\n---- ---- ---- tcp.module.ts");
                console.log(`droplet-location:get - ${SHANGHAI_POSTGRESQL_DROPLET}:${node_db?.lan_ip}:${node_db?.port}`);

                const ips = getLocalNetworkIPs();
                const droplet: DropletHost = pondDropletMessenger.getSchema();
                droplet.lan_ip = ips[0].ip;
                droplet.port = 1002;
                pondDropletMessenger.keepAlive(DROPLET_STREAM_LOG, droplet); // async
                console.log(`droplet-location:patch ing... - ${DROPLET_STREAM_LOG}:${droplet.lan_ip}:${droplet.port}`);
                console.log("---- ---- ----\n");

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
    providers: [DropletHostMessenger, StreamLogDao, StreamLogService],
    controllers: [StreamLogController],
})
export class TcpModule {}
