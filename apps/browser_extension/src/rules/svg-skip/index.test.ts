import { describe, test, expect, afterEach } from "vitest";
import { SvgSkip } from ".";

describe("svg-skip", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });
  test('svg with role="img"', () => {
    const element = document.createElement("svg");
    element.innerHTML = "<title>title</title>";
    element.setAttribute("role", "img");
    document.body.appendChild(element);
    const result = SvgSkip.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
  });

  test("svg without role", () => {
    const element = document.createElement("svg");
    element.innerHTML = "<title>title</title>";
    document.body.appendChild(element);
    const result = SvgSkip.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "warning",
        ruleName: "svg-skip",
        message: "May be skipped",
      },
    ]);
  });

  test('svg with role="presentation"', () => {
    const element = document.createElement("svg");
    element.innerHTML = "<title>title</title>";
    element.setAttribute("role", "presentation");
    document.body.appendChild(element);
    const result = SvgSkip.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
  });

  test('svg with aria-hidden="true"', () => {
    const element = document.createElement("svg");
    element.setAttribute("aria-hidden", "true");
    document.body.appendChild(element);
    const result = SvgSkip.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
  });

  test("svg is presentational children", () => {
    const element = document.createElement("svg");
    element.innerHTML = "<title>title</title>";
    const button = document.createElement("button");
    button.appendChild(element);
    document.body.appendChild(button);
    const result = SvgSkip.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
  });
});
