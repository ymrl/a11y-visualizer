import { afterEach, describe, expect, test } from "vitest";
import { LabelAssociatedControl } from ".";

describe("label-associated-control", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("label", () => {
    const element = document.createElement("label");
    document.body.appendChild(element);
    const result = LabelAssociatedControl.evaluate(
      element,
      { enabled: true },
      {},
    );
    expect(result).toEqual([
      {
        type: "warning",
        ruleName: "label-associated-control",
        message: "Not associated with any control",
      },
    ]);
  });

  test("label with for", () => {
    const element = document.createElement("label");
    element.setAttribute("for", "input");
    document.body.appendChild(element);
    const input = document.createElement("input");
    input.id = "input";
    document.body.appendChild(input);
    const result = LabelAssociatedControl.evaluate(
      element,
      { enabled: true },
      {},
    );
    expect(result).toBeUndefined();
  });

  test("label with for and hidden input", () => {
    const element = document.createElement("label");
    element.setAttribute("for", "input");
    document.body.appendChild(element);
    const input = document.createElement("input");
    input.id = "input";
    input.type = "hidden";
    document.body.appendChild(input);
    const result = LabelAssociatedControl.evaluate(
      element,
      { enabled: true },
      {},
    );
    expect(result).toEqual([
      {
        type: "warning",
        ruleName: "label-associated-control",
        message: "Not associated with any control",
      },
    ]);
  });

  test("label has input as a child", () => {
    const element = document.createElement("label");
    const input = document.createElement("input");
    element.appendChild(input);
    document.body.appendChild(element);
    const result = LabelAssociatedControl.evaluate(
      element,
      { enabled: true },
      {},
    );
    expect(result).toBeUndefined();
  });

  test("iframe: label[for] resolves inside iframe document", () => {
    const iframe = document.createElement("iframe");
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentDocument;
    if (!iframeDoc) throw new Error("no contentDocument");
    iframeDoc.open();
    iframeDoc.write(
      "<!doctype html><html><body>\n" +
        '  <input id="name" type="text">\n' +
        '  <label for="name">Name</label>\n' +
        "</body></html>",
    );
    iframeDoc.close();
    const label = iframeDoc.querySelector("label");
    if (!label) throw new Error("missing label");

    const result = LabelAssociatedControl.evaluate(
      label as HTMLLabelElement,
      { enabled: true },
      {},
    );
    expect(result).toBeUndefined();
  });
});
