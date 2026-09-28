import { describe, expect, it } from "vitest";
import { hotmartBasicToken } from "./hotmart-auth";

describe("Hotmart production API credentials", () => {
  it("obtains an OAuth access token without exposing credentials", async () => {
    expect(process.env.HOTMART_ENV).toBe("production");
    const clientId = process.env.HOTMART_CLIENT_ID;
    const clientSecret = process.env.HOTMART_CLIENT_SECRET;
    expect(clientId, "HOTMART_CLIENT_ID não configurado").toBeTruthy();
    expect(clientSecret, "HOTMART_CLIENT_SECRET não configurado").toBeTruthy();
    const basicToken = hotmartBasicToken(clientId!, clientSecret!);

    const response = await fetch("https://api-sec-vlc.hotmart.com/security/oauth/token?grant_type=client_credentials&client_id=" + encodeURIComponent(clientId!) + "&client_secret=" + encodeURIComponent(clientSecret!), {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Basic ${basicToken}` },
      signal: AbortSignal.timeout(20_000),
    });
    const body = await response.json().catch(() => ({})) as { access_token?: string };
    expect(response.ok, `Hotmart OAuth respondeu HTTP ${response.status}`).toBe(true);
    expect(typeof body.access_token, "A resposta OAuth não trouxe access_token").toBe("string");
  }, 30_000);
});
