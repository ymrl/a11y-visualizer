import { afterEach, describe, expect, test } from "vitest";
import { Role } from ".";

describe("role", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("implicit role", () => {
    const element = document.createElement("button");
    document.body.appendChild(element);
    const result = Role.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
  });

  test("explicit role", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "button");
    document.body.appendChild(element);
    const result = Role.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "tagName",
        ruleName: "role",
        content: "div",
      },
      {
        type: "role",
        ruleName: "role",
        content: "button",
      },
    ]);
  });

  test("fallbacked role", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "unknown button");
    document.body.appendChild(element);
    const result = Role.evaluate(
      element,
      { enabled: true },
      { role: "button" },
    );
    expect(result).toEqual([
      {
        type: "tagName",
        ruleName: "role",
        content: "div",
      },
      {
        type: "role",
        ruleName: "role",
        content: "button",
      },
    ]);
  });

  test("unknown role", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "unknown");
    document.body.appendChild(element);
    const result = Role.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "error",
        ruleName: "role",
        message: "Unknown role",
      },
    ]);
  });
});
