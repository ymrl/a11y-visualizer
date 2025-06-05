import { afterEach, describe, expect, test } from "vitest";
import { HeadingName } from ".";

describe("heading-name", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("h1", () => {
    const element = document.createElement("h1");
    element.textContent = "heading";
    document.body.appendChild(element);
    const result = HeadingName.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
  });

  test("empty h1", () => {
    const element = document.createElement("h1");
    document.body.appendChild(element);
    const result = HeadingName.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "error",
        ruleName: "heading-name",
        message: "Empty heading",
      },
    ]);
  });

  test("h1 with aria-label", () => {
    const element = document.createElement("h1");
    element.setAttribute("aria-label", "heading");
    document.body.appendChild(element);
    const result = HeadingName.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
  });

  test("h1 with image", () => {
    const element = document.createElement("h1");
    const img = document.createElement("img");
    img.setAttribute("src", "image.png");
    img.setAttribute("alt", "heading");
    element.appendChild(img);
    document.body.appendChild(element);
    const result = HeadingName.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
  });

  test("h1 with image without alt", () => {
    const element = document.createElement("h1");
    const img = document.createElement("img");
    img.setAttribute("src", "image.png");
    element.appendChild(img);
    document.body.appendChild(element);
    const result = HeadingName.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "error",
        ruleName: "heading-name",
        message: "Empty heading",
      },
    ]);
  });
});
