import { afterEach, describe, expect, test } from "vitest";
import { Lang } from ".";

describe("lang", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("div", () => {
    const element = document.createElement("div");
    document.body.appendChild(element);
    const result = Lang.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
  });

  test("span with lang", () => {
    const element = document.createElement("span");
    element.setAttribute("lang", "en");
    document.body.appendChild(element);
    const result = Lang.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([{ type: "lang", ruleName: "lang", content: "en" }]);
  });

  test("span with xml:lang", () => {
    const element = document.createElement("span");
    element.setAttribute("xml:lang", "en");
    document.body.appendChild(element);
    const result = Lang.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([{ type: "lang", ruleName: "lang", content: "en" }]);
  });

  test("span with lang and xml:lang", () => {
    const element = document.createElement("span");
    element.setAttribute("lang", "en");
    element.setAttribute("xml:lang", "en");
    document.body.appendChild(element);
    const result = Lang.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([{ type: "lang", ruleName: "lang", content: "en" }]);
  });

  test("span with lang and xml:lang that don't match", () => {
    const element = document.createElement("span");
    element.setAttribute("lang", "en");
    element.setAttribute("xml:lang", "es");
    document.body.appendChild(element);
    const result = Lang.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "error",
        ruleName: "lang",
        message: "lang and xml:lang attributes must have the same value",
      },
    ]);
  });

  test("disabled", () => {
    const element = document.createElement("span");
    element.setAttribute("lang", "en");
    document.body.appendChild(element);
    const result = Lang.evaluate(element, { enabled: false }, {});
    expect(result).toBeUndefined();
  });
});
