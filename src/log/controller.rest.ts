import { Controller, Query, Body, Get, Post, Patch } from "@nestjs/common";

import { PondLog, POND_LOG_PATH, getPondLogDto, getPondLogRes, postPondLogDto, postPondLogRes } from "qqlx-core";
import { toNumber, toString, ToResponse, getPageDto } from "qqlx-cdk";
import { getLocalNetworkIPs } from "qqlx-sdk";

import { PondLogDao } from "./dao";

@Controller()
export class PondLogController {
    constructor(private readonly PondLogDao: PondLogDao) {}

    @Post(POND_LOG_PATH + "/get")
    @ToResponse()
    async get(@Body() request: getPondLogDto<PondLog>) {
        // const { page } = request
        const page = getPageDto<PondLog>();
        const results = await this.PondLogDao.page(page);

        return results;
    }

    @Patch(POND_LOG_PATH)
    @ToResponse()
    async patch(@Body() body: postPondLogDto): Promise<postPondLogRes> {
        console.log(body.dto);
        await this.PondLogDao.insertOne(body.dto);
        return null;
    }
}
