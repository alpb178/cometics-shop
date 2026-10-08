import { Module } from "@nestjs/common";
import { HubService } from "./hub.service";

@Module({ providers: [HubService] })
export class HubModule {}
