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
import { IsOptional, IsString } from "class-validator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { StaffGuard } from "../auth/staff.guard";
import {
  generateDocumentId,
  nestedQuery,
  parsePageSize,
} from "../common/strapi.util";
import { PrismaService } from "../prisma/prisma.service";

class FaqDto {
  @IsOptional() @IsString() question?: string;
  @IsOptional() @IsString() answer?: string;
}

@ApiTags("faqs")
@Controller("faqs")
export class FaqsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: "Listar FAQs (público)" })
  async find(@Query() query: Record<string, unknown>) {
    const take = parsePageSize(nestedQuery(query, "pagination", "pageSize"), 100);
    const rows = await this.prisma.faqs.findMany({
      where: { published_at: { not: null } },
      orderBy: { id: "asc" },
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
  @ApiOperation({ summary: "Crear FAQ (solo staff)" })
  async create(@Body("data") data: FaqDto) {
    const now = new Date();
    const row = await this.prisma.faqs.create({
      data: {
        document_id: generateDocumentId(),
        question: data.question,
        answer: data.answer,
        locale: "en",
        created_at: now,
        updated_at: now,
        published_at: now, // draft & publish desactivado en este content-type
      },
    });
    return { data: this.serialize(row) };
  }

  @Put(":documentId")
  @UseGuards(JwtAuthGuard, StaffGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Actualizar FAQ (solo staff)" })
  async update(@Param("documentId") documentId: string, @Body("data") data: FaqDto) {
    const row = await this.findByDocumentId(documentId);
    const updated = await this.prisma.faqs.update({
      where: { id: row.id },
      data: { question: data.question, answer: data.answer, updated_at: new Date() },
    });
    return { data: this.serialize(updated) };
  }

  @Delete(":documentId")
  @UseGuards(JwtAuthGuard, StaffGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Eliminar FAQ (solo staff)" })
  async delete(@Param("documentId") documentId: string) {
    const row = await this.findByDocumentId(documentId);
    await this.prisma.faqs.deleteMany({ where: { document_id: documentId } });
    return { data: this.serialize(row) };
  }

  private async findByDocumentId(documentId: string) {
    const row = await this.prisma.faqs.findFirst({
      where: { document_id: documentId },
    });
    if (!row) throw new NotFoundException();
    return row;
  }

  private serialize(row: {
    id: number;
    document_id: string | null;
    question: string | null;
    answer: string | null;
    created_at: Date | null;
    updated_at: Date | null;
    published_at: Date | null;
  }) {
    return {
      id: row.id,
      documentId: row.document_id,
      question: row.question,
      answer: row.answer,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      publishedAt: row.published_at,
    };
  }
}
