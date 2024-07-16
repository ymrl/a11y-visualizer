import { afterEach, describe, expect, test } from "vitest";
import { AccessibleName } from ".";

describe("accessible-name", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("div", () => {
    const element = document.createElement("div");
    document.body.appendChild(element);
    expect(AccessibleName.evaluate(element, { enabled: true }, {})).toEqual(
      undefined,
    );
  });

  test("div with name by condition", () => {
    const element = document.createElement("div");
    document.body.appendChild(element);
    expect(
      AccessibleName.evaluate(
        element,
        { enabled: true },
        { name: "Hello, World!" },
      ),
    ).toEqual([
      {
        type: "name",
        content: "Hello, World!",
        ruleName: "accessible-name",
      },
    ]);
  });

  test("button without name", () => {
    const element = document.createElement("button");
    document.body.appendChild(element);
    expect(AccessibleName.evaluate(element, { enabled: true }, {})).toEqual(
      undefined,
    );
  });

  test("button with name", () => {
    const element = document.createElement("button");
    element.textContent = "Hello, World!";
    document.body.appendChild(element);
    expect(AccessibleName.evaluate(element, { enabled: true }, {})).toEqual([
      {
        type: "name",
        content: "Hello, World!",
        ruleName: "accessible-name",
      },
    ]);
  });

  test("button with name by aria-label", () => {
    const element = document.createElement("button");
    element.setAttribute("aria-label", "Hello, World!");
    document.body.appendChild(element);
    expect(AccessibleName.evaluate(element, { enabled: true }, {})).toEqual([
      {
        type: "name",
        content: "Hello, World!",
        ruleName: "accessible-name",
      },
    ]);
  });

  test("button with name by aria-labelledby", () => {
    const element = document.createElement("button");
    const label = document.createElement("span");
    label.setAttribute("id", "label");
    label.textContent = "Hello, World!";
    document.body.appendChild(label);
    document.body.appendChild(element);
    element.setAttribute("aria-labelledby", label.id);
    expect(AccessibleName.evaluate(element, { enabled: true }, {})).toEqual([
      {
        type: "name",
        content: "Hello, World!",
        ruleName: "accessible-name",
      },
    ]);
  });

  test("area with alt", () => {
    const element = document.createElement("area");
    element.setAttribute("alt", "Hello, World!");
    element.setAttribute("href", "https://example.com/");
    element.setAttribute("shape", "rect");
    element.setAttribute("coords", "0,0,82,126");
    const map = document.createElement("map");
    map.appendChild(element);
    document.body.appendChild(map);
    expect(AccessibleName.evaluate(element, { enabled: true }, {})).toEqual([
      {
        type: "name",
        content: "Hello, World!",
        ruleName: "accessible-name",
      },
    ]);
  });

  test("area with title", () => {
    const element = document.createElement("area");
    element.setAttribute("title", "Hello, World!");
    element.setAttribute("href", "https://example.com/");
    element.setAttribute("shape", "rect");
    element.setAttribute("coords", "0,0,82,126");
    const map = document.createElement("map");
    map.appendChild(element);
    document.body.appendChild(map);
    expect(AccessibleName.evaluate(element, { enabled: true }, {})).toEqual([
      {
        type: "name",
        content: "Hello, World!",
        ruleName: "accessible-name",
      },
    ]);
  });

  test("disabled", () => {
    const element = document.createElement("button");
    element.textContent = "Hello, World!";
    document.body.appendChild(element);
    expect(AccessibleName.evaluate(element, { enabled: false }, {})).toEqual(
      undefined,
    );
  });
});
