import { JSDOM } from "jsdom";
import { expect, test } from "vitest";
import { collectElements } from "./collectElements";

test("image", () => {
  const dom = new JSDOM(`<!DOCTYPE html>
    <html>
      <body>
        <img id="noAlt" src="https://example.com/image.jpg">
        <img id="emptyAlt" src="https://example.com/image.jpg" alt="">
        <img id="alt" src="https://example.com/image.jpg" alt="image">
        <span id="role-img" role="img" aria-label="image"></span>
        <span id="role-img-empty" role="img"></span>
      </body>
    </html>
  `);

  const result = collectElements(dom.window.document.body, []);
  expect(result.elements).toHaveLength(5);

  const noAlt = dom.window.document.getElementById("noAlt");
  expect(noAlt).not.toBeNull();
  if (noAlt) {
    expect(result.elements[0].categories).toContain("image");
    expect(result.elements[0].tips).toHaveLength(1);
    expect(result.elements[0].tips[0].type).toBe("error");
    expect(result.elements[0].tips[0].content).toBe("messages.noAltImage");
  }

  const emptyAlt = dom.window.document.getElementById("emptyAlt");
  expect(emptyAlt).not.toBeNull();
  if (emptyAlt) {
    expect(result.elements[1].categories).toContain("image");
    expect(result.elements[1].tips).toHaveLength(1);
    expect(result.elements[1].tips[0].type).toBe("warning");
    expect(result.elements[1].tips[0].content).toBe("messages.emptyAltImage");
  }

  const alt = dom.window.document.getElementById("alt");
  expect(alt).not.toBeNull();
  if (alt) {
    expect(result.elements[2].categories).toContain("image");
    expect(result.elements[2].tips).toHaveLength(1);
    expect(result.elements[2].tips[0].type).toBe("name");
    expect(result.elements[2].tips[0].content).toBe("image");
  }

  const roleImg = dom.window.document.getElementById("role-img");
  expect(roleImg).not.toBeNull();
  if (roleImg) {
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
  }

  const roleImgEmpty = dom.window.document.getElementById("role-img-empty");
  expect(roleImgEmpty).not.toBeNull();
  if (roleImgEmpty) {
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
  }
});
