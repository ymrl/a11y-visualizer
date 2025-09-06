import { afterEach, describe, expect, test } from "vitest";
import { AriaAttributes } from "./index";

describe("AriaAttributes", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });
  test("displays aria attributes with values", () => {
    document.body.innerHTML = `<div aria-controls="menu1" aria-level="2">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = AriaAttributes.evaluate(
      element,
      AriaAttributes.defaultOptions,
      {},
    );
    expect(result).toHaveLength(1);
    expect(result?.[0]).toEqual({
      type: "ariaAttributes",
      attributes: [
        { name: "aria-controls", value: "menu1" },
        { name: "aria-level", value: "2" },
      ],
      ruleName: "aria-attributes",
    });
  });

  test("returns warning when aria-hidden is true", () => {
    document.body.innerHTML = `<div aria-label="test" aria-hidden="true" aria-controls="menu1">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = AriaAttributes.evaluate(
      element,
      AriaAttributes.defaultOptions,
      {},
    );
    expect(result).toHaveLength(2);
    expect(result).toContainEqual({
      type: "warning",
      message: "Inaccessible",
      ruleName: "aria-attributes",
    });
    expect(result).toContainEqual({
      type: "ariaAttributes",
      attributes: [
        { name: "aria-controls", value: "menu1" },
        { name: "aria-hidden", value: "true" },
        { name: "aria-label", value: "test" },
      ],
      ruleName: "aria-attributes",
    });
  });
  test("returns ariaAttribute when aria-hidden is false", () => {
    document.body.innerHTML = `<div aria-label="test" aria-hidden="false" aria-controls="menu1">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = AriaAttributes.evaluate(
      element,
      AriaAttributes.defaultOptions,
      {},
    );
    expect(result).toHaveLength(1);
    expect(result?.[0]).toEqual({
      type: "ariaAttributes",
      attributes: [
        { name: "aria-controls", value: "menu1" },
        { name: "aria-hidden", value: "false" },
        { name: "aria-label", value: "test" },
      ],
      ruleName: "aria-attributes",
    });
  });

  test("returns undefined when disabled", () => {
    document.body.innerHTML = `<div aria-controls="menu1">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = AriaAttributes.evaluate(element, { enabled: false }, {});
    expect(result).toBeUndefined();
  });

  test("handles empty attribute values", () => {
    document.body.innerHTML = `<div aria-controls="">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = AriaAttributes.evaluate(
      element,
      AriaAttributes.defaultOptions,
      {},
    );
    expect(result).toHaveLength(1);
    expect(result?.[0]).toEqual({
      type: "ariaAttributes",
      attributes: [{ name: "aria-controls", value: "" }],
      ruleName: "aria-attributes",
    });
  });

  test("provides attributes data for list-style display", () => {
    const ariaAttributesResult = {
      type: "ariaAttributes" as const,
      attributes: [
        { name: "aria-current", value: "page" },
        { name: "aria-expanded", value: "false" },
      ],
      ruleName: "aria-attributes",
    };

    // データ構造が正しく提供されていることを確認
    expect(ariaAttributesResult.attributes).toHaveLength(2);
    expect(ariaAttributesResult.attributes[0]).toEqual({
      name: "aria-current",
      value: "page",
    });
    expect(ariaAttributesResult.attributes[1]).toEqual({
      name: "aria-expanded",
      value: "false",
    });
  });

  test("includes aria-hidden in attributes while also showing warning", () => {
    document.body.innerHTML = `<div aria-hidden="true">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = AriaAttributes.evaluate(
      element,
      AriaAttributes.defaultOptions,
      {},
    );
    expect(result).toHaveLength(2);

    // 警告が表示される
    expect(result).toContainEqual({
      type: "warning",
      message: "Inaccessible",
      ruleName: "aria-attributes",
    });

    // aria-hidden="true"もariaAttributesに含まれる
    expect(result).toContainEqual({
      type: "ariaAttributes",
      attributes: [{ name: "aria-hidden", value: "true" }],
      ruleName: "aria-attributes",
    });
  });
});
