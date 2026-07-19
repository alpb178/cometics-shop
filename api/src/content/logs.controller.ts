import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { generateDocumentId } from "../common/strapi.util";
import { PrismaService } from "../prisma/prisma.service";

class LogDto {
  @IsOptional() @IsString() time?: string;
  @IsOptional() @IsString() product?: string;
  @IsOptional() @IsString() description?: string;
}

@ApiTags("logs")
@Controller("logs")
export class LogsController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  @ApiOperation({ summary: "Registrar log (best-effort desde el front)" })
  async create(@Body("data") data: LogDto) {
    const now = new Date();
    const row = await this.prisma.logs.create({
      data: {
        document_id: generateDocumentId(),
        time: data?.time,
        product: data?.product,
        description: data?.description,
        locale: "en",
        created_at: now,
        updated_at: now,
        published_at: now,
      },
    });
    return { data: { id: row.id, documentId: row.document_id } };
  }
}
