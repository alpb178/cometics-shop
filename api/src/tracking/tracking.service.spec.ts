import { laPazStartOfToday } from "../common/time.util";
import { TrackingService } from "./tracking.service";

describe("TrackingService.getTopProducts", () => {
  const prismaMock = { $queryRaw: jest.fn() };
  const service = new TrackingService(prismaMock as never, {
    get: () => undefined,
  } as never);

  /** El `since` es el único valor interpolado en la consulta. */
  const sinceOfLastCall = (): Date => prismaMock.$queryRaw.mock.calls[0][1];

  beforeEach(() => {
    prismaMock.$queryRaw.mockReset().mockResolvedValue([]);
  });

  it("con period=today arranca en las 00:00 de Bolivia, no hace 24 h", async () => {
    await service.getTopProducts({ days: 1, limit: 5, today: true });
    expect(sinceOfLastCall().getTime()).toBe(laPazStartOfToday().getTime());
  });

  it("sin today usa la ventana móvil de `days` días", async () => {
    await service.getTopProducts({ days: 30, limit: 5 });
    const expected = Date.now() - 30 * 86400000;
    // Margen amplio: entre el cálculo del servicio y el del test pasa poco tiempo
    expect(Math.abs(sinceOfLastCall().getTime() - expected)).toBeLessThan(5000);
  });

  it("today ignora `days` (1 día y 30 dan la misma ventana)", async () => {
    await service.getTopProducts({ days: 1, limit: 5, today: true });
    const withOneDay = sinceOfLastCall().getTime();
    prismaMock.$queryRaw.mockReset().mockResolvedValue([]);
    await service.getTopProducts({ days: 30, limit: 5, today: true });
    expect(sinceOfLastCall().getTime()).toBe(withOneDay);
  });
});
