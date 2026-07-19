import { Module } from "@nestjs/common";
import { AddressesModule } from "../addresses/addresses.module";
import { MediaModule } from "../media/media.module";
import { PricingModule } from "../pricing/pricing.module";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";

@Module({
  imports: [PricingModule, MediaModule, AddressesModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
