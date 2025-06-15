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
    expect(result![0]).toEqual({
      type: "state",
      state: "aria-controls: menu1",
      ruleName: "aria-attributes",
    });
    expect(result![1]).toEqual({
      type: "state",
      state: "aria-level: 2",
      ruleName: "aria-attributes",
    });
  });

  test("ignores attributes covered by other rules", () => {
    document.body.innerHTML = `<div aria-label="test" aria-hidden="true" aria-controls="menu1">Content</div>`;
    const element = document.querySelector("div")!;
    const result = AriaAttributes.evaluate(
      element,
      AriaAttributes.defaultOptions,
      {},
    );
    expect(result).toHaveLength(1);
    expect(result![0]).toEqual({
      type: "state",
      state: "aria-controls: menu1",
      ruleName: "aria-attributes",
    });
  });

  test("returns undefined when no relevant aria attributes", () => {
    document.body.innerHTML = `<div aria-label="test">Content</div>`;
    const element = document.querySelector("div")!;
    const result = AriaAttributes.evaluate(
      element,
      AriaAttributes.defaultOptions,
      {},
    );
    expect(result).toBeUndefined();
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
      type: "state",
      state: "aria-controls: ",
      ruleName: "aria-attributes",
    });
  });
});
