import { Injectable } from "@nestjs/common";

import { PondLog, PATH_POND_LOG, getPondLogDto, getPondLogRes, postPondLogDto, postPondLogRes } from "qqlx-core";
import { toNumber, toString, ToResponse, getPageDto } from "qqlx-cdk";
import { getLocalNetworkIPs, DropletLocationMessenger } from "qqlx-sdk";

import { PondLogDao } from "./log.dao";

@Injectable()
export class PondLogService {
    constructor(
        //
        private readonly PondLogDao: PondLogDao
    ) {}

    async get(dto: getPondLogDto<PondLog>) {
        const { page } = dto;
        const results = await this.PondLogDao.page(page);

        return results;
    }

    async patch(dto: postPondLogDto): Promise<postPondLogRes> {
        await this.PondLogDao.insertOne(dto.schema);
        return null;
    }
}
