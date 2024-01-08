import { Controller, Query, Body, Get, Post, Patch, UseGuards } from "@nestjs/common";

import { StreamLog, PATH_STREAM_LOG, getStreamLogDto, getStreamLogRes, postStreamLogDto, postStreamLogRes } from "qqlx-core";
import { toNumber, toString, ToResponse, getPageDto } from "qqlx-cdk";
import { getLocalNetworkIPs, UserGuard } from "qqlx-sdk";

import { StreamLogDao } from "./log.dao";
import { StreamLogService } from "./log.service";

@Controller(PATH_STREAM_LOG)
export default class {
    constructor(
        //
        private readonly StreamLogService: StreamLogService
    ) { }

    @Post("/get")
    @ToResponse()
    async get (@Body() dto: getStreamLogDto<StreamLog>) {
        return this.StreamLogService.get(dto);
    }
}
