import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { StaffGuard } from "../auth/staff.guard";
import { nestedQuery, parsePageSize } from "../common/strapi.util";
import { ProductInput, ProductsService } from "./products.service";

@ApiTags("products")
@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: "List products (public: published; status=draft: drafts)" })
  find(@Query() query: Record<string, unknown>) {
    return this.productsService.findMany({
      status: query.status === "draft" ? "draft" : "published",
      slug: nestedQuery(query, "filters", "slug"),
      pageSize: parsePageSize(nestedQuery(query, "pagination", "pageSize"), 100),
    });
  }

  @Get(":documentId")
  @ApiOperation({ summary: "Product detail by documentId" })
  async findOne(@Param("documentId") documentId: string) {
    return { data: await this.productsService.findByDocumentId(documentId) };
  }

  @Post()
  @UseGuards(JwtAuthGuard, StaffGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create product (staff only)" })
  async create(@Body("data") data: ProductInput) {
    return { data: await this.productsService.create(data ?? {}) };
  }

  @Put(":documentId")
  @UseGuards(JwtAuthGuard, StaffGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update product (staff only)" })
  async update(
    @Param("documentId") documentId: string,
    @Body("data") data: ProductInput,
  ) {
    return { data: await this.productsService.update(documentId, data ?? {}) };
  }

  @Put(":documentId/visibility")
  @UseGuards(JwtAuthGuard, StaffGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Show/hide product in the store (staff only)" })
  async setVisibility(
    @Param("documentId") documentId: string,
    @Body("data") data: { visible?: boolean },
  ) {
    return {
      data: await this.productsService.setVisible(
        documentId,
        data?.visible !== false,
      ),
    };
  }

  @Delete(":documentId")
  @UseGuards(JwtAuthGuard, StaffGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete product and its versions (staff only)" })
  async delete(@Param("documentId") documentId: string) {
    return { data: await this.productsService.delete(documentId) };
  }
}
