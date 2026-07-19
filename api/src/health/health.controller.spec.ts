import { ConfigModule } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { HealthController } from "./health.controller";
import { HealthService } from "./health.service";

describe("HealthController", () => {
  let controller: HealthController;

  beforeEach(async () => {
    delete process.env.DATABASE_URL;
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ ignoreEnvFile: true })],
      controllers: [HealthController],
      providers: [HealthService],
    }).compile();

    controller = moduleRef.get(HealthController);
  });

  it("devuelve status ok", () => {
    const result = controller.check();
    expect(result.status).toBe("ok");
    expect(typeof result.uptime).toBe("number");
  });

  it("responde 503 si DATABASE_URL no está configurada", async () => {
    await expect(controller.checkDatabase()).rejects.toMatchObject({
      status: 503,
    });
  });
});
