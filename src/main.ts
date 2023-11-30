import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

import { PondNode } from "qqlx-core";
import { toNumber, toString, toBoolean } from "qqlx-cdk";

import { AppModule } from "./app.module";
import { TCP_PORT, HTTP_PORT } from "./const"


async function bootstrap () {

    // 创建基于 TCP 协议的微服务
    // const microservice = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    //     transport: Transport.TCP,
    //     options: { host: "0.0.0.0", port: TCP_PORT },
    // });
    // await microservice.listen();

    // 启动 RESTful API
    const app = await NestFactory.create(AppModule);
    await app.listen(HTTP_PORT);
}
bootstrap();
