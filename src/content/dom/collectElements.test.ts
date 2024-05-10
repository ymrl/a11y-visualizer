import { afterEach, describe, expect, test } from "vitest";
import { collectElements } from "./collectElements";

const setAttributes = (
  element: Element,
  attributes: Record<string, string>,
) => {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
};
const appendChildren = (element: Element, children: Element[]) => {
  children.forEach((child) => {
    element.appendChild(child);
  });
};

describe("collectElements()", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("image", () => {
    const noAlt = document.createElement("img");
    noAlt.src = "https://example.com/image.jpg";
    const emptyAlt = document.createElement("img");
    setAttributes(emptyAlt, {
      src: "https://example.com/image.jpg",
      alt: "",
    });
    const alt = document.createElement("img");
    setAttributes(alt, {
      src: "https://example.com/image.jpg",
      alt: "image",
    });
    const roleImg = document.createElement("span");
    setAttributes(roleImg, {
      role: "img",
      "aria-label": "image",
    });
    const roleImgEmpty = document.createElement("span");
    roleImgEmpty.setAttribute("role", "img");
    const notImage = document.createElement("span");
    const exclude = document.createElement("div");
    exclude.appendChild(document.createElement("img"));
    appendChildren(document.body, [
      noAlt,
      emptyAlt,
      alt,
      roleImg,
      roleImgEmpty,
      notImage,
      exclude,
    ]);
    const result = collectElements(document.body, [exclude]);
    expect(result.elements).toHaveLength(5);

    //noAlt
    expect(result.elements[0].categories).toContain("image");
    expect(result.elements[0].tips).toHaveLength(1);
    expect(result.elements[0].tips[0].type).toBe("error");
    expect(result.elements[0].tips[0].content).toBe("messages.noAltImage");

    // emptyAlt
    expect(result.elements[1].categories).toContain("image");
    expect(result.elements[1].tips).toHaveLength(1);
    expect(result.elements[1].tips[0].type).toBe("warning");
    expect(result.elements[1].tips[0].content).toBe("messages.emptyAltImage");

    // alt
    expect(result.elements[2].categories).toContain("image");
    expect(result.elements[2].tips).toHaveLength(1);
    expect(result.elements[2].tips[0].type).toBe("name");
    expect(result.elements[2].tips[0].content).toBe("image");

    // roleImg
    expect(result.elements[3].categories).toContain("image");
    expect(
      result.elements[3].tips.find((tip) => tip.type === "name"),
    ).not.toBeUndefined();
    expect(
      result.elements[3].tips.find((tip) => tip.type === "name")?.content,
    ).toBe("image");
    expect(
      result.elements[3].tips.find((tip) => tip.type === "tagName"),
    ).not.toBeUndefined();
    expect(
      result.elements[3].tips.find((tip) => tip.type === "tagName")?.content,
    ).toBe("span");
    expect(
      result.elements[3].tips.find((tip) => tip.type === "role"),
    ).not.toBeUndefined();
    expect(
      result.elements[3].tips.find((tip) => tip.type === "role")?.content,
    ).toBe("img");

    // roleImgEmpty
    expect(result.elements[4].categories).toContain("image");
    expect(
      result.elements[4].tips.find((tip) => tip.type === "name"),
    ).toBeUndefined();
    expect(
      result.elements[4].tips.find((tip) => tip.type === "error"),
    ).not.toBeUndefined();
    expect(
      result.elements[4].tips.find((tip) => tip.type === "error")?.content,
    ).toBe("messages.noName");
    expect(
      result.elements[4].tips.find((tip) => tip.type === "tagName"),
    ).not.toBeUndefined();
    expect(
      result.elements[4].tips.find((tip) => tip.type === "tagName")?.content,
    ).toBe("span");
    expect(
      result.elements[4].tips.find((tip) => tip.type === "role"),
    ).not.toBeUndefined();
    expect(
      result.elements[4].tips.find((tip) => tip.type === "role")?.content,
    ).toBe("img");
  });

  test("formControl", () => {
    const noLabel = document.createElement("input");
    const emptyLabel = document.createElement("input");
    emptyLabel.setAttribute("aria-label", "");
    const labeled = document.createElement("input");
    labeled.id = "labeled";
    const label = document.createElement("label");
    label.htmlFor = "labeled";
    label.innerHTML = "labeled";
    const noFor = document.createElement("label");
    const notFormControl = document.createElement("span");
    appendChildren(document.body, [
      noLabel,
      emptyLabel,
      labeled,
      label,
      noFor,
      notFormControl,
    ]);
    const result = collectElements(document.body, []);
    expect(result.elements).toHaveLength(5);
    // noLabel
    expect(result.elements[0].categories).toContain("formControl");
    expect(result.elements[0].tips).toHaveLength(1);
    expect(result.elements[0].tips[0].type).toBe("error");
    expect(result.elements[0].tips[0].content).toBe("messages.noName");

    // emptyLabel
    expect(result.elements[1].categories).toContain("formControl");
    expect(result.elements[1].tips).toHaveLength(1);
    expect(result.elements[1].tips[0].type).toBe("error");
    expect(result.elements[1].tips[0].content).toBe("messages.noName");

    // labeled
    expect(result.elements[2].categories).toContain("formControl");
    expect(result.elements[2].tips).toHaveLength(1);
    expect(result.elements[2].tips[0].type).toBe("name");
    expect(result.elements[2].tips[0].content).toBe("labeled");

    //label
    expect(result.elements[3].categories).toContain("formControl");
    expect(result.elements[3].tips).toHaveLength(0);

    // noFor
    expect(result.elements[4].categories).toContain("formControl");
    expect(result.elements[4].tips).toHaveLength(1);
    expect(result.elements[4].tips[0].type).toBe("warning");
    expect(result.elements[4].tips[0].content).toBe(
      "messages.noControlForLabel",
    );
  });

  test("link", () => {
    const noHref = document.createElement("a");
    noHref.textContent = "link";
    const href = document.createElement("a");
    href.href = "https://example.com";
    href.textContent = "link";
    const roleLink = document.createElement("span");
    setAttributes(roleLink, {
      role: "link",
      "aria-label": "link",
    });
    const roleLinkEmpty = document.createElement("span");
    roleLinkEmpty.setAttribute("role", "link");
    const notLink = document.createElement("span");
    appendChildren(document.body, [
      noHref,
      href,
      roleLink,
      roleLinkEmpty,
      notLink,
    ]);
    const result = collectElements(document.body, []);
    expect(result.elements).toHaveLength(4);
  });

  test("button", () => {
    const button = document.createElement("button");
    button.textContent = "button";
    const notButton = document.createElement("div");
    notButton.textContent = "not button";
    const roleButton = document.createElement("span");
    roleButton.setAttribute("role", "button");
    roleButton.textContent = "role button";
    const inputButton = document.createElement("input");
    setAttributes(inputButton, {
      type: "button",
      value: "input button",
    });
    const inputSubmit = document.createElement("input");
    setAttributes(inputSubmit, {
      type: "submit",
      value: "input submit",
    });
    const inputReset = document.createElement("input");
    setAttributes(inputReset, {
      type: "reset",
      value: "input reset",
    });
    const inputImage = document.createElement("input");
    setAttributes(inputImage, {
      type: "image",
      alt: "input image",
    });
    appendChildren(document.body, [
      button,
      notButton,
      roleButton,
      inputButton,
      inputSubmit,
      inputReset,
      inputImage,
    ]);
    const result = collectElements(document.body, []);
    expect(result.elements).toHaveLength(6);
  });

  test("heading", () => {
    const h1 = document.createElement("h1");
    h1.textContent = "h1";
    const roleHeading = document.createElement("span");
    setAttributes(roleHeading, {
      role: "heading",
      "aria-level": "1",
    });
    const notHeading = document.createElement("div");
    notHeading.textContent = "not heading";
    appendChildren(document.body, [h1, roleHeading, notHeading]);
    const result = collectElements(document.body, []);
    expect(result.elements).toHaveLength(2);
  });

  test("ariaHidden", () => {
    const ariaHidden = document.createElement("div");
    ariaHidden.setAttribute("aria-hidden", "true");
    const notAriaHidden = document.createElement("div");
    notAriaHidden.textContent = "not aria-hidden";
    appendChildren(document.body, [ariaHidden, notAriaHidden]);
    const result = collectElements(document.body, []);
    expect(result.elements).toHaveLength(1);
  });
});
