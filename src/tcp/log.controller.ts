import { Controller, Query, Body, Get, Post, Patch } from "@nestjs/common";
import { EventPattern, MessagePattern } from "@nestjs/microservices";

import { StreamLog, PATH_STREAM_LOG, getStreamLogDto, getStreamLogRes, postStreamLogDto, postStreamLogRes } from "qqlx-core";
import { toNumber, toString, ToResponse, getPageDto } from "qqlx-cdk";
import { getLocalNetworkIPs } from "qqlx-sdk";

import { StreamLogDao } from "../rest/log.dao";
import { StreamLogService } from "../rest/log.service";

@Controller()
export default class {
    constructor(
        //
        private readonly StreamLogService: StreamLogService
    ) { }

    @MessagePattern(`${PATH_STREAM_LOG}/post`)
    @ToResponse()
    async post (@Body() dto: postStreamLogDto): Promise<postStreamLogRes> {
        return this.StreamLogService.post(dto);
    }
}
