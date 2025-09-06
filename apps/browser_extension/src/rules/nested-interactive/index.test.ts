import { afterEach, describe, expect, test } from "vitest";
import { NestedInteractive } from ".";

const errorResult = [
  {
    type: "error",
    message: "Nested interactive element",
    ruleName: "nested-interactive",
  },
];
describe("nested-interactive", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("div", () => {
    const element = document.createElement("div");
    document.body.appendChild(element);
    const result = NestedInteractive.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
  });

  test("button", () => {
    const element = document.createElement("button");
    document.body.appendChild(element);
    const result = NestedInteractive.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
  });
  test("a", () => {
    const element = document.createElement("a");
    element.setAttribute("href", "https://example.com");
    document.body.appendChild(element);
    const result = NestedInteractive.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
  });

  test("button in button", () => {
    const element = document.createElement("button");
    const child = document.createElement("button");
    element.appendChild(child);
    document.body.appendChild(element);
    const result = NestedInteractive.evaluate(element, { enabled: true }, {});
    expect(result).toEqual(errorResult);
    const childResult = NestedInteractive.evaluate(
      child,
      { enabled: true },
      {},
    );
    expect(childResult).toEqual(errorResult);
  });

  test("a in button", () => {
    const element = document.createElement("button");
    const child = document.createElement("a");
    child.setAttribute("href", "https://example.com");
    element.appendChild(child);
    document.body.appendChild(element);
    const result = NestedInteractive.evaluate(element, { enabled: true }, {});
    expect(result).toEqual(errorResult);
    const childResult = NestedInteractive.evaluate(
      child,
      { enabled: true },
      {},
    );
    expect(childResult).toEqual(errorResult);
  });

  test("a in a", () => {
    const element = document.createElement("a");
    const child = document.createElement("a");
    child.setAttribute("href", "https://example.com");
    element.appendChild(child);
    document.body.appendChild(element);
    const result = NestedInteractive.evaluate(element, { enabled: true }, {});
    expect(result).toEqual(errorResult);
    const childResult = NestedInteractive.evaluate(
      child,
      { enabled: true },
      {},
    );
    expect(childResult).toEqual(errorResult);
  });

  test("tabindex in button", () => {
    const element = document.createElement("button");
    const child = document.createElement("div");
    child.setAttribute("tabindex", "0");
    element.appendChild(child);
    document.body.appendChild(element);
    const result = NestedInteractive.evaluate(element, { enabled: true }, {});
    expect(result).toEqual(errorResult);
    const childResult = NestedInteractive.evaluate(
      child,
      { enabled: true },
      {},
    );
    expect(childResult).toEqual(errorResult);
  });

  test("tabindex in a", () => {
    const element = document.createElement("a");
    const child = document.createElement("div");
    child.setAttribute("tabindex", "0");
    element.appendChild(child);
    document.body.appendChild(element);
    const result = NestedInteractive.evaluate(element, { enabled: true }, {});
    expect(result).toEqual(errorResult);
    const childResult = NestedInteractive.evaluate(
      child,
      { enabled: true },
      {},
    );
    expect(childResult).toEqual(errorResult);
  });

  test("input in button", () => {
    const element = document.createElement("button");
    const child = document.createElement("input");
    element.appendChild(child);
    document.body.appendChild(element);
    const result = NestedInteractive.evaluate(element, { enabled: true }, {});
    expect(result).toEqual(errorResult);
    const childResult = NestedInteractive.evaluate(
      child,
      { enabled: true },
      {},
    );
    expect(childResult).toEqual(errorResult);
  });

  test("disabled", () => {
    const element = document.createElement("button");
    const child = document.createElement("button");
    element.appendChild(child);
    document.body.appendChild(element);
    const result = NestedInteractive.evaluate(element, { enabled: false }, {});
    expect(result).toBeUndefined();
    const childResult = NestedInteractive.evaluate(
      child,
      { enabled: false },
      {},
    );
    expect(childResult).toBeUndefined();
  });
});
