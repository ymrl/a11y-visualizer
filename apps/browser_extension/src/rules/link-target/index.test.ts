import { afterEach, describe, expect, test } from "vitest";
import { LinkTarget } from ".";

describe("link-target", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("link with target", () => {
    const element = document.createElement("a");
    element.setAttribute("target", "_blank");
    document.body.appendChild(element);
    const result = LinkTarget.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "linkTarget",
        ruleName: "link-target",
        content: "_blank",
      },
    ]);
  });

  test("disabled", () => {
    const element = document.createElement("a");
    element.setAttribute("target", "_blank");
    document.body.appendChild(element);
    const result = LinkTarget.evaluate(element, { enabled: false }, {});
    expect(result).toBeUndefined();
  });
});
