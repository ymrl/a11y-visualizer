import { afterEach, describe, expect, test } from "vitest";
import { sectionTips, isSection } from "./sectionTips";

describe("isSection()", () => {
  test("div", () => {
    const element = document.createElement("div");
    expect(isSection(element)).toBe(false);
  });
  test("section", () => {
    const element = document.createElement("section");
    expect(isSection(element)).toBe(true);
  });
  test("role=region", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "region");
    expect(isSection(element)).toBe(true);
  });
});

describe("sectionTips()", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("div", () => {
    const element = document.createElement("div");
    expect(sectionTips(element)).toEqual([]);
  });

  test("role=region", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "region");
    document.body.appendChild(element);
    const result = sectionTips(element);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ type: "landmark", content: "region" });
  });

  test("main", () => {
    const element = document.createElement("main");
    document.body.appendChild(element);
    const result = sectionTips(element);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ type: "landmark", content: "main" });
  });

  test("section with name", () => {
    const element = document.createElement("section");
    element.setAttribute("aria-label", "Section");
    document.body.appendChild(element);
    const result = sectionTips(element);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ type: "landmark", content: "region" });
  });

  test("section without name", () => {
    const element = document.createElement("section");
    document.body.appendChild(element);
    const result = sectionTips(element);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      type: "tagName",
      content: "section",
    });
  });

  test("article", () => {
    const element = document.createElement("article");
    document.body.appendChild(element);
    const result = sectionTips(element);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ type: "landmark", content: "article" });
  });

  test("nav", () => {
    const element = document.createElement("nav");
    document.body.appendChild(element);
    const result = sectionTips(element);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ type: "landmark", content: "navigation" });
  });

  test("aside", () => {
    const element = document.createElement("aside");
    document.body.appendChild(element);
    const result = sectionTips(element);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ type: "landmark", content: "complementary" });
  });

  test("aside without name in article", () => {
    const article = document.createElement("article");
    const aside = document.createElement("aside");
    article.appendChild(aside);
    document.body.appendChild(article);
    const result = sectionTips(aside);
    expect(result).toHaveLength(0);
  });

  test("aside with name in article", () => {
    const article = document.createElement("article");
    const aside = document.createElement("aside");
    aside.setAttribute("aria-label", "Sidebar");
    article.appendChild(aside);
    document.body.appendChild(article);
    const result = sectionTips(aside);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ type: "landmark", content: "complementary" });
  });

  test("header", () => {
    const element = document.createElement("header");
    document.body.appendChild(element);
    const result = sectionTips(element);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ type: "landmark", content: "banner" });
  });

  test("header in main", () => {
    const main = document.createElement("main");
    const header = document.createElement("header");
    main.appendChild(header);
    document.body.appendChild(main);
    const result = sectionTips(header);
    expect(result).toHaveLength(0);
  });

  test("footer", () => {
    const element = document.createElement("footer");
    document.body.appendChild(element);
    const result = sectionTips(element);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ type: "landmark", content: "contentinfo" });
  });

  test("footer in main", () => {
    const element = document.createElement("footer");
    const main = document.createElement("main");
    main.appendChild(element);
    document.body.appendChild(main);
    const result = sectionTips(element);
    expect(result).toHaveLength(0);
  });
});
