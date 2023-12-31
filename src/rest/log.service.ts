import { Injectable } from "@nestjs/common";

import { StreamLog, PATH_STREAM_LOG, getStreamLogDto, getStreamLogRes, postStreamLogDto, postStreamLogRes } from "qqlx-core";
import { toNumber, toString, ToResponse, getPageDto } from "qqlx-cdk";
import { getLocalNetworkIPs } from "qqlx-sdk";

import { StreamLogDao } from "./log.dao";

@Injectable()
export class StreamLogService {
    constructor(
        //
        private readonly StreamLogDao: StreamLogDao
    ) { }

    async get (dto: getStreamLogDto<StreamLog>) {
        return this.StreamLogDao.page(dto);
    }

    async post (dto: postStreamLogDto): Promise<postStreamLogRes> {
        await this.StreamLogDao.insertOne(dto.schema);
        return null;
    }
}
