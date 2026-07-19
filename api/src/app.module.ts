import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AddressesModule } from "./addresses/addresses.module";
import { AuthModule } from "./auth/auth.module";
import { ContentModule } from "./content/content.module";
import { HealthModule } from "./health/health.module";
import { MediaModule } from "./media/media.module";
import { OrdersModule } from "./orders/orders.module";
import { PaymentInfoModule } from "./payment-info/payment-info.module";
import { PricingModule } from "./pricing/pricing.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ProductsModule } from "./products/products.module";
import { TrackingModule } from "./tracking/tracking.module";
import { UploadModule } from "./upload/upload.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    MediaModule,
    PricingModule,
    PaymentInfoModule,
    AddressesModule,
    OrdersModule,
    ProductsModule,
    ContentModule,
    UploadModule,
    TrackingModule,
  ],
})
export class AppModule {}
