import { afterEach, describe, expect, test } from "vitest";
import { PageLang } from ".";

describe("page-lang", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    document.documentElement.removeAttribute("lang");
    document.documentElement.removeAttribute("xml:lang");
  });

  test("html with lang", () => {
    document.documentElement.setAttribute("lang", "en");
    const result = PageLang.evaluate(document.body, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "lang",
        ruleName: "page-lang",
        content: "en",
        contentLabel: "Page language",
      },
    ]);
  });

  test("html with xml:lang", () => {
    document.documentElement.setAttribute("xml:lang", "en");
    const result = PageLang.evaluate(document.body, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "lang",
        ruleName: "page-lang",
        content: "en",
        contentLabel: "Page language",
      },
    ]);
  });

  test("html with lang and xml:lang", () => {
    document.documentElement.setAttribute("lang", "en");
    document.documentElement.setAttribute("xml:lang", "en");
    const result = PageLang.evaluate(document.body, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "lang",
        ruleName: "page-lang",
        content: "en",
        contentLabel: "Page language",
      },
    ]);
  });

  test("html with lang and xml:lang that don't match", () => {
    document.documentElement.setAttribute("lang", "en");
    document.documentElement.setAttribute("xml:lang", "es");
    const result = PageLang.evaluate(document.body, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "error",
        ruleName: "page-lang",
        message: "lang and xml:lang attributes must have the same value",
      },
    ]);
  });

  test("html without lang", () => {
    const result = PageLang.evaluate(document.body, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "error",
        ruleName: "page-lang",
        message: "No lang attribute on <html>",
      },
    ]);
  });

  test("disabled", () => {
    document.documentElement.setAttribute("lang", "en");
    const result = PageLang.evaluate(document.body, { enabled: false }, {});
    expect(result).toBeUndefined();
  });

  test("iframe: reads lang from iframe documentElement", () => {
    const iframe = document.createElement("iframe");
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentDocument;
    if (!iframeDoc) throw new Error("no contentDocument");
    iframeDoc.open();
    iframeDoc.write(
      '<!doctype html><html lang="fr"><body><p>Hi</p></body></html>',
    );
    iframeDoc.close();
    const result = PageLang.evaluate(iframeDoc.body, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "lang",
        ruleName: "page-lang",
        content: "fr",
        contentLabel: "Page language",
      },
    ]);
  });
});
