import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Put,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, MaxLength } from "class-validator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { StaffGuard } from "../auth/staff.guard";
import { generateDocumentId } from "../common/strapi.util";
import { MediaService } from "../media/media.service";
import { PrismaService } from "../prisma/prisma.service";

const RELATED_TYPE = "api::payment-info.payment-info";

class UpdatePaymentInfoDto {
  @IsOptional() @IsString() @MaxLength(255) bankName?: string;
  @IsOptional() @IsString() @MaxLength(255) accountNumber?: string;
  @IsOptional() @IsString() @MaxLength(255) accountName?: string;
  @IsOptional() @IsString() @MaxLength(255) accountType?: string;
  @IsOptional() @IsString() @MaxLength(255) ci?: string;
  @IsOptional() @IsString() instructions?: string;
  @IsOptional() @IsInt() qrImage?: number | null;
}

@ApiTags("payment-info")
@Controller("payment-info")
export class PaymentInfoController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Datos de pago mostrados en el checkout (single type)" })
  async find() {
    const row = await this.prisma.payment_infos.findFirst({
      orderBy: { id: "asc" },
    });
    if (!row) throw new NotFoundException();
    return { data: await this.serialize(row) };
  }

  @Put()
  @UseGuards(JwtAuthGuard, StaffGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Actualizar datos de pago (solo staff)" })
  async update(@Body("data") data: UpdatePaymentInfoDto) {
    const existing = await this.prisma.payment_infos.findFirst({
      orderBy: { id: "asc" },
    });
    const values = {
      bank_name: data.bankName,
      account_number: data.accountNumber,
      account_name: data.accountName,
      account_type: data.accountType,
      ci: data.ci,
      instructions: data.instructions,
      updated_at: new Date(),
    };
    const row = existing
      ? await this.prisma.payment_infos.update({
          where: { id: existing.id },
          data: values,
        })
      : await this.prisma.payment_infos.create({
          data: {
            ...values,
            document_id: generateDocumentId(),
            created_at: new Date(),
            published_at: new Date(),
          },
        });

    if (data.qrImage !== undefined) {
      await this.mediaService.setRelatedFile(
        RELATED_TYPE,
        row.id,
        "qrImage",
        data.qrImage,
      );
    }
    return { data: await this.serialize(row) };
  }

  private async serialize(row: {
    id: number;
    document_id: string | null;
    bank_name: string | null;
    account_number: string | null;
    account_name: string | null;
    account_type: string | null;
    ci: string | null;
    instructions: string | null;
    created_at: Date | null;
    updated_at: Date | null;
  }) {
    const qrImage = await this.mediaService.findRelatedFile(
      RELATED_TYPE,
      row.id,
      "qrImage",
    );
    return {
      id: row.id,
      documentId: row.document_id,
      bankName: row.bank_name,
      accountNumber: row.account_number,
      accountName: row.account_name,
      accountType: row.account_type,
      ci: row.ci,
      instructions: row.instructions,
      qrImage,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
