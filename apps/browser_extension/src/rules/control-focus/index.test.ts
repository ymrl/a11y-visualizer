import { afterEach, describe, expect, test } from "vitest";
import { ControlFocus } from ".";

const errorResult = [
  {
    type: "error",
    ruleName: "control-focus",
    message: "Not focusable",
  },
];
const warningResult = [
  {
    type: "warning",
    ruleName: "control-focus",
    message: "Not focusable",
  },
];

describe("control-focus", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("button", () => {
    const element = document.createElement("button");
    document.body.appendChild(element);
    const result = ControlFocus.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
  });

  test('role="button"', () => {
    const element = document.createElement("div");
    element.setAttribute("role", "button");
    document.body.appendChild(element);
    const result = ControlFocus.evaluate(element, { enabled: true }, {});
    expect(result).toEqual(errorResult);
  });

  test('role="button" with tabindex', () => {
    const element = document.createElement("div");
    element.setAttribute("role", "button");
    element.setAttribute("tabindex", "0");
    document.body.appendChild(element);
    const result = ControlFocus.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
  });

  test("button tabindex=-1", () => {
    const element = document.createElement("button");
    element.setAttribute("tabindex", "-1");
    document.body.appendChild(element);
    const result = ControlFocus.evaluate(element, { enabled: true }, {});
    expect(result).toEqual(warningResult);
  });

  test("disabled", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "button");
    document.body.appendChild(element);
    const result = ControlFocus.evaluate(element, { enabled: false }, {});
    expect(result).toBeUndefined();
  });

  test("aria-disabled", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "button");
    element.setAttribute("aria-disabled", "true");
    document.body.appendChild(element);
    const result = ControlFocus.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
  });
});
