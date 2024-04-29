import { describe, expect, test } from "vitest";
import { elementNickName } from "./elementNickName";

describe("elementNickName()", () => {
  test("document.body", () => {
    const element = document.body;
    document.body.textContent = "text";
    expect(elementNickName(element)).toBe("body");
  });

  test("img", () => {
    const element = document.createElement("img");
    element.src = "src";
    element.alt = "alt";
    element.id = "id";
    expect(elementNickName(element)).toBe("img alt");
  });

  test("img empty alt", () => {
    const element = document.createElement("img");
    element.src = "src";
    element.alt = "";
    expect(elementNickName(element)).toBe("img");
  });

  test("img empty alt and id", () => {
    const element = document.createElement("img");
    element.src = "src";
    element.alt = "";
    element.id = "id";
    expect(elementNickName(element)).toBe("img#id");
  });

  test("element has id and long textContent", () => {
    const element = document.createElement("div");
    element.id = "id";
    element.textContent = "a".repeat(40);
    expect(elementNickName(element)).toBe(`div ${"a".repeat(30)}...`);
  });

  test("element has id and textContent", () => {
    const element = document.createElement("div");
    element.id = "id";
    element.textContent = "text";
    expect(elementNickName(element)).toBe("div text");
  });

  test("element has id and empty", () => {
    const element = document.createElement("div");
    element.id = "id";
    expect(elementNickName(element)).toBe("div#id");
  });

  test("element has textContent", () => {
    const element = document.createElement("div");
    element.textContent = "text";
    expect(elementNickName(element)).toBe("div text");
  });

  test("element has long textContent", () => {
    const element = document.createElement("div");
    element.textContent = "a".repeat(40);
    expect(elementNickName(element)).toBe(`div ${"a".repeat(30)}...`);
  });

  test("element has no id and empty", () => {
    const element = document.createElement("div");
    expect(elementNickName(element)).toBe("div");
  });
});
