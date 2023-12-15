import { Module, Injectable } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PondDroplet, SHANGHAI_POSTGRESQL_DROPLET, DROPLET_POND_LOG } from "qqlx-core";
import { PondLogSchema } from "qqlx-cdk";
import { getLocalNetworkIPs, PondDropletMessenger } from "qqlx-sdk";

import { DropletModule } from "./droplet/module";
import PondLogController from "./log/controller.rest";
import { PondLogService } from "./log/service";
import { PondLogDao } from "./log/dao";


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
            inject: [PondDropletMessenger],
            useFactory: async (pondDropletMessenger: PondDropletMessenger) => {
                const node_db = await pondDropletMessenger.get({ name: SHANGHAI_POSTGRESQL_DROPLET });
                const username = node_db.droplet?.text?.split(";")[0];
                const passwd = node_db.droplet?.text?.split(";")[1];

                console.log("\n---- ---- ---- rest.module.ts");
                console.log(`pond-droplet:get - ${SHANGHAI_POSTGRESQL_DROPLET}:${node_db.droplet?.lan_ip}:${node_db.droplet?.port}`);

                const ips = getLocalNetworkIPs();
                const droplet: PondDroplet = pondDropletMessenger.getSchema()
                droplet.name = DROPLET_POND_LOG
                droplet.lan_ip = ips[0].ip
                droplet.port = 1002
                pondDropletMessenger.keepAlive(droplet) // async
                console.log(`pond-droplet:patch ing... - ${DROPLET_POND_LOG}:${droplet.lan_ip}:${droplet.port}`);
                console.log("---- ---- ----\n");

                return {
                    type: "postgres",
                    host: node_db.droplet?.lan_ip,
                    port: node_db.droplet?.port,
                    username: username,
                    password: passwd,
                    database: node_db.droplet?.name,
                    logging: false,
                    entities: [PondLogSchema],
                };
            },
        }),
        TypeOrmModule.forFeature([PondLogSchema]),
    ],
    providers: [PondDropletMessenger, PondLogDao, PondLogService],
    controllers: [PondLogController],
})
export class RestModule { }
