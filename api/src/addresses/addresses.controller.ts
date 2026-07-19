import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser } from "../common/current-user.decorator";
import { AuthenticatedUser } from "../common/staff.util";
import { parsePageSize } from "../common/strapi.util";
import { AddressDto } from "./address.dto";
import { AddressesService } from "./addresses.service";

@ApiTags("addresses")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("addresses")
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  @ApiOperation({ summary: "Direcciones del usuario autenticado" })
  async find(
    @CurrentUser() user: AuthenticatedUser,
    @Query("pagination[pageSize]") pageSize?: string,
  ) {
    const data = await this.addressesService.findAllForUser(
      user.id,
      parsePageSize(pageSize),
    );
    return { data };
  }

  @Post()
  @ApiOperation({ summary: "Crear dirección para el usuario autenticado" })
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body("data") data: AddressDto,
  ) {
    return { data: await this.addressesService.create(user.id, data) };
  }

  @Put(":id")
  @ApiOperation({ summary: "Actualizar dirección propia" })
  async update(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id", ParseIntPipe) id: number,
    @Body("data") data: AddressDto,
  ) {
    return { data: await this.addressesService.update(id, user.id, data) };
  }

  @Delete(":id")
  @ApiOperation({ summary: "Eliminar dirección propia" })
  async delete(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id", ParseIntPipe) id: number,
  ) {
    return { data: await this.addressesService.delete(id, user.id) };
  }
}
