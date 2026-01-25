import { afterEach, describe, expect, test } from "vitest";
import { Hgroup } from ".";

describe("hgroup", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });
  test("div", () => {
    const element = document.createElement("div");
    document.body.appendChild(element);
    const result = Hgroup.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
  });
  test("hgroup", () => {
    const element = document.createElement("hgroup");
    document.body.appendChild(element);
    const result = Hgroup.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "tagName",
        content: "hgroup",
        ruleName: "hgroup",
      },
    ]);
  });

  test("hgroup with role", () => {
    const element = document.createElement("hgroup");
    element.setAttribute("role", "group");
    document.body.appendChild(element);
    const result = Hgroup.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
  });

  test("disabled", () => {
    const element = document.createElement("hgroup");
    document.body.appendChild(element);
    const result = Hgroup.evaluate(element, { enabled: false }, {});
    expect(result).toBeUndefined();
  });
});
