import { Module } from "@nestjs/common";
import { MediaModule } from "../media/media.module";
import { PaymentInfoController } from "./payment-info.controller";

@Module({
  imports: [MediaModule],
  controllers: [PaymentInfoController],
})
export class PaymentInfoModule {}
