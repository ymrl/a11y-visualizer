import { describe, expect, test } from "vitest";
import { isPage } from "./pageTips";

describe("isPage", () => {
  test("div", () => {
    const div = document.createElement("div");
    expect(isPage(div)).toBe(false);
  });

  test("body", () => {
    expect(isPage(document.body)).toBe(true);
  });
});
