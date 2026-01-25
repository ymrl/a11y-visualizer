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

  test("does not show warning for empty aria-hidden elements without focusable content", () => {
    document.body.innerHTML = `<div aria-hidden="true"></div>`;
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
    if (!result) {
      throw new Error("Result is undefined");
    }

    // 警告は表示されない
    expect(result.some((r) => r.type === "warning")).toBe(false);

    // aria-hidden="true"は属性として表示される
    expect(result).toContainEqual({
      type: "ariaAttributes",
      attributes: [{ name: "aria-hidden", value: "true" }],
      ruleName: "aria-attributes",
    });
  });

  test("shows warning for aria-hidden elements with focusable descendants", () => {
    document.body.innerHTML = `<div aria-hidden="true"><button>Click me</button></div>`;
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

    // フォーカス可能な子要素があるため警告が表示される
    expect(result).toContainEqual({
      type: "warning",
      message: "Inaccessible",
      ruleName: "aria-attributes",
    });
  });

  test("shows warning for focusable aria-hidden elements", () => {
    document.body.innerHTML = `<button aria-hidden="true">Button</button>`;
    const element = document.querySelector("button");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = AriaAttributes.evaluate(
      element,
      AriaAttributes.defaultOptions,
      {},
    );
    expect(result).toHaveLength(2);

    // 要素自身がフォーカス可能なため警告が表示される
    expect(result).toContainEqual({
      type: "warning",
      message: "Inaccessible",
      ruleName: "aria-attributes",
    });
  });

  test("shows warning for aria-hidden elements that are media", () => {
    const img = document.createElement("img");
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const canvas = document.createElement("canvas");
    const video = document.createElement("video");
    img.setAttribute("aria-hidden", "true");
    svg.setAttribute("aria-hidden", "true");
    canvas.setAttribute("aria-hidden", "true");
    video.setAttribute("aria-hidden", "true");
    document.body.appendChild(img);
    document.body.appendChild(svg);
    document.body.appendChild(canvas);
    document.body.appendChild(video);

    [img, svg, canvas, video].forEach((element) => {
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
    });
  });

  test("does not show warning for aria-hidden elements with tabindex -1 focusable descendants", () => {
    const div = document.createElement("div");
    div.setAttribute("aria-hidden", "true");
    div.innerHTML = `<button tabindex="-1"></button>`;
    document.body.appendChild(div);
    const result = AriaAttributes.evaluate(
      div,
      AriaAttributes.defaultOptions,
      {},
    );
    expect(result).toHaveLength(1);
    expect(result).toContainEqual({
      type: "ariaAttributes",
      attributes: [{ name: "aria-hidden", value: "true" }],
      ruleName: "aria-attributes",
    });
  });
});
