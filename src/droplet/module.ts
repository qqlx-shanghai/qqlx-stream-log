import { Module, Injectable } from "@nestjs/common";

import { PondDropetMessenger } from "qqlx-sdk";

@Module({
    providers: [PondDropetMessenger],
    exports: [PondDropetMessenger],
})
export class DropletModule {}
