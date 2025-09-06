import { afterEach, describe, expect, test } from "vitest";
import { ControlName } from ".";

const errorResult = [
  {
    type: "error",
    ruleName: "control-name",
    message: "No accessible name",
  },
];

describe("control-name", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("button with name", () => {
    const element = document.createElement("button");
    element.textContent = "button";
    document.body.appendChild(element);
    const result = ControlName.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
  });

  test("button without name", () => {
    const element = document.createElement("button");
    document.body.appendChild(element);
    const result = ControlName.evaluate(element, { enabled: true }, {});
    expect(result).toEqual(errorResult);
  });

  test("button with aria-label", () => {
    const element = document.createElement("button");
    element.setAttribute("aria-label", "label");
    document.body.appendChild(element);
    const result = ControlName.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
  });

  ["submit", "reset", "button"].forEach((type) => {
    test(`input[type="${type}"] with name`, () => {
      const element = document.createElement("input");
      element.setAttribute("type", type);
      element.setAttribute("value", "input");
      document.body.appendChild(element);
      const result = ControlName.evaluate(element, { enabled: true }, {});
      expect(result).toBeUndefined();
    });

    test(`input[type="${type}"] without name`, () => {
      const element = document.createElement("input");
      element.setAttribute("type", type);
      document.body.appendChild(element);
      const result = ControlName.evaluate(element, { enabled: true }, {});
      if (type === "button") {
        expect(result).toEqual(errorResult);
      } else {
        expect(result).toBeUndefined();
      }
    });
  });

  test("input[type=image] with name", () => {
    const element = document.createElement("input");
    element.setAttribute("type", "image");
    element.setAttribute("alt", "image");
    document.body.appendChild(element);
    const result = ControlName.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
  });

  test("input[type=image] without name", () => {
    const element = document.createElement("input");
    element.setAttribute("type", "image");
    document.body.appendChild(element);
    const result = ControlName.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
  });

  ["input", "select", "textarea"].forEach((tagName) => {
    test(`${tagName} without name`, () => {
      const element = document.createElement(tagName);
      document.body.appendChild(element);
      const result = ControlName.evaluate(element, { enabled: true }, {});
      expect(result).toEqual(errorResult);
    });

    test(`${tagName} with label`, () => {
      const element = document.createElement(tagName);
      element.setAttribute("id", "input");
      const label = document.createElement("label");
      label.setAttribute("for", "input");
      label.textContent = "label";
      document.body.appendChild(label);
      document.body.appendChild(element);
      const result = ControlName.evaluate(element, { enabled: true }, {});
      expect(result).toBeUndefined();
    });
  });

  ["text", "password", "email", "tel", "url"].forEach((type) => {
    test(`input[type="${type}"] with name`, () => {
      const element = document.createElement("input");
      element.setAttribute("type", type);
      element.setAttribute("id", type);
      const label = document.createElement("label");
      label.setAttribute("for", type);
      label.textContent = "label";
      document.body.appendChild(label);
      document.body.appendChild(element);
      const result = ControlName.evaluate(element, { enabled: true }, {});
      expect(result).toBeUndefined();
    });
    test(`input[type="${type}"] without name`, () => {
      const element = document.createElement("input");
      element.setAttribute("type", type);
      document.body.appendChild(element);
      const result = ControlName.evaluate(element, { enabled: true }, {});
      expect(result).toEqual(errorResult);
    });
  });

  test("details > summary:first-child with name", () => {
    const element = document.createElement("details");
    const summary = document.createElement("summary");
    summary.textContent = "summary";
    element.appendChild(summary);
    document.body.appendChild(element);
    const result = ControlName.evaluate(summary, { enabled: true }, {});
    expect(result).toBeUndefined();
  });

  test("details > summary:first-child without name", () => {
    const element = document.createElement("details");
    const summary = document.createElement("summary");
    element.appendChild(summary);
    document.body.appendChild(element);
    const result = ControlName.evaluate(summary, { enabled: true }, {});
    expect(result).toEqual(errorResult);
  });

  [
    "button",
    "menuitem",
    "tab",
    "checkbox",
    "combobox",
    "listbox",
    "radio",
    "searchbox",
    "slider",
    "spinbutton",
    "switch",
    "textbox",
    "menuitemcheckbox",
    "menuitemradio",
    "link",
  ].forEach((role) => {
    test(`role=${role} with name`, () => {
      const element = document.createElement("div");
      element.setAttribute("role", role);
      element.setAttribute("aria-label", "label");
      document.body.appendChild(element);
      const result = ControlName.evaluate(element, { enabled: true }, {});
      expect(result).toBeUndefined();
    });

    test(`role=${role} without name`, () => {
      const element = document.createElement("div");
      element.setAttribute("role", role);
      document.body.appendChild(element);
      const result = ControlName.evaluate(element, { enabled: true }, {});
      expect(result).toEqual(errorResult);
    });
  });

  test("a with name", () => {
    const element = document.createElement("a");
    element.setAttribute("href", "https://example.com");
    element.textContent = "link";
    document.body.appendChild(element);
    const result = ControlName.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
  });

  test("a without name", () => {
    const element = document.createElement("a");
    element.setAttribute("href", "https://example.com");
    document.body.appendChild(element);
    const result = ControlName.evaluate(element, { enabled: true }, {});
    expect(result).toEqual(errorResult);
  });

  test("area without name", () => {
    const element = document.createElement("area");
    element.setAttribute("href", "https://example.com");
    const mapElement = document.createElement("map");
    document.body.appendChild(mapElement);
    mapElement.appendChild(element);
    const result = ControlName.evaluate(element, { enabled: true }, {});
    expect(result).toEqual(errorResult);
  });

  test("area without href", () => {
    const element = document.createElement("area");
    element.setAttribute("href", "https://example.com");
    element.setAttribute("alt", "Hello");
    const mapElement = document.createElement("map");
    document.body.appendChild(mapElement);
    mapElement.appendChild(element);
    const result = ControlName.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
  });

  test("disabled", () => {
    const element = document.createElement("button");
    document.body.appendChild(element);
    const result = ControlName.evaluate(element, { enabled: false }, {});
    expect(result).toBeUndefined();
  });
});
