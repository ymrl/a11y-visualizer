import { afterEach, describe, expect, test } from "vitest";
import { Fieldset } from ".";

describe("fieldset", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });
  test("div", () => {
    const element = document.createElement("div");
    document.body.appendChild(element);
    const result = Fieldset.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
  });
  test("fieldset", () => {
    const element = document.createElement("fieldset");
    document.body.appendChild(element);
    const result = Fieldset.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "tagName",
        content: "fieldset",
        ruleName: "fieldset",
      },
    ]);
  });

  test("fieldset with role", () => {
    const element = document.createElement("fieldset");
    element.setAttribute("role", "group");
    document.body.appendChild(element);
    const result = Fieldset.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
  });

  test("disabled", () => {
    const element = document.createElement("fieldset");
    document.body.appendChild(element);
    const result = Fieldset.evaluate(element, { enabled: false }, {});
    expect(result).toBeUndefined();
  });
});
