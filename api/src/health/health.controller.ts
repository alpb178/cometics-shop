import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { HealthService } from "./health.service";

@ApiTags("health")
@Controller("health")
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: "Service status" })
  check() {
    return this.healthService.check();
  }

  @Get("db")
  @ApiOperation({ summary: "Database connection status" })
  checkDatabase() {
    return this.healthService.checkDatabase();
  }
}
