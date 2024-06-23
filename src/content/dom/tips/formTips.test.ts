import { describe, test, expect, afterEach } from "vitest";
import { formTips, isFormControl } from "./formTips";

describe("isFormControl()", () => {
  test("div", () => {
    const element = document.createElement("div");
    expect(isFormControl(element)).toBe(false);
  });

  test("input", () => {
    const element = document.createElement("input");
    expect(isFormControl(element)).toBe(true);
  });

  test("input hidden", () => {
    const element = document.createElement("input");
    element.setAttribute("type", "hidden");
    expect(isFormControl(element)).toBe(false);
  });

  test("textarea", () => {
    const element = document.createElement("textarea");
    expect(isFormControl(element)).toBe(true);
  });

  test("select", () => {
    const element = document.createElement("select");
    expect(isFormControl(element)).toBe(true);
  });
});

describe("formTips()", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });
  test("div", () => {
    const element = document.createElement("div");
    expect(formTips(element)).toHaveLength(0);
  });

  test("empty input", () => {
    const element = document.createElement("input");
    document.body.appendChild(element);
    const result = formTips(element);
    expect(result).toHaveLength(1);
    expect(
      result.find((t) => t.type === "error" && t.content === "messages.noName"),
    ).toBeDefined();
  });

  test("labeled input", () => {
    const element = document.createElement("input");
    element.setAttribute("id", "name");
    document.body.appendChild(element);
    const label = document.createElement("label");
    label.textContent = "Name";
    label.htmlFor = "name";
    document.body.appendChild(label);
    const result = formTips(element);
    expect(result).toHaveLength(0);
  });

  test("input type = radio, noname", () => {
    const element = document.createElement("input");
    element.setAttribute("type", "radio");
    element.setAttribute("id", "name");
    document.body.appendChild(element);
    const label = document.createElement("label");
    label.textContent = "Name";
    label.htmlFor = "name";
    document.body.appendChild(label);
    const result = formTips(element);
    expect(result).toHaveLength(1);
    expect(
      result.find(
        (t) => t.type === "error" && t.content === "messages.noNameAttribute",
      ),
    ).toBeDefined;
  });

  test("input type = radio, nogropup", () => {
    const element = document.createElement("input");
    element.setAttribute("type", "radio");
    element.setAttribute("name", "name1");
    element.setAttribute("value", "1");
    element.setAttribute("id", "name1");
    document.body.appendChild(element);
    const other = document.createElement("input");
    other.setAttribute("type", "radio");
    other.setAttribute("name", "name2");
    other.setAttribute("value", "2");
    document.body.appendChild(other);
    const label = document.createElement("label");
    label.textContent = "Name1";
    label.htmlFor = "name1";
    document.body.appendChild(label);
    const result = formTips(element);
    expect(result).toHaveLength(1);
    expect(
      result.find(
        (t) => t.type === "error" && t.content === "messages.noRadioGroup",
      ),
    ).toBeDefined();
  });

  test("input type = radio", () => {
    const element = document.createElement("input");
    element.setAttribute("type", "radio");
    element.setAttribute("name", "name");
    element.setAttribute("value", "1");
    element.setAttribute("id", "name1");
    document.body.appendChild(element);
    const other = document.createElement("input");
    other.setAttribute("type", "radio");
    other.setAttribute("name", "name");
    other.setAttribute("value", "2");
    document.body.appendChild(other);
    const label = document.createElement("label");
    label.textContent = "Name1";
    label.htmlFor = "name1";
    document.body.appendChild(label);
    const result = formTips(element);
    expect(result).toHaveLength(0);
  });

  test("label for visible input", () => {
    const input = document.createElement("input");
    input.setAttribute("id", "name");
    document.body.appendChild(input);
    const label = document.createElement("label");
    label.textContent = "Name";
    label.htmlFor = "name";
    document.body.appendChild(label);
    const result = formTips(label);
    expect(result).toHaveLength(0);
  });

  test("label for hidden input", () => {
    const input = document.createElement("input");
    input.setAttribute("id", "name");
    input.setAttribute("hidden", "hidden");
    document.body.appendChild(input);
    const label = document.createElement("label");
    label.textContent = "Name";
    label.htmlFor = "name";
    document.body.appendChild(label);
    const result = formTips(label);
    expect(result).toHaveLength(1);
    expect(
      result.find(
        (t) =>
          t.type === "warning" && t.content === "messages.noControlForLabel",
      ),
    ).toBeDefined();
  });

  test("label for no input", () => {
    const label = document.createElement("label");
    label.textContent = "Name";
    document.body.appendChild(label);
    const result = formTips(label);
    expect(result).toHaveLength(1);
    expect(
      result.find(
        (t) =>
          t.type === "warning" && t.content === "messages.noControlForLabel",
      ),
    ).toBeDefined();
  });

  test("nested interactive", () => {
    const element = document.createElement("input");
    document.body.appendChild(element);
    element.setAttribute("aria-label", "Name");
    const parent = document.createElement("a");
    parent.appendChild(element);
    document.body.appendChild(parent);
    const result = formTips(element);
    expect(result).toHaveLength(1);
    expect(
      result.find(
        (t) => t.type === "error" && t.content === "messages.nestedInteractive",
      ),
    ).toBeDefined();
  });
});
