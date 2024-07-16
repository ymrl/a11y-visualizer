import { describe, test, expect, afterEach } from "vitest";
import { AriaState } from ".";

const invalidValueError = {
  type: "error",
  ruleName: "aria-state",
  message: "Invalid WAI-ARIA attribute value",
};

const invalidRoleError = {
  type: "error",
  ruleName: "aria-state",
  message: "Invalid role for WAI-ARIA attribute",
};
describe("aria-state", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("div", () => {
    const element = document.createElement("div");
    document.body.appendChild(element);
    const result = AriaState.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
  });

  test('aria-busy="true"', () => {
    const element = document.createElement("div");
    element.setAttribute("aria-busy", "true");
    document.body.appendChild(element);
    const result = AriaState.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "state",
        ruleName: "aria-state",
        state: "Busy: true",
      },
    ]);
  });

  test('aria-busy="false"', () => {
    const element = document.createElement("div");
    element.setAttribute("aria-busy", "false");
    document.body.appendChild(element);
    const result = AriaState.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "state",
        ruleName: "aria-state",
        state: "Busy: false",
      },
    ]);
  });

  test('aria-busy="invalid"', () => {
    const element = document.createElement("div");
    element.setAttribute("aria-busy", "invalid");
    document.body.appendChild(element);
    const result = AriaState.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([invalidValueError]);
  });

  test('aria-current="page"', () => {
    const element = document.createElement("div");
    element.setAttribute("aria-current", "page");
    document.body.appendChild(element);
    const result = AriaState.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "state",
        ruleName: "aria-state",
        state: "Current: page",
      },
    ]);
  });

  test('aria-current="invalid"', () => {
    const element = document.createElement("div");
    element.setAttribute("aria-current", "invalid");
    document.body.appendChild(element);
    const result = AriaState.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([invalidValueError]);
  });

  test('aria-checked="true"', () => {
    const element = document.createElement("div");
    element.setAttribute("role", "checkbox");
    element.setAttribute("aria-checked", "true");
    document.body.appendChild(element);
    const result = AriaState.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "state",
        ruleName: "aria-state",
        state: "Checked: true",
      },
    ]);
  });

  test('aria-checked="true" (role is invalid)', () => {
    const element = document.createElement("div");
    element.setAttribute("role", "button");
    element.setAttribute("aria-checked", "true");
    document.body.appendChild(element);
    const result = AriaState.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([invalidRoleError]);
  });

  test("checkbox", () => {
    const element = document.createElement("input");
    element.setAttribute("type", "checkbox");
    element.checked = true;
    document.body.appendChild(element);
    const result = AriaState.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "state",
        ruleName: "aria-state",
        state: "Checked: true",
      },
    ]);
  });

  test('aria-disabled="true"', () => {
    const element = document.createElement("div");
    element.setAttribute("role", "button");
    element.setAttribute("aria-disabled", "true");
    document.body.appendChild(element);
    const result = AriaState.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "state",
        ruleName: "aria-state",
        state: "Disabled: true",
      },
    ]);
  });

  test("disabled attribute", () => {
    const element = document.createElement("button");
    element.setAttribute("disabled", "disabled");
    document.body.appendChild(element);
    const result = AriaState.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "state",
        ruleName: "aria-state",
        state: "Disabled: true",
      },
    ]);
  });

  test("disabled by fieldset", () => {
    const fieldset = document.createElement("fieldset");
    fieldset.setAttribute("disabled", "disabled");
    document.body.appendChild(fieldset);
    const element = document.createElement("button");
    fieldset.appendChild(element);
    const result = AriaState.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "state",
        ruleName: "aria-state",
        state: "Disabled: true",
      },
    ]);
  });

  test("multiple states", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "button");
    element.setAttribute("aria-busy", "true");
    element.setAttribute("aria-current", "page");
    element.setAttribute("aria-disabled", "true");
    document.body.appendChild(element);
    const result = AriaState.evaluate(element, { enabled: true }, {});
    expect(result).toHaveLength(3);
    expect(
      result?.find((r) => r.type === "state" && r.state === "Busy: true"),
    ).toBeDefined();
    expect(
      result?.find((r) => r.type === "state" && r.state === "Current: page"),
    ).toBeDefined();
    expect(
      result?.find((r) => r.type === "state" && r.state === "Disabled: true"),
    ).toBeDefined();
  });

  test("multiple errors", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "button");
    element.setAttribute("aria-busy", "invalid");
    element.setAttribute("aria-current", "invalid");
    element.setAttribute("aria-checked", "true");
    element.setAttribute("aria-selected", "true");
    element.setAttribute("aria-disabled", "true");
    document.body.appendChild(element);
    const result = AriaState.evaluate(element, { enabled: true }, {});
    expect(result).toHaveLength(3);
    expect(
      result?.find(
        (r) =>
          r.type === "error" &&
          r.message === "Invalid WAI-ARIA attribute value",
      ),
    ).toBeDefined();
    expect(
      result?.find(
        (r) =>
          r.type === "error" &&
          r.message === "Invalid role for WAI-ARIA attribute",
      ),
    ).toBeDefined();
    expect(
      result?.find((r) => r.type === "state" && r.state === "Disabled: true"),
    ).toBeDefined();
  });
});
