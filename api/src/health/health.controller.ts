import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { HealthService } from "./health.service";

@ApiTags("health")
@Controller("health")
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: "Estado del servicio" })
  check() {
    return this.healthService.check();
  }

  @Get("db")
  @ApiOperation({ summary: "Estado de la conexión a la base de datos" })
  checkDatabase() {
    return this.healthService.checkDatabase();
  }
}
