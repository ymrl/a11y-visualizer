import { afterEach, describe, expect, test } from "vitest";
import { AbstractRole } from "./index";

describe("AbstractRole", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("should be enabled by default", () => {
    expect(AbstractRole.defaultOptions.enabled).toBe(true);
  });

  test("should return undefined when disabled", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "command");

    const result = AbstractRole.evaluate(element, { enabled: false }, {});
    expect(result).toBe(undefined);
  });

  test("should return undefined for elements without role attribute", () => {
    const element = document.createElement("div");

    const result = AbstractRole.evaluate(element, { enabled: true }, {});
    expect(result).toBe(undefined);
  });

  test("should return undefined for valid roles", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "button");

    const result = AbstractRole.evaluate(element, { enabled: true }, {});
    expect(result).toBe(undefined);
  });

  test("should detect abstract roles", () => {
    const abstractRoles = [
      "command",
      "composite",
      "input",
      "landmark",
      "range",
      "roletype",
      "section",
      "sectionhead",
      "select",
      "structure",
      "widget",
      "window",
    ];

    abstractRoles.forEach((role) => {
      const element = document.createElement("div");
      element.setAttribute("role", role);

      const result = AbstractRole.evaluate(
        element,
        { enabled: true },
        { role: null },
      );
      expect(result).toEqual([
        {
          type: "error",
          ruleName: "abstract-role",
          message: "Abstract role cannot be used",
        },
      ]);
    });
  });

  test("should detect abstract roles in multiple role values", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "button command");

    const result = AbstractRole.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "error",
        ruleName: "abstract-role",
        message: "Abstract role cannot be used",
      },
    ]);
  });

  test("should detect first abstract role in multiple abstract roles", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "command widget");

    const result = AbstractRole.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "error",
        ruleName: "abstract-role",
        message: "Abstract role cannot be used",
      },
    ]);
  });

  test("should handle whitespace in role attribute", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "  command  ");

    const result = AbstractRole.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "error",
        ruleName: "abstract-role",
        message: "Abstract role cannot be used",
      },
    ]);
  });

  test("should handle multiple whitespace separators", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "button\t\ncommand\r\n");

    const result = AbstractRole.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "error",
        ruleName: "abstract-role",
        message: "Abstract role cannot be used",
      },
    ]);
  });

  test("should return undefined for empty role attribute", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "");

    const result = AbstractRole.evaluate(element, { enabled: true }, {});
    expect(result).toBe(undefined);
  });

  test("should return undefined for whitespace-only role attribute", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "   ");

    const result = AbstractRole.evaluate(element, { enabled: true }, {});
    expect(result).toBe(undefined);
  });
});
