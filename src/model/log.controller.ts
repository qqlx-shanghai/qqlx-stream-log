import { Controller, Query, Body, Get, Patch } from "@nestjs/common";

import { PondNode, } from "qqlx-core";
import { toNumber, toString } from "qqlx-cdk";
import { getLocalNetworkIPs } from "qqlx-sdk";

@Controller()
export default class {
    cache = new Map<string, PondNode>()

    constructor() {
    }

    @Get()
    async get (@Query() query: Record<string, string>) {
    }

    @Patch()
    async patch (@Body() body: PondNode) {
    }
}
