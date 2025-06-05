import { describe, test, expect, afterEach } from "vitest";
import { AriaHidden } from ".";

describe("aria-hidden", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("div", () => {
    const element = document.createElement("div");
    document.body.appendChild(element);
    const result = AriaHidden.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
  });

  test('aria-hidden="true"', () => {
    const element = document.createElement("div");
    element.setAttribute("aria-hidden", "true");
    document.body.appendChild(element);
    const result = AriaHidden.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "warning",
        ruleName: "aria-hidden",
        message: "aria-hidden",
      },
    ]);
  });

  test("disabled", () => {
    const element = document.createElement("div");
    element.setAttribute("aria-hidden", "true");
    document.body.appendChild(element);
    const result = AriaHidden.evaluate(element, { enabled: false }, {});
    expect(result).toBeUndefined();
  });
});
