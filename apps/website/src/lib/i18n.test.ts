import { describe, expect, test } from "vitest";
import { createLocalT } from "./i18n";

describe("i18n createT", () => {
  test("returns localized string when present", () => {
    const en = { a: { b: "B" } } as const;
    const ja = { a: { b: "ビー" } } as const;
    const t = createLocalT(ja, en);
    expect(t("a.b")).toBe("ビー");
  });

  test("falls back to English when key missing in locale", () => {
    const en = { x: { y: "YY" } } as const;
    const ja = {} as const;
    const t = createLocalT(ja, en);
    expect(t("x.y")).toBe("YY");
  });

  test("returns key when not found in any language", () => {
    const t = createLocalT({}, {});
    expect(t("nonexistent.key")).toBe("nonexistent.key");
  });
});
