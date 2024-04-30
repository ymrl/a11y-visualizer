import { describe, test, expect } from "vitest";
import { ariaHiddenTips } from "./ariaHiddenTips";

describe("ariaHiddenTips()", () => {
  test("empty", () => {
    const element = document.createElement("div");
    expect(ariaHiddenTips(element)).toHaveLength(0);
  });

  test("aria-hidden attribute", () => {
    const element = document.createElement("div");
    element.setAttribute("aria-hidden", "true");
    expect(
      ariaHiddenTips(element).find(
        (t) => t.type === "warning" && t.content === "messages.ariaHidden",
      ),
    ).toBeDefined();
  });

  test("aria-hidden invalid", () => {
    const element = document.createElement("div");
    element.setAttribute("aria-hidden", "false");
    expect(ariaHiddenTips(element)).toHaveLength(0);
  });
});
