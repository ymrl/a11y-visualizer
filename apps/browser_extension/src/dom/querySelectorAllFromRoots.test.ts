import { afterEach, describe, expect, test } from "vitest";
import { querySelectorAllFromRoots } from "./querySelectorAllFromRoots";

describe("querySelectorAllFromRoots", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("documentから要素を取得できる", () => {
    const div1 = document.createElement("div");
    div1.className = "test-class";
    const div2 = document.createElement("div");
    div2.className = "test-class";
    document.body.appendChild(div1);
    document.body.appendChild(div2);

    const result = querySelectorAllFromRoots(".test-class", document);
    expect(result).toHaveLength(2);
    expect(result).toContain(div1);
    expect(result).toContain(div2);
  });

  test("documentに存在しない場合は空配列を返す", () => {
    const result = querySelectorAllFromRoots(".non-existent", document);
    expect(result).toHaveLength(0);
  });

  test("Shadow DOM内の要素を取得できる", () => {
    const host = document.createElement("div");
    const shadowRoot = host.attachShadow({ mode: "open" });
    const shadowElement1 = document.createElement("div");
    shadowElement1.className = "shadow-class";
    const shadowElement2 = document.createElement("div");
    shadowElement2.className = "shadow-class";
    shadowRoot.appendChild(shadowElement1);
    shadowRoot.appendChild(shadowElement2);
    document.body.appendChild(host);

    const result = querySelectorAllFromRoots(".shadow-class", document, [
      shadowRoot,
    ]);
    expect(result).toHaveLength(2);
    expect(result).toContain(shadowElement1);
    expect(result).toContain(shadowElement2);
  });

  test("documentとShadow DOM両方から要素を取得できる", () => {
    const docElement = document.createElement("div");
    docElement.className = "common-class";
    document.body.appendChild(docElement);

    const host = document.createElement("div");
    const shadowRoot = host.attachShadow({ mode: "open" });
    const shadowElement = document.createElement("div");
    shadowElement.className = "common-class";
    shadowRoot.appendChild(shadowElement);
    document.body.appendChild(host);

    const result = querySelectorAllFromRoots(".common-class", document, [
      shadowRoot,
    ]);
    expect(result).toHaveLength(2);
    expect(result).toContain(docElement);
    expect(result).toContain(shadowElement);
  });

  test("複数のShadow DOMから要素を検索できる", () => {
    const host1 = document.createElement("div");
    const shadowRoot1 = host1.attachShadow({ mode: "open" });
    const element1 = document.createElement("input");
    element1.type = "radio";
    element1.name = "test";
    shadowRoot1.appendChild(element1);
    document.body.appendChild(host1);

    const host2 = document.createElement("div");
    const shadowRoot2 = host2.attachShadow({ mode: "open" });
    const element2 = document.createElement("input");
    element2.type = "radio";
    element2.name = "test";
    shadowRoot2.appendChild(element2);
    document.body.appendChild(host2);

    const result = querySelectorAllFromRoots(
      'input[type="radio"][name="test"]',
      document,
      [shadowRoot1, shadowRoot2],
    );
    expect(result).toHaveLength(2);
    expect(result).toContain(element1);
    expect(result).toContain(element2);
  });

  test("shadowRootsがundefinedの場合でも動作する", () => {
    const div = document.createElement("div");
    div.className = "test-class";
    document.body.appendChild(div);

    const result = querySelectorAllFromRoots(
      ".test-class",
      document,
      undefined,
    );
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(div);
  });

  test("shadowRootsが空配列の場合でも動作する", () => {
    const div = document.createElement("div");
    div.className = "test-class";
    document.body.appendChild(div);

    const result = querySelectorAllFromRoots(".test-class", document, []);
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(div);
  });

  test("特定のroot要素配下から検索できる", () => {
    const container1 = document.createElement("div");
    container1.id = "container1";
    const div1 = document.createElement("div");
    div1.className = "test-class";
    container1.appendChild(div1);
    document.body.appendChild(container1);

    const container2 = document.createElement("div");
    container2.id = "container2";
    const div2 = document.createElement("div");
    div2.className = "test-class";
    container2.appendChild(div2);
    document.body.appendChild(container2);

    const result = querySelectorAllFromRoots(".test-class", container1);
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(div1);
  });
});
