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
import { nestedQuery, parsePageSize } from "../common/strapi.util";
import { CreateOrderDto, UpdateOrderDto } from "./order.dto";
import { OrdersService } from "./orders.service";

/**
 * `?scope=mine` marca la petición como "vista de cliente": fuerza el filtro por
 * propiedad y oculta el precio original, aunque quien consulte sea staff.
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
    summary: "Pedidos (staff: todos, cliente: los suyos)",
    description:
      "Con `?scope=mine` devuelve solo los pedidos del usuario autenticado, " +
      "incluso si es staff. Lo usa la vista 'Mis pedidos' del storefront.",
  })
  find(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: Record<string, unknown>,
    @Query("scope") scope?: string,
  ) {
    return this.ordersService.findMany(
      user,
      parsePageSize(nestedQuery(query, "pagination", "pageSize")),
      { onlyOwn: scope === MINE_SCOPE },
    );
  }

  @Get("stats")
  @UseGuards(StaffGuard)
  @ApiOperation({ summary: "KPIs de pedidos: total, pendientes, ingresos y serie diaria (staff)" })
  async stats(@Query("days") days?: string) {
    return {
      data: await this.ordersService.getStats(
        Math.min(Number(days) || 30, 90),
      ),
    };
  }

  @Get(":id")
  @ApiOperation({
    summary: "Detalle de pedido (id numérico o documentId)",
    description:
      "Con `?scope=mine` exige que el pedido sea del usuario autenticado " +
      "(404 si no lo es) y omite el precio original, aunque sea staff.",
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
  @ApiOperation({ summary: "Crear pedido (totales recalculados server-side)" })
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body("data") data: CreateOrderDto,
  ) {
    return { data: await this.ordersService.create(user, data) };
  }

  @Put(":id")
  @UseGuards(StaffGuard)
  @ApiOperation({ summary: "Actualizar estado/notas (solo staff)" })
  async update(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
    @Body("data") data: UpdateOrderDto,
  ) {
    return { data: await this.ordersService.update(id, user, data) };
  }

  @Delete(":id")
  @UseGuards(StaffGuard)
  @ApiOperation({ summary: "Eliminar pedido (solo staff)" })
  async delete(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) {
    return { data: await this.ordersService.delete(id, user) };
  }
}
