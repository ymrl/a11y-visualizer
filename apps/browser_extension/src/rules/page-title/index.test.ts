import { beforeEach, describe, expect, test } from "vitest";
import { PageTitle } from ".";

describe("page-title", () => {
  beforeEach(() => {
    document.title = "";
  });

  test("no title", () => {
    const result = PageTitle.evaluate(document.body, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "error",
        ruleName: "page-title",
        message: "No <title> element",
      },
    ]);
  });
  test("no title srcdoc", () => {
    const result = PageTitle.evaluate(
      document.body,
      { enabled: true },
      { srcdoc: true },
    );
    expect(result).toBeUndefined();
  });

  test("title", () => {
    document.title = "title";
    const result = PageTitle.evaluate(document.body, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "pageTitle",
        ruleName: "page-title",
        content: "title",
      },
    ]);
  });

  test("iframe: reads title from iframe document", () => {
    const iframe = document.createElement("iframe");
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentDocument;
    if (!iframeDoc) throw new Error("no contentDocument");
    iframeDoc.open();
    iframeDoc.write(
      "<!doctype html><html><head><title>Inner Title</title></head><body></body></html>",
    );
    iframeDoc.close();
    const result = PageTitle.evaluate(iframeDoc.body, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "pageTitle",
        ruleName: "page-title",
        content: "Inner Title",
      },
    ]);
  });

  test("disabled", () => {
    document.title = "title";
    const result = PageTitle.evaluate(document.body, { enabled: false }, {});
    expect(result).toBeUndefined();
  });
});
