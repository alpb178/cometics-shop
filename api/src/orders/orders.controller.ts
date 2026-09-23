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
import { CurrentUser } from "../common/current-user.decorator";
import { AuthenticatedUser, isStaffUser } from "../common/staff.util";
import { nestedQuery, parsePage, parsePageSize } from "../common/strapi.util";
import { CreateOrderDto, UpdateOrderDto } from "./order.dto";
import { OrdersService } from "./orders.service";

/**
 * `?scope=mine` marks the request as a "customer view": it forces the ownership
 * filter and hides the original price, even when the caller is staff.
 */
const MINE_SCOPE = "mine";

@ApiTags("orders")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({
    summary: "Orders (staff: all, customer: their own)",
    description:
      "With `?scope=mine` it returns only the authenticated user's orders, " +
      "even for staff. Used by the storefront's 'My orders' view.",
  })
  find(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: Record<string, unknown>,
    @Query("scope") scope?: string,
  ) {
    return this.ordersService.findMany(
      user,
      parsePageSize(nestedQuery(query, "pagination", "pageSize")),
      {
        onlyOwn: scope === MINE_SCOPE,
        page: parsePage(nestedQuery(query, "pagination", "page")),
      },
    );
  }

  @Get("stats")
  @UseGuards(StaffGuard)
  @ApiOperation({ summary: "Order KPIs: total, pending, revenue and daily series (staff)" })
  async stats(@Query("days") days?: string) {
    return {
      data: await this.ordersService.getStats(
        Math.min(Number(days) || 30, 90),
      ),
    };
  }

  @Get(":id")
  @ApiOperation({
    summary: "Order detail (numeric id or documentId)",
    description:
      "With `?scope=mine` it requires the order to belong to the authenticated " +
      "user (404 otherwise) and omits the original price, even for staff.",
  })
  async findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
    @Query("scope") scope?: string,
  ) {
    const onlyOwn = scope === MINE_SCOPE;
    const row = await this.ordersService.findOneOrThrow(id, user, { onlyOwn });
    return {
      data: await this.ordersService.serializeById(row.id, {
        includeOriginalPrice: !onlyOwn && isStaffUser(user),
      }),
    };
  }

  @Post()
  @ApiOperation({ summary: "Create an order (totals recomputed server-side)" })
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body("data") data: CreateOrderDto,
  ) {
    return { data: await this.ordersService.create(user, data) };
  }

  @Put(":id")
  @UseGuards(StaffGuard)
  @ApiOperation({ summary: "Update status/notes (staff only)" })
  async update(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
    @Body("data") data: UpdateOrderDto,
  ) {
    return { data: await this.ordersService.update(id, user, data) };
  }

  @Delete(":id")
  @UseGuards(StaffGuard)
  @ApiOperation({ summary: "Delete order (staff only)" })
  async delete(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) {
    return { data: await this.ordersService.delete(id, user) };
  }
}
