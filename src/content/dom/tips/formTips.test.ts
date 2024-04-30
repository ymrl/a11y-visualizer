import { describe, test, expect, afterEach } from "vitest";
import { formTips } from "./formTips";

describe("formTips()", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });
  test("div", () => {
    const element = document.createElement("div");
    expect(formTips(element)).toEqual([]);
  });

  test("empty input", () => {
    const element = document.createElement("input");
    document.body.appendChild(element);
    const result = formTips(element);
    expect(result).toHaveLength(1);
    expect(result.find((t) => t.type === "error")).toEqual({
      type: "error",
      content: "messages.noName",
    });
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
    ).not.toBeUndefined;
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
    expect(result.find((t) => t.type === "error")).toEqual({
      type: "error",
      content: "messages.noRadioGroup",
    });
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
    expect(result.find((t) => t.type === "warning")).toEqual({
      type: "warning",
      content: "messages.noControlForLabel",
    });
  });

  test("label for no input", () => {
    const label = document.createElement("label");
    label.textContent = "Name";
    document.body.appendChild(label);
    const result = formTips(label);
    expect(result).toHaveLength(1);
    expect(result.find((t) => t.type === "warning")).toEqual({
      type: "warning",
      content: "messages.noControlForLabel",
    });
  });
});
