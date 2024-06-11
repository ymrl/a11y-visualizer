import { describe, expect, test } from "vitest";
import { langTips } from "./langTips";

describe("langTips", () => {
  test("div", () => {
    document.createElement("div");
    expect(langTips(document.body)).toEqual([]);
  });

  test("div with lang attribute", () => {
    const div = document.createElement("div");
    div.setAttribute("lang", "en");
    expect(langTips(div)).toEqual([{ type: "lang", content: "en" }]);
  });

  test("div with xml:lang attribute", () => {
    const div = document.createElement("div");
    div.setAttribute("xml:lang", "en");
    expect(langTips(div)).toEqual([{ type: "lang", content: "en" }]);
  });

  test("div with xml:lang and lang attribute", () => {
    const div = document.createElement("div");
    div.setAttribute("xml:lang", "en");
    div.setAttribute("lang", "en");
    expect(langTips(div)).toEqual([{ type: "lang", content: "en" }]);
  });

  test("lang and xml:lang attribute are not same", () => {
    const div = document.createElement("div");
    div.setAttribute("xml:lang", "en");
    div.setAttribute("lang", "ja");
    expect(langTips(div)).toEqual([
      { type: "error", content: "messages.langAndXmlLangMustBeSame" },
    ]);
  });
});
