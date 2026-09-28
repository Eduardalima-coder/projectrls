import { describe, expect, it } from "vitest";
import { nonEmptyText, validHotmartToken } from "./hotmart";

describe("Hotmart webhook security", () => {
  it("accepts exactly the configured token", () => {
    expect(validHotmartToken("sandbox-token", "sandbox-token")).toBe(true);
    expect(validHotmartToken("sandbox-token", "other-token")).toBe(false);
    expect(validHotmartToken(undefined, "sandbox-token")).toBe(false);
    expect(validHotmartToken("sandbox-token", undefined)).toBe(false);
  });

  it("normalizes optional payload text without inventing values", () => {
    expect(nonEmptyText("PURCHASE_APPROVED")).toBe("PURCHASE_APPROVED");
    expect(nonEmptyText(123)).toBeNull();
    expect(nonEmptyText("")).toBeNull();
  });
});
