import { Controller, Query, Body, Get, Post, Patch } from "@nestjs/common";

import { PondLog, PATH_POND_LOG, getPondLogDto, getPondLogRes, postPondLogDto, postPondLogRes } from "qqlx-core";
import { toNumber, toString, ToResponse, getPageDto } from "qqlx-cdk";
import { getLocalNetworkIPs, DropletLocationMessenger } from "qqlx-sdk";

import { PondLogDao } from "./dao";
import { PondLogService } from "./service";

@Controller(PATH_POND_LOG)
export default class {
    constructor(private readonly DropletLocationMessenger: DropletLocationMessenger, private readonly PondLogService: PondLogService) {}

    @Post("/get")
    @ToResponse()
    async get(@Body() dto: getPondLogDto<PondLog>) {
        return this.PondLogService.get(dto);
    }

    @Patch()
    @ToResponse()
    async patch(@Body() dto: postPondLogDto): Promise<postPondLogRes> {
        return this.PondLogService.patch(dto);
    }
}
