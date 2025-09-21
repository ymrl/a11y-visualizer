import { afterEach, describe, expect, test } from "vitest";
import { TabIndex } from "./index";

describe("TabIndex", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test('displays tabindex value for tabindex="0"', () => {
    document.body.innerHTML = `<div tabindex="0">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = TabIndex.evaluate(element, TabIndex.defaultOptions, {});
    expect(result).toHaveLength(1);
    expect(result?.[0]).toEqual({
      type: "tabIndex",
      content: `tabindex="0"`,
      ruleName: "tab-index",
    });
  });

  test('displays tabindex value for tabindex="-1"', () => {
    document.body.innerHTML = `<div tabindex="-1">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = TabIndex.evaluate(element, TabIndex.defaultOptions, {});
    expect(result).toHaveLength(1);
    expect(result?.[0]).toEqual({
      type: "tabIndex",
      content: `tabindex="-1"`,
      ruleName: "tab-index",
    });
  });

  test("warns about positive tabindex values", () => {
    document.body.innerHTML = `<div tabindex="1">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = TabIndex.evaluate(element, TabIndex.defaultOptions, {});
    expect(result).toHaveLength(2);
    expect(result?.[0]).toEqual({
      type: "warning",
      message: "Positive tabindex",
      ruleName: "tab-index",
    });
    expect(result?.[1]).toEqual({
      type: "tabIndex",
      content: `tabindex="1"`,
      ruleName: "tab-index",
    });
  });

  test("warns about large positive tabindex values", () => {
    document.body.innerHTML = `<div tabindex="999">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = TabIndex.evaluate(element, TabIndex.defaultOptions, {});
    expect(result).toHaveLength(2);
    expect(result?.[0]).toEqual({
      type: "warning",
      message: "Positive tabindex",
      ruleName: "tab-index",
    });
    expect(result?.[1]).toEqual({
      type: "tabIndex",
      content: `tabindex="999"`,
      ruleName: "tab-index",
    });
  });

  test("returns undefined for elements without tabindex", () => {
    document.body.innerHTML = `<div>Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = TabIndex.evaluate(element, TabIndex.defaultOptions, {});
    expect(result).toBeUndefined();
  });

  test("returns undefined when disabled", () => {
    document.body.innerHTML = `<div tabindex="1">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = TabIndex.evaluate(element, { enabled: false }, {});
    expect(result).toBeUndefined();
  });

  test("warns about invalid tabindex values", () => {
    document.body.innerHTML = `<div tabindex="invalid">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = TabIndex.evaluate(element, TabIndex.defaultOptions, {});
    expect(result).toHaveLength(2);
    expect(result?.[0]).toEqual({
      type: "warning",
      message: "Invalid tabindex",
      ruleName: "tab-index",
    });
    expect(result?.[1]).toEqual({
      type: "tabIndex",
      content: `tabindex="invalid"`,
      ruleName: "tab-index",
    });
  });

  test("warns about empty tabindex values", () => {
    document.body.innerHTML = `<div tabindex="">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = TabIndex.evaluate(element, TabIndex.defaultOptions, {});
    expect(result).toHaveLength(2);
    expect(result?.[0]).toEqual({
      type: "warning",
      message: "Invalid tabindex",
      ruleName: "tab-index",
    });
    expect(result?.[1]).toEqual({
      type: "tabIndex",
      content: `tabindex=""`,
      ruleName: "tab-index",
    });
  });
});
