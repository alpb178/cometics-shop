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
import { AuthenticatedUser } from "../common/staff.util";
import { parsePageSize } from "../common/strapi.util";
import { CreateOrderDto, UpdateOrderDto } from "./order.dto";
import { OrdersService } from "./orders.service";

@ApiTags("orders")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: "Pedidos (staff: todos, cliente: los suyos)" })
  find(
    @CurrentUser() user: AuthenticatedUser,
    @Query("pagination[pageSize]") pageSize?: string,
  ) {
    return this.ordersService.findMany(user, parsePageSize(pageSize));
  }

  @Get(":id")
  @ApiOperation({ summary: "Detalle de pedido (id numérico o documentId)" })
  async findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
  ) {
    const row = await this.ordersService.findOneOrThrow(id, user);
    return { data: await this.ordersService.serializeById(row.id) };
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
