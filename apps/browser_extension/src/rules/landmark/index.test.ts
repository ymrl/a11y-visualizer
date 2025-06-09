import { afterEach, describe, expect, test } from "vitest";
import { Landmark } from ".";

describe("landmark", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("section without accessible name", () => {
    const element = document.createElement("section");
    document.body.appendChild(element);
    const result = Landmark.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "tagName",
        content: "section",
        ruleName: "landmark",
      },
    ]);
  });

  test("section with accessible name", () => {
    const element = document.createElement("section");
    element.setAttribute("aria-label", "section");
    document.body.appendChild(element);
    const result = Landmark.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "landmark",
        content: "region",
        ruleName: "landmark",
      },
    ]);
  });

  test("aside", () => {
    const element = document.createElement("aside");
    document.body.appendChild(element);
    const result = Landmark.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "landmark",
        content: "complementary",
        ruleName: "landmark",
      },
    ]);
  });

  test("aside in main element", () => {
    const parent = document.createElement("main");
    const element = document.createElement("aside");
    parent.appendChild(element);
    document.body.appendChild(parent);
    const result = Landmark.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "landmark",
        content: "complementary",
        ruleName: "landmark",
      },
    ]);
  });

  ["article", "aside", "nav", "section"].forEach((tagName) => {
    test(`aside in ${tagName} element`, () => {
      const parent = document.createElement(tagName);
      const element = document.createElement("aside");
      parent.appendChild(element);
      document.body.appendChild(parent);
      const result = Landmark.evaluate(element, { enabled: true }, {});
      expect(result).toEqual([
        {
          type: "tagName",
          content: "aside",
          ruleName: "landmark",
        },
      ]);
    });

    test(`aside in ${tagName} with accessible name`, () => {
      const parent = document.createElement(tagName);
      const element = document.createElement("aside");
      element.setAttribute("aria-label", "aside");
      parent.appendChild(element);
      document.body.appendChild(parent);
      const result = Landmark.evaluate(element, { enabled: true }, {});

      expect(result).toEqual([
        {
          type: "landmark",
          content: "complementary",
          ruleName: "landmark",
        },
      ]);
    });
  });

  test("header", () => {
    const element = document.createElement("header");
    document.body.appendChild(element);
    const result = Landmark.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "landmark",
        content: "banner",
        ruleName: "landmark",
      },
    ]);
  });

  test("footer", () => {
    const element = document.createElement("footer");
    document.body.appendChild(element);
    const result = Landmark.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "landmark",
        content: "contentinfo",
        ruleName: "landmark",
      },
    ]);
  });

  ["article", "aside", "nav", "section", "main"].forEach((tagName) => {
    test(`header in ${tagName} element`, () => {
      const parent = document.createElement(tagName);
      const element = document.createElement("header");
      parent.appendChild(element);
      document.body.appendChild(parent);
      const result = Landmark.evaluate(element, { enabled: true }, {});
      expect(result).toEqual([
        {
          type: "tagName",
          content: "header",
          ruleName: "landmark",
        },
      ]);
    });

    test(`header in ${tagName} with accessible name`, () => {
      const parent = document.createElement(tagName);
      const element = document.createElement("header");
      element.setAttribute("aria-label", "header");
      parent.appendChild(element);
      document.body.appendChild(parent);
      const result = Landmark.evaluate(element, { enabled: true }, {});
      expect(result).toEqual([
        {
          type: "tagName",
          content: "header",
          ruleName: "landmark",
        },
      ]);
    });

    test(`footer in ${tagName} element`, () => {
      const parent = document.createElement(tagName);
      const element = document.createElement("footer");
      parent.appendChild(element);
      document.body.appendChild(parent);
      const result = Landmark.evaluate(element, { enabled: true }, {});
      expect(result).toEqual([
        {
          type: "tagName",
          content: "footer",
          ruleName: "landmark",
        },
      ]);
    });

    test(`footer in ${tagName} with accessible name`, () => {
      const parent = document.createElement(tagName);
      const element = document.createElement("footer");
      element.setAttribute("aria-label", "footer");
      parent.appendChild(element);
      document.body.appendChild(parent);
      const result = Landmark.evaluate(element, { enabled: true }, {});
      expect(result).toEqual([
        {
          type: "tagName",
          content: "footer",
          ruleName: "landmark",
        },
      ]);
    });
  });

  test("article", () => {
    const element = document.createElement("article");
    document.body.appendChild(element);
    const result = Landmark.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "landmark",
        content: "article",
        ruleName: "landmark",
      },
    ]);
  });
  test("nav", () => {
    const element = document.createElement("nav");
    document.body.appendChild(element);
    const result = Landmark.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "landmark",
        content: "navigation",
        ruleName: "landmark",
      },
    ]);
  });
  test("main", () => {
    const element = document.createElement("main");
    document.body.appendChild(element);
    const result = Landmark.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "landmark",
        content: "main",
        ruleName: "landmark",
      },
    ]);
  });
  test("form", () => {
    const element = document.createElement("form");
    document.body.appendChild(element);
    const result = Landmark.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "landmark",
        content: "form",
        ruleName: "landmark",
      },
    ]);
  });
  test("search", () => {
    const element = document.createElement("search");
    document.body.appendChild(element);
    const result = Landmark.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "landmark",
        content: "search",
        ruleName: "landmark",
      },
    ]);
  });
});
