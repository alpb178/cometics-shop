import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength } from "class-validator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { StaffGuard } from "../auth/staff.guard";
import {
  generateDocumentId,
  nestedQuery,
  parsePageSize,
} from "../common/strapi.util";
import { PrismaService } from "../prisma/prisma.service";

class CategoryDto {
  @IsOptional() @IsString() @MaxLength(255) name?: string;
}

@ApiTags("categories")
@Controller("categories")
export class CategoriesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: "Listar categorías (público)" })
  async find(@Query() query: Record<string, unknown>) {
    const take = parsePageSize(nestedQuery(query, "pagination", "pageSize"), 100);
    const rows = await this.prisma.categories.findMany({
      where: { published_at: { not: null } },
      orderBy: { name: "asc" },
      take,
    });
    return {
      data: rows.map((r) => this.serialize(r)),
      meta: { pagination: { page: 1, pageSize: take } },
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard, StaffGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Crear categoría (solo staff)" })
  async create(@Body("data") data: CategoryDto) {
    const now = new Date();
    const row = await this.prisma.categories.create({
      data: {
        document_id: generateDocumentId(),
        name: data.name,
        created_at: now,
        updated_at: now,
        published_at: now, // draft & publish desactivado en category
      },
    });
    return { data: this.serialize(row) };
  }

  @Put(":documentId")
  @UseGuards(JwtAuthGuard, StaffGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Renombrar categoría (solo staff)" })
  async update(
    @Param("documentId") documentId: string,
    @Body("data") data: CategoryDto,
  ) {
    const row = await this.prisma.categories.findFirst({
      where: { document_id: documentId },
    });
    if (!row) throw new NotFoundException();
    const updated = await this.prisma.categories.update({
      where: { id: row.id },
      data: { name: data.name, updated_at: new Date() },
    });
    return { data: this.serialize(updated) };
  }

  @Delete(":documentId")
  @UseGuards(JwtAuthGuard, StaffGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Eliminar categoría (solo staff)" })
  async delete(@Param("documentId") documentId: string) {
    const row = await this.prisma.categories.findFirst({
      where: { document_id: documentId },
    });
    if (!row) throw new NotFoundException();
    await this.prisma.categories.deleteMany({
      where: { document_id: documentId },
    });
    return { data: this.serialize(row) };
  }

  private serialize(row: {
    id: number;
    document_id: string | null;
    name: string | null;
    created_at: Date | null;
    updated_at: Date | null;
    published_at: Date | null;
  }) {
    return {
      id: row.id,
      documentId: row.document_id,
      name: row.name,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      publishedAt: row.published_at,
    };
  }
}
