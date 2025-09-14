import { afterEach, describe, expect, test } from "vitest";
import { ImageName } from ".";

describe("image-name", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("div", () => {
    const element = document.createElement("div");
    document.body.appendChild(element);
    const result = ImageName.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
  });

  test("image with alt attribute", () => {
    const element = document.createElement("img");
    element.setAttribute("alt", "image");
    document.body.appendChild(element);
    const result = ImageName.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
  });

  test("image without alt attribute", () => {
    const element = document.createElement("img");
    document.body.appendChild(element);
    const result = ImageName.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "error",
        ruleName: "image-name",
        message: "No alt attribute",
      },
    ]);
  });

  test("image with empty alt", () => {
    const element = document.createElement("img");
    element.setAttribute("alt", "");
    document.body.appendChild(element);
    const result = ImageName.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "warning",
        ruleName: "image-name",
        message: "Empty alt attribute",
      },
    ]);
  });

  test("image with title but no alt attribute", () => {
    const element = document.createElement("img");
    element.setAttribute("title", "image title");
    document.body.appendChild(element);
    const result = ImageName.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "error",
        ruleName: "image-name",
        message: "No alt attribute",
      },
    ]);
  });

  test("image with aria-label but no alt attribute", () => {
    const element = document.createElement("img");
    element.setAttribute("aria-label", "image label");
    document.body.appendChild(element);
    const result = ImageName.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "error",
        ruleName: "image-name",
        message: "No alt attribute",
      },
    ]);
  });

  test("image with alt and aria-hidden", () => {
    const element = document.createElement("img");
    element.setAttribute("alt", "image");
    element.setAttribute("aria-hidden", "true");
    document.body.appendChild(element);
    const result = ImageName.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
  });

  test("image with presentation role", () => {
    const element = document.createElement("img");
    element.setAttribute("alt", "image");
    element.setAttribute("role", "presentation");
    document.body.appendChild(element);
    const result = ImageName.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
  });

  test("role img without name", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "img");
    document.body.appendChild(element);
    const result = ImageName.evaluate(element, { enabled: true }, {});
    expect(result).toEqual([
      {
        type: "error",
        ruleName: "image-name",
        message: "No accessible name",
      },
    ]);
  });

  test("role img with name", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "img");
    element.setAttribute("aria-label", "image");
    document.body.appendChild(element);
    const result = ImageName.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
  });

  test("svg with title", () => {
    const element = document.createElement("svg");
    const title = document.createElement("title");
    title.textContent = "Chart showing sales data";
    element.appendChild(title);
    document.body.appendChild(element);
    const result = ImageName.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
  });

  test("svg without title", () => {
    const element = document.createElement("svg");
    document.body.appendChild(element);
    const result = ImageName.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
  });

  test("svg with empty title", () => {
    const element = document.createElement("svg");
    const title = document.createElement("title");
    title.textContent = "";
    element.appendChild(title);
    document.body.appendChild(element);
    const result = ImageName.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
  });

  test("svg with aria-hidden", () => {
    const element = document.createElement("svg");
    element.setAttribute("aria-hidden", "true");
    const title = document.createElement("title");
    title.textContent = "Chart showing sales data";
    element.appendChild(title);
    document.body.appendChild(element);
    const result = ImageName.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
  });

  test("svg with role img and title", () => {
    const element = document.createElement("svg");
    element.setAttribute("role", "img");
    const title = document.createElement("title");
    title.textContent = "Chart showing sales data";
    element.appendChild(title);
    document.body.appendChild(element);
    const result = ImageName.evaluate(element, { enabled: true }, {});
    expect(result).toBeUndefined();
  });

  test("disabled", () => {
    const element = document.createElement("img");
    element.setAttribute("alt", "image");
    document.body.appendChild(element);
    const result = ImageName.evaluate(element, { enabled: false }, {});
    expect(result).toBeUndefined();
  });
});
