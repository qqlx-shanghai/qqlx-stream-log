import { Module } from "@nestjs/common";

import LogController from "./model/log.controller";
import LogService from "./model/log.service";

@Module({
    imports: [
    ],
    controllers: [
        LogController
    ],
    providers: [
        LogService
    ],
})
export class AppModule { }
