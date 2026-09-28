import { describe, expect, it } from "vitest";

describe("Hotmart webhook endpoint", () => {
  it("accepts the configured token and reports sandbox", async () => {
    const token = process.env.HOTMART_WEBHOOK_TOKEN;
    expect(token, "HOTMART_WEBHOOK_TOKEN não configurado").toBeTruthy();
    const base = process.env.FIRMA_TEST_URL ?? "http://127.0.0.1:3000";
    const response = await fetch(`${base}/api/hotmart/webhook/health`, {
      headers: { "x-hotmart-hottok": token! },
      signal: AbortSignal.timeout(10_000),
    });
    expect(response.ok, `endpoint respondeu HTTP ${response.status}`).toBe(true);
    await expect(response.json()).resolves.toMatchObject({ ok: true, environment: process.env.HOTMART_ENV ?? "sandbox" });
  }, 15_000);

  it("rejects a wrong token", async () => {
    const base = process.env.FIRMA_TEST_URL ?? "http://127.0.0.1:3000";
    const response = await fetch(`${base}/api/hotmart/webhook/health`, {
      headers: { "x-hotmart-hottok": "wrong-token" },
      signal: AbortSignal.timeout(10_000),
    });
    expect(response.status).toBe(401);
  }, 15_000);
});
