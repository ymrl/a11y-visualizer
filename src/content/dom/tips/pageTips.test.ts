import { afterEach, describe, expect, test } from "vitest";
import { isPage, pageTips } from "./pageTips";

describe("isPage", () => {
  test("div", () => {
    const div = document.createElement("div");
    expect(isPage(div)).toBe(false);
  });

  test("body", () => {
    expect(isPage(document.body)).toBe(true);
  });
});

describe("pageTips", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    document.head.innerHTML = "";
    document.documentElement.removeAttribute("lang");
    document.documentElement.removeAttribute("xml:lang");
  });

  test("div", () => {
    const div = document.createElement("div");
    expect(pageTips(div, false)).toEqual([]);
  });

  test("body", () => {
    const result = pageTips(document.body, false);
    expect(result).toHaveLength(2);
    expect(
      result.find(
        (tip) => tip.type === "error" && tip.content === "messages.noTitlePage",
      ),
    ).toBeDefined;
    expect(
      result.find(
        (tip) => tip.type === "error" && tip.content === "messages.noLangPage",
      ),
    ).toBeDefined;
  });

  test("body with lang", () => {
    document.documentElement.setAttribute("lang", "en");
    const result = pageTips(document.body, false);
    expect(result).toHaveLength(2);
    expect(
      result.find(
        (tip) => tip.type === "error" && tip.content === "messages.noTitlePage",
      ),
    ).toBeDefined;
    expect(result.find((tip) => tip.type === "lang" && tip.content === "en"))
      .toBeDefined;
  });

  test("body with title", () => {
    document.title = "title";
    const result = pageTips(document.body, false);
    expect(result).toHaveLength(2);
    expect(
      result.find(
        (tip) => tip.type === "lang" && tip.content === "messages.noLangPage",
      ),
    ).toBeDefined;
    expect(
      result.find((tip) => tip.type === "pageTitle" && tip.content === "title"),
    ).toBeDefined;
  });

  test("body with srcdoc", () => {
    const result = pageTips(document.body, true);
    expect(result).toHaveLength(1);
    expect(
      result.find(
        (tip) => tip.type === "error" && tip.content === "messages.noLangPage",
      ),
    ).toBeDefined;
  });

  test("body with lang and title", () => {
    document.title = "title";
    document.documentElement.setAttribute("lang", "en");
    const result = pageTips(document.body, false);
    expect(result).toHaveLength(2);
    expect(result.find((tip) => tip.type === "lang" && tip.content === "en"))
      .toBeDefined;
    expect(
      result.find((tip) => tip.type === "pageTitle" && tip.content === "title"),
    );
  });

  test("document has xml:lang", () => {
    document.title = "title";
    document.documentElement.setAttribute("xml:lang", "en");
    const result = pageTips(document.body, false);
    expect(result).toHaveLength(2);
    expect(result.find((tip) => tip.type === "lang" && tip.content === "en"))
      .toBeDefined;
    expect(
      result.find((tip) => tip.type === "pageTitle" && tip.content === "title"),
    );
  });
});
