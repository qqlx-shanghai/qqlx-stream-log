import { Module, Injectable } from "@nestjs/common";

import { PondNodeService } from "qqlx-sdk"


@Module({
    providers: [PondNodeService],
    exports: [PondNodeService],
})
export class DbConnectionModule { }