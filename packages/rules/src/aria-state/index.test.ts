import { afterEach, describe, expect, test } from "vitest";
import { AriaState } from ".";

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

  test('aria-busy="invalid" - no validation (handled by AriaValidation)', () => {
    const element = document.createElement("div");
    element.setAttribute("aria-busy", "invalid");
    document.body.appendChild(element);
    const result = AriaState.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
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

  test('aria-current="invalid" - no validation (handled by AriaValidation)', () => {
    const element = document.createElement("div");
    element.setAttribute("aria-current", "invalid");
    document.body.appendChild(element);
    const result = AriaState.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
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

  test('aria-checked="true" (role is invalid) - no validation (handled by AriaValidation)', () => {
    const element = document.createElement("div");
    element.setAttribute("role", "button");
    element.setAttribute("aria-checked", "true");
    document.body.appendChild(element);
    const result = AriaState.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
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

  test('aria-expanded="true"', () => {
    const element = document.createElement("div");
    element.setAttribute("role", "button");
    element.setAttribute("aria-expanded", "true");
    document.body.appendChild(element);
    const result = AriaState.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "state",
        ruleName: "aria-state",
        state: "Expanded: true",
      },
    ]);
  });

  test('aria-expanded="false"', () => {
    const element = document.createElement("div");
    element.setAttribute("role", "button");
    element.setAttribute("aria-expanded", "false");
    document.body.appendChild(element);
    const result = AriaState.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "state",
        ruleName: "aria-state",
        state: "Expanded: false",
      },
    ]);
  });

  test("summary in details", () => {
    const details = document.createElement("details");
    document.body.appendChild(details);
    const element = document.createElement("summary");
    details.appendChild(element);
    const result = AriaState.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "state",
        ruleName: "aria-state",
        state: "Expanded: false",
      },
    ]);
  });

  test("summary in open details", () => {
    const details = document.createElement("details");
    details.setAttribute("open", "open");
    document.body.appendChild(details);
    const element = document.createElement("summary");
    details.appendChild(element);
    const result = AriaState.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "state",
        ruleName: "aria-state",
        state: "Expanded: true",
      },
    ]);
  });

  test("summry is not in details", () => {
    const element = document.createElement("summary");
    document.body.appendChild(element);
    const result = AriaState.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
  });

  test('aria-invalid="true"', () => {
    const element = document.createElement("input");
    element.setAttribute("aria-invalid", "true");
    document.body.appendChild(element);
    const result = AriaState.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "state",
        ruleName: "aria-state",
        state: "Invalid: true",
      },
    ]);
  });

  test('aria-invalid="false"', () => {
    const element = document.createElement("input");
    element.setAttribute("aria-invalid", "false");
    document.body.appendChild(element);
    const result = AriaState.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "state",
        ruleName: "aria-state",
        state: "Invalid: false",
      },
    ]);
  });

  test("native invalid by pattern", () => {
    const element = document.createElement("input");
    element.setAttribute("pattern", "[a-z]");
    element.value = "1";
    document.body.appendChild(element);
    const result = AriaState.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "state",
        ruleName: "aria-state",
        state: "Invalid: true",
      },
    ]);
  });

  test("native invalid by required", () => {
    const element = document.createElement("input");
    element.setAttribute("required", "required");
    document.body.appendChild(element);
    const result = AriaState.evaluate(element, { enabled: true }, {});
    expect(result).toHaveLength(2);
    expect(result).toContainEqual({
      type: "state",
      ruleName: "aria-state",
      state: "Required: true",
    });
    expect(result).toContainEqual({
      type: "state",
      ruleName: "aria-state",
      state: "Invalid: true",
    });
  });

  test("aria-required", () => {
    const element = document.createElement("input");
    element.setAttribute("aria-required", "true");
    document.body.appendChild(element);
    const result = AriaState.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "state",
        ruleName: "aria-state",
        state: "Required: true",
      },
    ]);
  });

  test("aria-required (false)", () => {
    const element = document.createElement("input");
    element.setAttribute("aria-required", "false");
    document.body.appendChild(element);
    const result = AriaState.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "state",
        ruleName: "aria-state",
        state: "Required: false",
      },
    ]);
  });

  test("aria-readonly", () => {
    const element = document.createElement("input");
    element.setAttribute("aria-readonly", "true");
    document.body.appendChild(element);
    const result = AriaState.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "state",
        ruleName: "aria-state",
        state: "Read Only: true",
      },
    ]);
  });

  test("aria-readonly (false)", () => {
    const element = document.createElement("input");
    element.setAttribute("aria-readonly", "false");
    document.body.appendChild(element);
    const result = AriaState.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "state",
        ruleName: "aria-state",
        state: "Read Only: false",
      },
    ]);
  });

  test("readonly attribute", () => {
    const element = document.createElement("input");
    element.setAttribute("readonly", "readonly");
    document.body.appendChild(element);
    const result = AriaState.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "state",
        ruleName: "aria-state",
        state: "Read Only: true",
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
    expect(result).toContainEqual({
      type: "state",
      ruleName: "aria-state",
      state: "Busy: true",
    });
    expect(result).toContainEqual({
      type: "state",
      ruleName: "aria-state",
      state: "Current: page",
    });
    expect(result).toContainEqual({
      type: "state",
      ruleName: "aria-state",
      state: "Disabled: true",
    });
  });

  test("multiple valid states (no validation errors)", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "button");
    element.setAttribute("aria-busy", "true");
    element.setAttribute("aria-current", "page");
    element.setAttribute("aria-disabled", "true");
    document.body.appendChild(element);
    const result = AriaState.evaluate(element, { enabled: true }, {});
    expect(result).toHaveLength(3);
    expect(result).toContainEqual({
      type: "state",
      ruleName: "aria-state",
      state: "Busy: true",
    });
    expect(result).toContainEqual({
      type: "state",
      ruleName: "aria-state",
      state: "Current: page",
    });
    expect(result).toContainEqual({
      type: "state",
      ruleName: "aria-state",
      state: "Disabled: true",
    });
  });
});
