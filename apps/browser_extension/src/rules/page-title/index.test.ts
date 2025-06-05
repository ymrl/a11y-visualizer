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

  test("disabled", () => {
    document.title = "title";
    const result = PageTitle.evaluate(document.body, { enabled: false }, {});
    expect(result).toBeUndefined();
  });
});
