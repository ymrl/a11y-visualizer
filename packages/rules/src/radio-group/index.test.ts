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

  test("radios in different forms are not grouped together", () => {
    const form1 = document.createElement("form");
    document.body.appendChild(form1);
    const form2 = document.createElement("form");
    document.body.appendChild(form2);
    const element = document.createElement("input");
    element.type = "radio";
    element.name = "group";
    form1.appendChild(element);
    const element2 = document.createElement("input");
    element2.type = "radio";
    element2.name = "group";
    form2.appendChild(element2);
    const result = RadioGroup.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "error",
        message: "Ungrouped radio button",
        ruleName: "radio-group",
      },
    ]);
  });

  test("radios grouped across DOM via form attribute", () => {
    const form = document.createElement("form");
    form.id = "myform";
    document.body.appendChild(form);
    const element = document.createElement("input");
    element.type = "radio";
    element.name = "group";
    element.setAttribute("form", "myform");
    document.body.appendChild(element);
    const element2 = document.createElement("input");
    element2.type = "radio";
    element2.name = "group";
    element2.setAttribute("form", "myform");
    document.body.appendChild(element2);
    const result = RadioGroup.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
  });

  test("form attribute overrides ancestor form for grouping", () => {
    const form = document.createElement("form");
    document.body.appendChild(form);
    // 祖先のformに属する同名ラジオがあっても、form属性で別オーナーを
    // 指すラジオは同じグループにならない
    const inForm = document.createElement("input");
    inForm.type = "radio";
    inForm.name = "group";
    form.appendChild(inForm);
    const element = document.createElement("input");
    element.type = "radio";
    element.name = "group";
    element.setAttribute("form", "nonexistent");
    form.appendChild(element);
    const result = RadioGroup.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "error",
        message: "Ungrouped radio button",
        ruleName: "radio-group",
      },
    ]);
  });
});
