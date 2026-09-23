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
  @ApiOperation({ summary: "Record a visit (public, 204 with no body)" })
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
  @ApiOperation({ summary: "Record a store event (public, 204)" })
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
  @ApiOperation({ summary: "Visit totals (staff only)" })
  async stats() {
    return { data: await this.trackingService.getStats() };
  }

  @Get("page-visits/top")
  @UseGuards(JwtAuthGuard, StaffGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Most visited paths (staff only)" })
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
  @ApiOperation({ summary: "Traffic sources (staff only)" })
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
  @ApiOperation({ summary: "Visits per day (staff only)" })
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
  @ApiOperation({ summary: "Today's visits per hour (staff only)" })
  async hourly() {
    return { data: await this.trackingService.getHourlyVisits() };
  }

  @Get("store-events/top-products")
  @UseGuards(JwtAuthGuard, StaffGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Most viewed products (staff only)",
    description:
      "With `?period=today` the window is the current day in Bolivia (since " +
      "00:00) and `days` is ignored; otherwise it's the last `days` days.",
  })
  async topProducts(
    @Query("days") days?: string,
    @Query("limit") limit?: string,
    @Query("period") period?: string,
  ) {
    return {
      data: await this.trackingService.getTopProducts({
        days: Number(days) || 30,
        limit: Math.min(Number(limit) || 10, 50),
        today: period === "today",
      }),
    };
  }

  @Get("store-events/product-views")
  @ApiOperation({
    summary: "People who have viewed each product's detail page (public)",
  })
  async productViews() {
    return { data: await this.trackingService.getProductViewCounts() };
  }

  @Get("store-events/group-clicks")
  @UseGuards(JwtAuthGuard, StaffGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Clicks on 'Sitios de interés' cards, per site (staff only)" })
  async groupClicks(
    @Query("days") days?: string,
    @Query("limit") limit?: string,
  ) {
    return {
      data: await this.trackingService.getGroupClicks({
        days: Math.min(Number(days) || 30, 90),
        limit: Math.min(Number(limit) || 20, 50),
      }),
    };
  }

  @Get("store-events/recent")
  @UseGuards(JwtAuthGuard, StaffGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Recent store events (staff only)" })
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
