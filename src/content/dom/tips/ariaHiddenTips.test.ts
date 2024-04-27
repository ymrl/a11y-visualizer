import { describe, test, expect } from "vitest";
import { ariaHiddenTips } from "./ariaHiddenTips";

describe("ariaHiddenTips()", () => {
  test("empty", () => {
    const element = document.createElement("div");
    expect(ariaHiddenTips(element)).toEqual([]);
  });

  test("aria-hidden attribute", () => {
    const element = document.createElement("div");
    element.setAttribute("aria-hidden", "true");
    expect(ariaHiddenTips(element)).toEqual([
      { type: "warning", content: "messages.ariaHidden" },
    ]);
  });

  test("aria-hidden invalid", () => {
    const element = document.createElement("div");
    element.setAttribute("aria-hidden", "false");
    expect(ariaHiddenTips(element)).toEqual([]);
  });
});
