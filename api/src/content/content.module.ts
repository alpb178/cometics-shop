import { Module } from "@nestjs/common";
import { MediaModule } from "../media/media.module";
import { ComponentsService } from "./components.service";
import { ContentController } from "./content.controller";
import { FaqsController } from "./faqs.controller";
import { LogsController } from "./logs.controller";
import { SocialNetworksController } from "./social-networks.controller";

@Module({
  imports: [MediaModule],
  controllers: [
    ContentController,
    FaqsController,
    SocialNetworksController,
    LogsController,
  ],
  providers: [ComponentsService],
  exports: [ComponentsService],
})
export class ContentModule {}
