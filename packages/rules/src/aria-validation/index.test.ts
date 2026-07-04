import { afterEach, describe, expect, test } from "vitest";
import { AriaValidation } from "./index";

describe("AriaValidation", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("validates aria-label with valid value", () => {
    document.body.innerHTML = `<div role="button" aria-label="Click me">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = AriaValidation.evaluate(
      element,
      AriaValidation.defaultOptions,
      {},
    );
    expect(result).toBeUndefined();
  });

  test("reports error for invalid aria-haspopup value with attribute name", () => {
    document.body.innerHTML = `<div role="button" aria-haspopup="invalid">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = AriaValidation.evaluate(
      element,
      AriaValidation.defaultOptions,
      {},
    );
    expect(result).toHaveLength(1);
    expect(result?.[0]).toEqual({
      type: "error",
      message: "Invalid WAI-ARIA attribute value: {{attribute}}",
      messageParams: { attribute: "aria-haspopup" },
      ruleName: "aria-validation",
    });
  });

  test("reports error for aria-level on invalid role with attribute and role name", () => {
    document.body.innerHTML = `<div role="button" aria-level="2">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = AriaValidation.evaluate(
      element,
      AriaValidation.defaultOptions,
      {},
    );
    expect(result).toHaveLength(1);
    expect(result?.[0]).toEqual({
      type: "error",
      message: "Invalid role for WAI-ARIA attribute: {{attribute}}",
      messageParams: { attribute: "aria-level" },
      ruleName: "aria-validation",
    });
  });

  test("validates aria-level on valid role", () => {
    document.body.innerHTML = `<div role="heading" aria-level="2">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = AriaValidation.evaluate(
      element,
      AriaValidation.defaultOptions,
      {},
    );
    expect(result).toBeUndefined();
  });

  test("validates integer attributes", () => {
    document.body.innerHTML = `<div role="grid" aria-colcount="5">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = AriaValidation.evaluate(
      element,
      AriaValidation.defaultOptions,
      {},
    );
    expect(result).toBeUndefined();
  });

  test("reports error for invalid integer value with attribute name", () => {
    document.body.innerHTML = `<div role="grid" aria-colcount="not-a-number">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = AriaValidation.evaluate(
      element,
      AriaValidation.defaultOptions,
      {},
    );
    expect(result).toHaveLength(1);
    expect(result?.[0]).toEqual({
      type: "error",
      message: "Invalid WAI-ARIA attribute value: {{attribute}}",
      messageParams: { attribute: "aria-colcount" },
      ruleName: "aria-validation",
    });
  });

  test("validates aria-hidden attribute", () => {
    document.body.innerHTML = `<div aria-hidden="true">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = AriaValidation.evaluate(
      element,
      AriaValidation.defaultOptions,
      {},
    );
    expect(result).toBeUndefined();
  });

  test("reports invalid aria-hidden value", () => {
    document.body.innerHTML = `<div aria-hidden="invalid">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = AriaValidation.evaluate(
      element,
      AriaValidation.defaultOptions,
      {},
    );
    expect(result).toHaveLength(1);
    expect(result?.[0]).toEqual({
      type: "error",
      message: "Invalid WAI-ARIA attribute value: {{attribute}}",
      messageParams: { attribute: "aria-hidden" },
      ruleName: "aria-validation",
    });
  });

  test("validates id-reference-list attributes", () => {
    document.body.innerHTML = `<div aria-describedby="desc1 desc2 desc3">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = AriaValidation.evaluate(
      element,
      AriaValidation.defaultOptions,
      {},
    );
    expect(result).toBeUndefined();
  });

  test("validates empty id-reference-list", () => {
    document.body.innerHTML = `<div aria-describedby="">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = AriaValidation.evaluate(
      element,
      AriaValidation.defaultOptions,
      {},
    );
    expect(result).toBeUndefined();
  });

  test("returns undefined when disabled", () => {
    document.body.innerHTML = `<div role="button" aria-haspopup="invalid">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = AriaValidation.evaluate(element, { enabled: false }, {});
    expect(result).toBeUndefined();
  });

  test("ignores elements without aria attributes", () => {
    document.body.innerHTML = `<div role="button">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = AriaValidation.evaluate(
      element,
      AriaValidation.defaultOptions,
      {},
    );
    expect(result).toBeUndefined();
  });

  test("validates multiple attributes with mixed results", () => {
    document.body.innerHTML = `<div role="button" aria-label="Valid" aria-haspopup="invalid">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = AriaValidation.evaluate(
      element,
      AriaValidation.defaultOptions,
      {},
    );
    expect(result).toHaveLength(1);
    expect(result?.[0]).toEqual({
      type: "error",
      message: "Invalid WAI-ARIA attribute value: {{attribute}}",
      messageParams: { attribute: "aria-haspopup" },
      ruleName: "aria-validation",
    });
  });

  test("validates AriaState attributes - valid aria-checked", () => {
    document.body.innerHTML = `<div role="checkbox" aria-checked="true">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = AriaValidation.evaluate(
      element,
      AriaValidation.defaultOptions,
      {},
    );
    expect(result).toBeUndefined();
  });

  test("reports error for invalid AriaState attribute value", () => {
    document.body.innerHTML = `<div role="checkbox" aria-checked="invalid">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = AriaValidation.evaluate(
      element,
      AriaValidation.defaultOptions,
      {},
    );
    expect(result).toHaveLength(1);
    expect(result?.[0]).toEqual({
      type: "error",
      message: "Invalid WAI-ARIA attribute value: {{attribute}}",
      messageParams: { attribute: "aria-checked" },
      ruleName: "aria-validation",
    });
  });

  test("reports error for AriaState attribute on invalid role", () => {
    document.body.innerHTML = `<div role="heading" aria-checked="true">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = AriaValidation.evaluate(
      element,
      AriaValidation.defaultOptions,
      {},
    );
    expect(result).toHaveLength(1);
    expect(result?.[0]).toEqual({
      type: "error",
      message: "Invalid role for WAI-ARIA attribute: {{attribute}}",
      messageParams: { attribute: "aria-checked" },
      ruleName: "aria-validation",
    });
  });

  test("validates global AriaState attributes on any role", () => {
    document.body.innerHTML = `<div role="button" aria-busy="true">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = AriaValidation.evaluate(
      element,
      AriaValidation.defaultOptions,
      {},
    );
    expect(result).toBeUndefined();
  });

  test("validates aria-relevant with single value", () => {
    document.body.innerHTML = `<div aria-live="polite" aria-relevant="additions">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = AriaValidation.evaluate(
      element,
      AriaValidation.defaultOptions,
      {},
    );
    expect(result).toBeUndefined();
  });

  test("validates aria-relevant with multiple values", () => {
    document.body.innerHTML = `<div aria-live="polite" aria-relevant="additions text">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = AriaValidation.evaluate(
      element,
      AriaValidation.defaultOptions,
      {},
    );
    expect(result).toBeUndefined();
  });

  test("validates aria-relevant with all valid values", () => {
    document.body.innerHTML = `<div aria-live="polite" aria-relevant="additions removals text all">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = AriaValidation.evaluate(
      element,
      AriaValidation.defaultOptions,
      {},
    );
    expect(result).toBeUndefined();
  });

  test("rejects aria-relevant with invalid values", () => {
    document.body.innerHTML = `<div aria-live="polite" aria-relevant="additions invalid">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = AriaValidation.evaluate(
      element,
      AriaValidation.defaultOptions,
      {},
    );
    expect(result).toHaveLength(1);
    expect(result?.[0]).toEqual({
      type: "error",
      message: "Invalid WAI-ARIA attribute value: {{attribute}}",
      messageParams: { attribute: "aria-relevant" },
      ruleName: "aria-validation",
    });
  });

  // aria-modal is valid on both dialog and alertdialog (ARIA 1.2)
  test("validates aria-modal on alertdialog role", () => {
    document.body.innerHTML = `<div role="alertdialog" aria-modal="true">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = AriaValidation.evaluate(
      element,
      AriaValidation.defaultOptions,
      {},
    );
    expect(result).toBeUndefined();
  });

  test("validates aria-modal on dialog role", () => {
    document.body.innerHTML = `<div role="dialog" aria-modal="true">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = AriaValidation.evaluate(
      element,
      AriaValidation.defaultOptions,
      {},
    );
    expect(result).toBeUndefined();
  });

  // meter is a range subclass, aria-value* attributes are valid (ARIA 1.2)
  test("validates aria-valuenow on meter role", () => {
    document.body.innerHTML = `<div role="meter" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = AriaValidation.evaluate(
      element,
      AriaValidation.defaultOptions,
      {},
    );
    expect(result).toBeUndefined();
  });

  test("validates aria-valuetext on meter role", () => {
    document.body.innerHTML = `<div role="meter" aria-valuenow="50" aria-valuetext="50 percent">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = AriaValidation.evaluate(
      element,
      AriaValidation.defaultOptions,
      {},
    );
    expect(result).toBeUndefined();
  });

  // -1 is a valid "unknown total" value for count/setsize attributes (ARIA 1.2)
  test("validates aria-colcount with -1 (unknown)", () => {
    document.body.innerHTML = `<div role="grid" aria-colcount="-1">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = AriaValidation.evaluate(
      element,
      AriaValidation.defaultOptions,
      {},
    );
    expect(result).toBeUndefined();
  });

  test("validates aria-rowcount with -1 (unknown)", () => {
    document.body.innerHTML = `<div role="grid" aria-rowcount="-1">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = AriaValidation.evaluate(
      element,
      AriaValidation.defaultOptions,
      {},
    );
    expect(result).toBeUndefined();
  });

  test("validates aria-setsize with -1 (unknown)", () => {
    document.body.innerHTML = `<div role="listitem" aria-setsize="-1">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = AriaValidation.evaluate(
      element,
      AriaValidation.defaultOptions,
      {},
    );
    expect(result).toBeUndefined();
  });

  test("rejects aria-colindex with -1 (must be >= 1)", () => {
    document.body.innerHTML = `<div role="row" aria-colindex="-1">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = AriaValidation.evaluate(
      element,
      AriaValidation.defaultOptions,
      {},
    );
    expect(result).toHaveLength(1);
    expect(result?.[0]).toEqual({
      type: "error",
      message: "Invalid WAI-ARIA attribute value: {{attribute}}",
      messageParams: { attribute: "aria-colindex" },
      ruleName: "aria-validation",
    });
  });

  // aria-activedescendant is valid on toolbar and spinbutton (ARIA 1.2)
  test("validates aria-activedescendant on toolbar role", () => {
    document.body.innerHTML = `<div role="toolbar" aria-activedescendant="item1">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = AriaValidation.evaluate(
      element,
      AriaValidation.defaultOptions,
      {},
    );
    expect(result).toBeUndefined();
  });

  test("validates aria-activedescendant on spinbutton role", () => {
    document.body.innerHTML = `<div role="spinbutton" aria-activedescendant="item1">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = AriaValidation.evaluate(
      element,
      AriaValidation.defaultOptions,
      {},
    );
    expect(result).toBeUndefined();
  });

  // aria-haspopup is non-global in ARIA 1.2 (only widget-like roles)
  test("validates aria-haspopup on button role", () => {
    document.body.innerHTML = `<div role="button" aria-haspopup="menu">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = AriaValidation.evaluate(
      element,
      AriaValidation.defaultOptions,
      {},
    );
    expect(result).toBeUndefined();
  });

  test("reports error for aria-haspopup on non-supported role", () => {
    document.body.innerHTML = `<div role="list" aria-haspopup="menu">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = AriaValidation.evaluate(
      element,
      AriaValidation.defaultOptions,
      {},
    );
    expect(result).toHaveLength(1);
    expect(result?.[0]).toEqual({
      type: "error",
      message: "Invalid role for WAI-ARIA attribute: {{attribute}}",
      messageParams: { attribute: "aria-haspopup" },
      ruleName: "aria-validation",
    });
  });

  // aria-errormessage is non-global in ARIA 1.2 (same roles as aria-invalid)
  test("validates aria-errormessage on textbox role", () => {
    document.body.innerHTML = `<div role="textbox" aria-errormessage="err1">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = AriaValidation.evaluate(
      element,
      AriaValidation.defaultOptions,
      {},
    );
    expect(result).toBeUndefined();
  });

  test("reports error for aria-errormessage on non-supported role", () => {
    document.body.innerHTML = `<div role="button" aria-errormessage="err1">Content</div>`;
    const element = document.querySelector("div");
    if (!element) {
      throw new Error("Element not found");
    }
    const result = AriaValidation.evaluate(
      element,
      AriaValidation.defaultOptions,
      {},
    );
    expect(result).toHaveLength(1);
    expect(result?.[0]).toEqual({
      type: "error",
      message: "Invalid role for WAI-ARIA attribute: {{attribute}}",
      messageParams: { attribute: "aria-errormessage" },
      ruleName: "aria-validation",
    });
  });
});
