import { afterEach, describe, expect, test } from "vitest";
import { HeadingLevel } from ".";

describe("heading-level", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("h1", () => {
    const element = document.createElement("h1");
    document.body.appendChild(element);
    const result = HeadingLevel.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "heading",
        content: "1",
        contentLabel: "Heading level",
        ruleName: "heading-level",
      },
    ]);
  });

  [2, 3, 4, 5, 6].forEach((level) => {
    test(`h${level}`, () => {
      const element = document.createElement(`h${level}`);
      document.body.appendChild(element);
      const result = HeadingLevel.evaluate(element, { enabled: true }, {});
      expect(result).toEqual([
        {
          type: "heading",
          content: `${level}`,
          contentLabel: "Heading level",
          ruleName: "heading-level",
        },
      ]);
    });
  });

  test("h2 with aria-level overrides the tag level", () => {
    const element = document.createElement("h2");
    element.setAttribute("aria-level", "4");
    document.body.appendChild(element);
    const result = HeadingLevel.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "heading",
        content: "4",
        contentLabel: "Heading level",
        ruleName: "heading-level",
      },
    ]);
  });

  test("h1 with empty aria-level falls back to the tag level", () => {
    const element = document.createElement("h1");
    element.setAttribute("aria-level", "");
    document.body.appendChild(element);
    const result = HeadingLevel.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "heading",
        content: "1",
        contentLabel: "Heading level",
        ruleName: "heading-level",
      },
    ]);
  });

  test("div with role=heading defaults to level 2 with a warning", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "heading");
    document.body.appendChild(element);
    const result = HeadingLevel.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "warning",
        message: "No heading level",
        ruleName: "heading-level",
      },
      {
        type: "heading",
        content: "2",
        contentLabel: "Heading level",
        ruleName: "heading-level",
      },
    ]);
  });

  test("div with role=heading and aria-level", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "heading");
    element.setAttribute("aria-level", "2");
    document.body.appendChild(element);
    const result = HeadingLevel.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "heading",
        content: "2",
        contentLabel: "Heading level",
        ruleName: "heading-level",
      },
    ]);
  });

  test("div with role=heading and invalid aria-level", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "heading");
    element.setAttribute("aria-level", "0");
    document.body.appendChild(element);
    const result = HeadingLevel.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "error",
        message: "Invalid heading level",
        ruleName: "heading-level",
      },
    ]);
  });

  test("disabled", () => {
    const element = document.createElement("h1");
    document.body.appendChild(element);
    const result = HeadingLevel.evaluate(element, { enabled: false }, {});
    expect(result).toBeUndefined();
  });
});
