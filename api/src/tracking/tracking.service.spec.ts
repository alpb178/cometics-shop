import { laPazStartOfToday } from "../common/time.util";
import { TrackingService } from "./tracking.service";

describe("TrackingService.getTopProducts", () => {
  const prismaMock = { $queryRaw: jest.fn() };
  const service = new TrackingService(prismaMock as never, {
    get: () => undefined,
  } as never);

  /** `since` is the only value interpolated into the query. */
  const sinceOfLastCall = (): Date => prismaMock.$queryRaw.mock.calls[0][1];

  beforeEach(() => {
    prismaMock.$queryRaw.mockReset().mockResolvedValue([]);
  });

  it("with period=today it starts at 00:00 Bolivia time, not 24 h ago", async () => {
    await service.getTopProducts({ days: 1, limit: 5, today: true });
    expect(sinceOfLastCall().getTime()).toBe(laPazStartOfToday().getTime());
  });

  it("without today it uses the rolling `days`-day window", async () => {
    await service.getTopProducts({ days: 30, limit: 5 });
    const expected = Date.now() - 30 * 86400000;
    // Generous margin: little time passes between the service's and the test's calculation
    expect(Math.abs(sinceOfLastCall().getTime() - expected)).toBeLessThan(5000);
  });

  it("today ignores `days` (1 day and 30 give the same window)", async () => {
    await service.getTopProducts({ days: 1, limit: 5, today: true });
    const withOneDay = sinceOfLastCall().getTime();
    prismaMock.$queryRaw.mockReset().mockResolvedValue([]);
    await service.getTopProducts({ days: 30, limit: 5, today: true });
    expect(sinceOfLastCall().getTime()).toBe(withOneDay);
  });
});
