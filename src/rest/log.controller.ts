import { Controller, Query, Body, Get, Post, Patch, UseGuards } from "@nestjs/common";

import { PondLog, PATH_POND_LOG, getPondLogDto, getPondLogRes, postPondLogDto, postPondLogRes } from "qqlx-core";
import { toNumber, toString, ToResponse, getPageDto } from "qqlx-cdk";
import { getLocalNetworkIPs, DropletLocationMessenger, UserGuard, PondUserMessenger } from "qqlx-sdk";

import { PondLogDao } from "./log.dao";
import { PondLogService } from "./log.service";

@Controller(PATH_POND_LOG)
@UseGuards(UserGuard)
export default class {
    constructor(
        //
        private readonly PondLogService: PondLogService
    ) {}

    @Patch()
    @ToResponse()
    async patch(@Body() dto: postPondLogDto): Promise<postPondLogRes> {
        return this.PondLogService.patch(dto);
    }

    @Post("/get")
    @ToResponse()
    async get(@Body() dto: getPondLogDto<PondLog>) {
        return this.PondLogService.get(dto);
    }
}
