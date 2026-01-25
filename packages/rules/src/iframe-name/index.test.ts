import { afterEach, describe, expect, test } from "vitest";
import { IframeName } from ".";

describe("iframe-name", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("div", () => {
    const element = document.createElement("div");
    document.body.appendChild(element);
    const result = IframeName.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
  });

  test("iframe with title attribute", () => {
    const element = document.createElement("iframe");
    element.setAttribute("title", "Sample content iframe");
    element.setAttribute("src", "about:blank");
    document.body.appendChild(element);
    const result = IframeName.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
  });

  test("iframe without title attribute", () => {
    const element = document.createElement("iframe");
    element.setAttribute("src", "about:blank");
    document.body.appendChild(element);
    const result = IframeName.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "error",
        message: "No title attribute",
        ruleName: "iframe-name",
      },
    ]);
  });

  test("iframe with empty title", () => {
    const element = document.createElement("iframe");
    element.setAttribute("title", "");
    element.setAttribute("src", "about:blank");
    document.body.appendChild(element);
    const result = IframeName.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "warning",
        message: "Empty title attribute",
        ruleName: "iframe-name",
      },
    ]);
  });

  test("iframe with aria-hidden", () => {
    const element = document.createElement("iframe");
    element.setAttribute("title", "Sample content iframe");
    element.setAttribute("aria-hidden", "true");
    element.setAttribute("src", "about:blank");
    document.body.appendChild(element);
    const result = IframeName.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
  });

  test("iframe with presentation role", () => {
    const element = document.createElement("iframe");
    element.setAttribute("title", "Sample content iframe");
    element.setAttribute("role", "presentation");
    element.setAttribute("src", "about:blank");
    document.body.appendChild(element);
    const result = IframeName.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
  });

  test("iframe with aria-label", () => {
    const element = document.createElement("iframe");
    element.setAttribute("aria-label", "Sample content iframe");
    element.setAttribute("src", "about:blank");
    document.body.appendChild(element);
    const result = IframeName.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
  });

  test("disabled", () => {
    const element = document.createElement("iframe");
    element.setAttribute("title", "Sample content iframe");
    element.setAttribute("src", "about:blank");
    document.body.appendChild(element);
    const result = IframeName.evaluate(element, { enabled: false }, {});
    expect(result).toBeUndefined();
  });
});
