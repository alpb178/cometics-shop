import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { StaffGuard } from "../auth/staff.guard";
import {
  ALLOWED_EVENT_TYPES,
  clip,
  toQuantity,
  TrackingService,
} from "./tracking.service";

@ApiTags("tracking")
@Controller()
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Post("page-visits/track")
  @HttpCode(204)
  @ApiOperation({ summary: "Registrar visita (público, 204 sin cuerpo)" })
  async trackVisit(
    @Body() body: Record<string, unknown>,
    @Headers("user-agent") userAgent?: string,
  ) {
    const path = clip(body?.path, 512);
    if (!path) throw new BadRequestException("path is required");
    await this.trackingService.trackVisit({
      path,
      referrer: clip(body?.referrer, 512),
      sessionId: clip(body?.sessionId, 128),
      userAgent: clip(userAgent, 1024),
    });
  }

  @Post("store-events/track")
  @HttpCode(204)
  @ApiOperation({ summary: "Registrar evento de tienda (público, 204)" })
  async trackEvent(@Body() body: Record<string, unknown>) {
    const type = clip(body?.type, 32);
    if (!type || !(ALLOWED_EVENT_TYPES as readonly string[]).includes(type)) {
      throw new BadRequestException("invalid event type");
    }
    await this.trackingService.trackEvent({
      type,
      label: clip(body?.label, 255),
      productSlug: clip(body?.productSlug, 255),
      quantity: toQuantity(body?.quantity),
      path: clip(body?.path, 512),
      sessionId: clip(body?.sessionId, 128),
    });
  }

  @Get("page-visits/stats")
  @UseGuards(JwtAuthGuard, StaffGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Totales de visitas (solo staff)" })
  async stats() {
    return { data: await this.trackingService.getStats() };
  }

  @Get("page-visits/top")
  @UseGuards(JwtAuthGuard, StaffGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Rutas más visitadas (solo staff)" })
  async top(@Query("days") days?: string, @Query("limit") limit?: string) {
    return {
      data: await this.trackingService.getTopPaths({
        days: Number(days) || 30,
        limit: Math.min(Number(limit) || 10, 50),
      }),
    };
  }

  @Get("page-visits/sources")
  @UseGuards(JwtAuthGuard, StaffGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Fuentes de tráfico (solo staff)" })
  async sources(@Query("days") days?: string) {
    return {
      data: await this.trackingService.getTopSources({
        days: Number(days) || 30,
      }),
    };
  }

  @Get("page-visits/daily")
  @UseGuards(JwtAuthGuard, StaffGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Visitas por día (solo staff)" })
  async daily(@Query("days") days?: string) {
    return {
      data: await this.trackingService.getDailyVisits(
        Math.min(Number(days) || 30, 90),
      ),
    };
  }

  @Get("page-visits/hourly")
  @UseGuards(JwtAuthGuard, StaffGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Visitas de hoy por hora (solo staff)" })
  async hourly() {
    return { data: await this.trackingService.getHourlyVisits() };
  }

  @Get("store-events/top-products")
  @UseGuards(JwtAuthGuard, StaffGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Productos más vistos (solo staff)" })
  async topProducts(
    @Query("days") days?: string,
    @Query("limit") limit?: string,
  ) {
    return {
      data: await this.trackingService.getTopProducts({
        days: Number(days) || 30,
        limit: Math.min(Number(limit) || 10, 50),
      }),
    };
  }

  @Get("store-events/recent")
  @UseGuards(JwtAuthGuard, StaffGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Eventos recientes de la tienda (solo staff)" })
  async recent(@Query("limit") limit?: string, @Query("type") type?: string) {
    const cleanType = clip(type, 32);
    return {
      data: await this.trackingService.getRecentEvents({
        limit: Math.min(Number(limit) || 100, 500),
        type:
          cleanType && (ALLOWED_EVENT_TYPES as readonly string[]).includes(cleanType)
            ? cleanType
            : undefined,
      }),
    };
  }
}
