import { afterEach, describe, expect, test } from "vitest";
import { getElementByIdFromRoots } from "./getElementByIdFromRoots";

describe("getElementByIdFromRoots", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("documentから要素を取得できる", () => {
    const div = document.createElement("div");
    div.id = "test-element";
    document.body.appendChild(div);

    const result = getElementByIdFromRoots("test-element", document);
    expect(result).toBe(div);
  });

  test("documentに存在しない場合はnullを返す", () => {
    const result = getElementByIdFromRoots("non-existent", document);
    expect(result).toBeNull();
  });

  test("Shadow DOM内の要素を取得できる", () => {
    const host = document.createElement("div");
    const shadowRoot = host.attachShadow({ mode: "open" });
    const shadowElement = document.createElement("div");
    shadowElement.id = "shadow-element";
    shadowRoot.appendChild(shadowElement);
    document.body.appendChild(host);

    const result = getElementByIdFromRoots("shadow-element", document, [
      shadowRoot,
    ]);
    expect(result).toBe(shadowElement);
  });

  test("documentにもShadow DOMにもない場合はnullを返す", () => {
    const host = document.createElement("div");
    const shadowRoot = host.attachShadow({ mode: "open" });
    document.body.appendChild(host);

    const result = getElementByIdFromRoots("non-existent", document, [
      shadowRoot,
    ]);
    expect(result).toBeNull();
  });

  test("複数のShadow DOMから要素を検索できる", () => {
    const host1 = document.createElement("div");
    const shadowRoot1 = host1.attachShadow({ mode: "open" });
    const element1 = document.createElement("div");
    element1.id = "element1";
    shadowRoot1.appendChild(element1);
    document.body.appendChild(host1);

    const host2 = document.createElement("div");
    const shadowRoot2 = host2.attachShadow({ mode: "open" });
    const element2 = document.createElement("div");
    element2.id = "element2";
    shadowRoot2.appendChild(element2);
    document.body.appendChild(host2);

    const result1 = getElementByIdFromRoots("element1", document, [
      shadowRoot1,
      shadowRoot2,
    ]);
    expect(result1).toBe(element1);

    const result2 = getElementByIdFromRoots("element2", document, [
      shadowRoot1,
      shadowRoot2,
    ]);
    expect(result2).toBe(element2);
  });

  test("documentで見つかればShadow DOMは探索しない", () => {
    const docElement = document.createElement("div");
    docElement.id = "duplicate-id";
    document.body.appendChild(docElement);

    const host = document.createElement("div");
    const shadowRoot = host.attachShadow({ mode: "open" });
    const shadowElement = document.createElement("div");
    shadowElement.id = "duplicate-id";
    shadowRoot.appendChild(shadowElement);
    document.body.appendChild(host);

    const result = getElementByIdFromRoots("duplicate-id", document, [
      shadowRoot,
    ]);
    expect(result).toBe(docElement);
  });

  test("shadowRootsがundefinedの場合でも動作する", () => {
    const div = document.createElement("div");
    div.id = "test-element";
    document.body.appendChild(div);

    const result = getElementByIdFromRoots("test-element", document, undefined);
    expect(result).toBe(div);
  });

  test("shadowRootsが空配列の場合でも動作する", () => {
    const div = document.createElement("div");
    div.id = "test-element";
    document.body.appendChild(div);

    const result = getElementByIdFromRoots("test-element", document, []);
    expect(result).toBe(div);
  });
});
