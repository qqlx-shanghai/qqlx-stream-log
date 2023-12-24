import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { StreamLog, RELATIONS_STREAM_LOG } from "qqlx-core";
import { toNumber, toString, StreamLogSchema } from "qqlx-cdk";
import { getLocalNetworkIPs, PgDao } from "qqlx-sdk";

@Injectable()
export class StreamLogDao extends PgDao<StreamLog> {
    constructor(
        @InjectRepository(StreamLogSchema)
        private readonly pondLogRepository: Repository<StreamLogSchema>
    ) {
        super({
            repository: pondLogRepository,
            relations_name: RELATIONS_STREAM_LOG,
        });
    }
}
