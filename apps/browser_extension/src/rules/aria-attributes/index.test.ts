import { describe, test, expect, afterEach } from "vitest";
import { AriaAttributes } from "./index";

describe("AriaAttributes", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });
  test("displays aria attributes with values", () => {
    document.body.innerHTML = `<div aria-controls="menu1" aria-level="2">Content</div>`;
    const element = document.querySelector("div")!;
    const result = AriaAttributes.evaluate(
      element,
      AriaAttributes.defaultOptions,
      {},
    );
    expect(result).toHaveLength(2);
    expect(result).toContainEqual({
      type: "ariaAttribute",
      content: "aria-controls: menu1",
      ruleName: "aria-attributes",
    });
    expect(result).toContainEqual({
      type: "ariaAttribute",
      content: "aria-level: 2",
      ruleName: "aria-attributes",
    });
  });

  test("returns warning when aria-hidden is true", () => {
    document.body.innerHTML = `<div aria-label="test" aria-hidden="true" aria-controls="menu1">Content</div>`;
    const element = document.querySelector("div")!;
    const result = AriaAttributes.evaluate(
      element,
      AriaAttributes.defaultOptions,
      {},
    );
    expect(result).toHaveLength(3);
    expect(result).toContainEqual({
      type: "ariaAttribute",
      content: "aria-controls: menu1",
      ruleName: "aria-attributes",
    });
    expect(result).toContainEqual({
      type: "ariaAttribute",
      content: "aria-label: test",
      ruleName: "aria-attributes",
    });
    expect(result).toContainEqual({
      type: "warning",
      message: "aria-hidden: true",
      ruleName: "aria-attributes",
    });
  });
  test("returns ariaAttribute when aria-hidden is false", () => {
    document.body.innerHTML = `<div aria-label="test" aria-hidden="false" aria-controls="menu1">Content</div>`;
    const element = document.querySelector("div")!;
    const result = AriaAttributes.evaluate(
      element,
      AriaAttributes.defaultOptions,
      {},
    );
    expect(result).toHaveLength(3);
    expect(result).toContainEqual({
      type: "ariaAttribute",
      content: "aria-controls: menu1",
      ruleName: "aria-attributes",
    });
    expect(result).toContainEqual({
      type: "ariaAttribute",
      content: "aria-label: test",
      ruleName: "aria-attributes",
    });
    expect(result).toContainEqual({
      type: "ariaAttribute",
      content: "aria-hidden: false",
      ruleName: "aria-attributes",
    });
  });

  test("returns undefined when disabled", () => {
    document.body.innerHTML = `<div aria-controls="menu1">Content</div>`;
    const element = document.querySelector("div")!;
    const result = AriaAttributes.evaluate(element, { enabled: false }, {});
    expect(result).toBeUndefined();
  });

  test("handles empty attribute values", () => {
    document.body.innerHTML = `<div aria-controls="">Content</div>`;
    const element = document.querySelector("div")!;
    const result = AriaAttributes.evaluate(
      element,
      AriaAttributes.defaultOptions,
      {},
    );
    expect(result).toHaveLength(1);
    expect(result![0]).toEqual({
      type: "ariaAttribute",
      content: "aria-controls: ",
      ruleName: "aria-attributes",
    });
  });
});
