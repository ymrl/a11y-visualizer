import { afterEach, describe, expect, test } from "vitest";
import { RadioGroup } from ".";

describe("radio-group", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("radio without name", () => {
    const element = document.createElement("input");
    element.type = "radio";
    document.body.appendChild(element);
    const result = RadioGroup.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "error",
        message: "No name attribute",
        ruleName: "radio-group",
      },
    ]);
  });

  test("radio with name but no group", () => {
    const element = document.createElement("input");
    element.type = "radio";
    element.name = "group";
    document.body.appendChild(element);
    const result = RadioGroup.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "error",
        message: "Ungrouped radio button",
        ruleName: "radio-group",
      },
    ]);
  });

  test("radio with name and group", () => {
    const element = document.createElement("input");
    element.type = "radio";
    element.name = "group";
    document.body.appendChild(element);
    const element2 = document.createElement("input");
    element2.type = "radio";
    element2.name = "group";
    document.body.appendChild(element2);
    const result = RadioGroup.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
  });
});
