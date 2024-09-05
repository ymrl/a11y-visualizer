import { afterEach, describe, expect, test } from "vitest";
import { LinkHref } from ".";

describe("link-href", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("a with href", () => {
    const element = document.createElement("a");
    element.setAttribute("href", "https://example.com");
    document.body.appendChild(element);
    const result = LinkHref.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
  });

  test("a without href", () => {
    const element = document.createElement("a");
    document.body.appendChild(element);
    const result = LinkHref.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "warning",
        ruleName: "link-href",
        message: "No href attribute",
      },
    ]);
  });

  test("area with href", () => {
    const element = document.createElement("area");
    element.setAttribute("href", "https://example.com");
    element.setAttribute("shape", "rect");
    element.setAttribute("coords", "34,44,270,350");
    const map = document.createElement("map");
    map.appendChild(element);
    document.body.appendChild(map);
    const result = LinkHref.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
  });

  test("area without href", () => {
    const element = document.createElement("area");
    element.setAttribute("shape", "rect");
    element.setAttribute("coords", "34,44,270,350");
    const map = document.createElement("map");
    map.appendChild(element);
    document.body.appendChild(map);
    const result = LinkHref.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "warning",
        ruleName: "link-href",
        message: "No href attribute",
      },
    ]);
  });

  test("svg a with xlink:href", () => {
    const element = document.createElementNS("http://www.w3.org/2000/svg", "a");
    element.setAttribute("xlink:href", "https://example.com");
    document.body.appendChild(element);
    const result = LinkHref.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
  });

  test("svg a without xlink:href", () => {
    const element = document.createElementNS("http://www.w3.org/2000/svg", "a");
    document.body.appendChild(element);
    const result = LinkHref.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "warning",
        ruleName: "link-href",
        message: "No href attribute",
      },
    ]);
  });

  test("disabled", () => {
    const element = document.createElement("a");
    document.body.appendChild(element);
    const result = LinkHref.evaluate(element, { enabled: false }, {});
    expect(result).toBeUndefined();
  });
});
