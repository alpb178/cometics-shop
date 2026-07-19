import { Module } from "@nestjs/common";
import { MediaModule } from "../media/media.module";
import { CategoriesController } from "./categories.controller";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";

@Module({
  imports: [MediaModule],
  controllers: [ProductsController, CategoriesController],
  providers: [ProductsService],
})
export class ProductsModule {}
