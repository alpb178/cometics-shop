import {
  Injectable,
  OnModuleDestroy,
  ServiceUnavailableException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Pool } from "pg";

@Injectable()
export class HealthService implements OnModuleDestroy {
  private pool: Pool | null = null;

  constructor(private readonly config: ConfigService) {}

  check() {
    return {
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }

  async checkDatabase() {
    const databaseUrl = this.config.get<string>("DATABASE_URL");
    if (!databaseUrl) {
      throw new ServiceUnavailableException({
        database: "not_configured",
        detail: "Falta la variable de entorno DATABASE_URL",
      });
    }

    try {
      const pool = this.getPool(databaseUrl);
      await pool.query("SELECT 1");
      return { database: "up" };
    } catch (error) {
      throw new ServiceUnavailableException({
        database: "down",
        detail: error instanceof Error ? error.message : String(error),
      });
    }
  }

  private getPool(databaseUrl: string): Pool {
    if (!this.pool) {
      this.pool = new Pool({ connectionString: databaseUrl, max: 2 });
    }
    return this.pool;
  }

  async onModuleDestroy() {
    await this.pool?.end();
  }
}
