import { Module } from "@nestjs/common";
import { ComponentsService } from "./components.service";
import { FaqsController } from "./faqs.controller";
import { LogsController } from "./logs.controller";
import { SocialNetworksController } from "./social-networks.controller";

@Module({
  controllers: [FaqsController, SocialNetworksController, LogsController],
  providers: [ComponentsService],
  exports: [ComponentsService],
})
export class ContentModule {}
