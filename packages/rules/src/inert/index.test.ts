import { afterEach, describe, expect, test } from "vitest";
import { Inert } from ".";

// CSSの interactivity: inert はブラウザ間で対応状況が異なる（Firefox未対応）。
// 非対応ブラウザでは getComputedStyle が "inert" を返さないため、
// 該当テストは test.skipIf でスキップする。属性ベースの挙動は全ブラウザで検証する。
const supportsInteractivityInert =
  typeof CSS !== "undefined" && !!CSS.supports?.("interactivity: inert");

const warningResult = [
  {
    type: "warning",
    ruleName: "inert",
    message: "inert",
  },
];

describe("inert", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("no inert", () => {
    const element = document.createElement("div");
    document.body.appendChild(element);
    const result = Inert.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
  });

  test("inert attribute on the element itself", () => {
    const element = document.createElement("div");
    element.setAttribute("inert", "");
    document.body.appendChild(element);
    const result = Inert.evaluate(element, { enabled: true }, {});
    expect(result).toEqual(warningResult);
  });

  test("inert attribute on an ancestor", () => {
    const ancestor = document.createElement("div");
    ancestor.setAttribute("inert", "");
    const element = document.createElement("div");
    ancestor.appendChild(element);
    document.body.appendChild(ancestor);
    const result = Inert.evaluate(element, { enabled: true }, {});
    expect(result).toEqual(warningResult);
  });

  test("disabled", () => {
    const element = document.createElement("div");
    element.setAttribute("inert", "");
    document.body.appendChild(element);
    const result = Inert.evaluate(element, { enabled: false }, {});
    expect(result).toBeUndefined();
  });

  test.skipIf(!supportsInteractivityInert)("interactivity: inert style", () => {
    const element = document.createElement("div");
    element.style.setProperty("interactivity", "inert");
    document.body.appendChild(element);
    const result = Inert.evaluate(element, { enabled: true }, {});
    expect(result).toEqual(warningResult);
  });
});
