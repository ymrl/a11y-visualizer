import { afterEach, describe, expect, test } from "vitest";
import { AccessibleName } from ".";

describe("accessible-name", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("div", () => {
    const element = document.createElement("div");
    document.body.appendChild(element);
    expect(
      AccessibleName.evaluate(element, { enabled: true }, {}),
    ).toBeUndefined();
  });

  test("div with content", () => {
    const element = document.createElement("div");
    document.body.appendChild(element);
    expect(
      AccessibleName.evaluate(
        element,
        { enabled: true },
        { name: "Hello, World!" },
      ),
    ).toBeUndefined();
  });

  test("div with role", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "button");
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

  test("div with aria-label without role", () => {
    const element = document.createElement("div");
    element.setAttribute("aria-label", "Hello, World!");
    document.body.appendChild(element);
    expect(AccessibleName.evaluate(element, { enabled: true }, {})).toEqual([
      {
        type: "error",
        message: "Cannot be named",
        ruleName: "accessible-name",
      },
    ]);
  });

  test("prohibited role", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "caption");
    element.textContent = "Hello, World!";
    document.body.appendChild(element);
    expect(
      AccessibleName.evaluate(element, { enabled: true }, {}),
    ).toBeUndefined();
  });

  test("prohibited role with aria-label", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "caption");
    element.setAttribute("aria-label", "Hello, World!");
    document.body.appendChild(element);
    expect(AccessibleName.evaluate(element, { enabled: true }, {})).toEqual([
      {
        type: "error",
        message: "Cannot be named",
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

  test("img element with name", () => {
    const element = document.createElement("img");
    element.setAttribute("alt", "Hello, Image!");
    document.body.appendChild(element);
    expect(AccessibleName.evaluate(element, { enabled: true }, {})).toEqual([
      {
        type: "name",
        content: "Hello, Image!",
        ruleName: "accessible-name",
      },
    ]);
  });

  test("svg element with aria-label", () => {
    const element = document.createElement("svg");
    element.setAttribute("aria-label", "Hello, SVG!");
    document.body.appendChild(element);
    expect(AccessibleName.evaluate(element, { enabled: true }, {})).toEqual([
      {
        type: "name",
        content: "Hello, SVG!",
        ruleName: "accessible-name",
      },
    ]);
  });

  test("element with role img has name", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "img");
    element.setAttribute("aria-label", "Hello, Role!");
    document.body.appendChild(element);
    expect(AccessibleName.evaluate(element, { enabled: true }, {})).toEqual([
      {
        type: "name",
        content: "Hello, Role!",
        ruleName: "accessible-name",
      },
    ]);
  });

  test("svg element with title", () => {
    const element = document.createElement("svg");
    const title = document.createElement("title");
    title.textContent = "Chart data";
    element.appendChild(title);
    document.body.appendChild(element);
    const result = AccessibleName.evaluate(element, { enabled: true }, {});

    expect(result).toEqual([
      {
        type: "name",
        content: "Chart data",
        ruleName: "accessible-name",
      },
    ]);
  });

  test("warning role without naming", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "term");
    document.body.appendChild(element);
    expect(
      AccessibleName.evaluate(element, { enabled: true }, {}),
    ).toBeUndefined();
  });

  test("warning role with title", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "term");
    element.setAttribute("title", "Hello, World!");
    document.body.appendChild(element);
    expect(AccessibleName.evaluate(element, { enabled: true }, {})).toEqual([
      {
        type: "name",
        content: "Hello, World!",
        ruleName: "accessible-name",
      },
    ]);
  });

  test("name with warning", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "term");
    element.setAttribute("aria-label", "Hello, World!");
    document.body.appendChild(element);
    expect(AccessibleName.evaluate(element, { enabled: true }, {})).toEqual([
      {
        type: "name",
        content: "Hello, World!",
        ruleName: "accessible-name",
      },
      {
        type: "warning",
        message: "Should not be named",
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

  test('element with aria-hidden="true"', () => {
    const element = document.createElement("button");
    element.setAttribute("aria-hidden", "true");
    element.textContent = "Hidden Button";
    document.body.appendChild(element);
    expect(AccessibleName.evaluate(element, { enabled: true }, {})).toEqual(
      undefined,
    );
  });

  test("element with aria-hidden ancestor", () => {
    const parent = document.createElement("div");
    parent.setAttribute("aria-hidden", "true");
    const element = document.createElement("button");
    element.textContent = "Button in Hidden Container";
    parent.appendChild(element);
    document.body.appendChild(parent);
    expect(AccessibleName.evaluate(element, { enabled: true }, {})).toEqual(
      undefined,
    );
  });

  test("svg element with aria-hidden", () => {
    const element = document.createElement("svg");
    element.setAttribute("aria-hidden", "true");
    element.setAttribute("aria-label", "Hidden Chart");
    document.body.appendChild(element);
    expect(AccessibleName.evaluate(element, { enabled: true }, {})).toEqual(
      undefined,
    );
  });
});
