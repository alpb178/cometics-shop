import {
  Body,
  Controller,
  Get,
  Put,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { IsNumber, IsOptional, Min } from "class-validator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { StaffGuard } from "../auth/staff.guard";
import { generateDocumentId } from "../common/strapi.util";
import { PrismaService } from "../prisma/prisma.service";
import { PricingService } from "./pricing.service";

class UpdatePricingDto {
  @IsOptional() @IsNumber() @Min(0) markupPercent?: number;
  @IsOptional() @IsNumber() @Min(0) provinceShippingCost?: number;
  @IsOptional() @IsNumber() scCenterLat?: number;
  @IsOptional() @IsNumber() scCenterLng?: number;
  @IsOptional() @IsNumber() @Min(0) scRadiusKm?: number;
}

@ApiTags("pricing-setting")
@Controller("pricing-setting")
export class PricingController {
  constructor(
    private readonly pricingService: PricingService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  @ApiOperation({ summary: "Configuración de precios y envío (single type)" })
  async find() {
    return { data: await this.pricingService.getSettings() };
  }

  @Put()
  @UseGuards(JwtAuthGuard, StaffGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Actualizar configuración (solo staff)" })
  async update(@Body("data") data: UpdatePricingDto) {
    const existing = await this.prisma.pricing_settings.findFirst({
      orderBy: { id: "asc" },
    });
    const values = {
      markup_percent: data.markupPercent,
      province_shipping_cost: data.provinceShippingCost,
      sc_center_lat: data.scCenterLat,
      sc_center_lng: data.scCenterLng,
      sc_radius_km: data.scRadiusKm,
      updated_at: new Date(),
    };
    if (existing) {
      await this.prisma.pricing_settings.update({
        where: { id: existing.id },
        data: values,
      });
    } else {
      await this.prisma.pricing_settings.create({
        data: {
          ...values,
          document_id: generateDocumentId(),
          created_at: new Date(),
          published_at: new Date(),
        },
      });
    }
    return { data: await this.pricingService.getSettings() };
  }
}
