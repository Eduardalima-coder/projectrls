import { timingSafeEqual } from "node:crypto";

export function validHotmartToken(received: string | undefined, expected: string | undefined) {
  if (!received || !expected) return false;
  const a = Buffer.from(received);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function nonEmptyText(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : null;
}
