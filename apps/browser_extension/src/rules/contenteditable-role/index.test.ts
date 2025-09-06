import { afterEach, describe, expect, test } from "vitest";
import { ContenteditableRole } from "./index";

describe("ContenteditableRole", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("returns undefined when disabled", () => {
    document.body.innerHTML = `<div contenteditable="true">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = ContenteditableRole.evaluate(
      element,
      { enabled: false },
      {},
    );
    expect(result).toBeUndefined();
  });

  test("returns warning for contenteditable without role", () => {
    document.body.innerHTML = `<div contenteditable="true">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = ContenteditableRole.evaluate(
      element,
      ContenteditableRole.defaultOptions,
      {},
    );
    expect(result).toHaveLength(1);
    expect(result?.[0]).toEqual({
      type: "warning",
      message: "Should have an appropriate role",
      ruleName: "contenteditable-role",
    });
  });

  test("returns undefined for contenteditable with textbox role", () => {
    document.body.innerHTML = `<div contenteditable="true" role="textbox">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = ContenteditableRole.evaluate(
      element,
      ContenteditableRole.defaultOptions,
      {},
    );
    expect(result).toBeUndefined();
  });

  test("returns undefined for contenteditable with searchbox role", () => {
    document.body.innerHTML = `<div contenteditable="true" role="searchbox">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = ContenteditableRole.evaluate(
      element,
      ContenteditableRole.defaultOptions,
      {},
    );
    expect(result).toBeUndefined();
  });

  test("returns undefined for contenteditable with combobox role", () => {
    document.body.innerHTML = `<div contenteditable="true" role="combobox">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = ContenteditableRole.evaluate(
      element,
      ContenteditableRole.defaultOptions,
      {},
    );
    expect(result).toBeUndefined();
  });

  test("returns warning for contenteditable with inappropriate role", () => {
    document.body.innerHTML = `<div contenteditable="true" role="button">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = ContenteditableRole.evaluate(
      element,
      ContenteditableRole.defaultOptions,
      {},
    );
    expect(result).toHaveLength(1);
    expect(result?.[0]).toEqual({
      type: "warning",
      message: "Has inappropriate role for text input",
      ruleName: "contenteditable-role",
    });
  });

  test("works with contenteditable='' (empty string)", () => {
    document.body.innerHTML = `<div contenteditable="">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = ContenteditableRole.evaluate(
      element,
      ContenteditableRole.defaultOptions,
      {},
    );
    expect(result).toHaveLength(1);
    expect(result?.[0]).toEqual({
      type: "warning",
      message: "Should have an appropriate role",
      ruleName: "contenteditable-role",
    });
  });

  test("works if contenteditable=false (invalid)", () => {
    document.body.innerHTML = `<div contenteditable="false">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = ContenteditableRole.evaluate(
      element,
      ContenteditableRole.defaultOptions,
      {},
    );
    expect(result?.[0]).toEqual({
      type: "warning",
      message: "Should have an appropriate role",
      ruleName: "contenteditable-role",
    });
  });

  test("ignores non-contenteditable elements", () => {
    document.body.innerHTML = `<div>Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = ContenteditableRole.evaluate(
      element,
      ContenteditableRole.defaultOptions,
      {},
    );
    expect(result).toBeUndefined();
  });
});
