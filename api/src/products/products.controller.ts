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
  @ApiOperation({ summary: "Listar productos (público: publicados; status=draft: borradores)" })
  find(@Query() query: Record<string, unknown>) {
    return this.productsService.findMany({
      status: query.status === "draft" ? "draft" : "published",
      slug: nestedQuery(query, "filters", "slug"),
      pageSize: parsePageSize(nestedQuery(query, "pagination", "pageSize"), 100),
    });
  }

  @Get(":documentId")
  @ApiOperation({ summary: "Detalle de producto por documentId" })
  async findOne(
    @Param("documentId") documentId: string,
    @Query("status") status?: string,
  ) {
    const data = await this.productsService.findByDocumentId(
      documentId,
      status === "draft" ? "draft" : "published",
    );
    return { data };
  }

  @Post()
  @UseGuards(JwtAuthGuard, StaffGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Crear producto (borrador, solo staff)" })
  async create(@Body("data") data: ProductInput) {
    return { data: await this.productsService.create(data ?? {}) };
  }

  @Put(":documentId")
  @UseGuards(JwtAuthGuard, StaffGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Actualizar borrador (solo staff)" })
  async update(
    @Param("documentId") documentId: string,
    @Body("data") data: ProductInput,
  ) {
    return { data: await this.productsService.update(documentId, data ?? {}) };
  }

  @Post(":documentId/publish")
  @UseGuards(JwtAuthGuard, StaffGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Publicar borrador (solo staff)" })
  async publish(@Param("documentId") documentId: string) {
    return { data: await this.productsService.publish(documentId) };
  }

  @Post(":documentId/unpublish")
  @UseGuards(JwtAuthGuard, StaffGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Despublicar (solo staff)" })
  async unpublish(@Param("documentId") documentId: string) {
    return { data: await this.productsService.unpublish(documentId) };
  }

  @Put(":documentId/visibility")
  @UseGuards(JwtAuthGuard, StaffGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Mostrar/ocultar producto en la tienda (solo staff)" })
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
  @ApiOperation({ summary: "Eliminar producto y sus versiones (solo staff)" })
  async delete(@Param("documentId") documentId: string) {
    return { data: await this.productsService.delete(documentId) };
  }
}
