import { afterEach, describe, expect, test } from "vitest";
import { collectShadowRoots } from "./collectShadowRoots";

describe("collectShadowRoots", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("shadowRootがない場合は空配列を返す", () => {
    document.body.innerHTML = `
      <div>
        <p>テキスト</p>
        <span>スパン</span>
      </div>
    `;
    const shadowRoots = collectShadowRoots(document.body);
    expect(shadowRoots).toEqual([]);
  });

  test("1つのshadowRootがある場合は1つの要素を返す", () => {
    const div = document.createElement("div");
    const shadow = div.attachShadow({ mode: "open" });
    shadow.innerHTML = "<p>Shadow content</p>";
    document.body.appendChild(div);

    const shadowRoots = collectShadowRoots(document.body);
    expect(shadowRoots).toHaveLength(1);
    expect(shadowRoots[0]).toBe(shadow);
  });

  test("複数のshadowRootがある場合は全て返す", () => {
    const div1 = document.createElement("div");
    const shadow1 = div1.attachShadow({ mode: "open" });
    shadow1.innerHTML = "<p>Shadow 1</p>";
    document.body.appendChild(div1);

    const div2 = document.createElement("div");
    const shadow2 = div2.attachShadow({ mode: "open" });
    shadow2.innerHTML = "<p>Shadow 2</p>";
    document.body.appendChild(div2);

    const shadowRoots = collectShadowRoots(document.body);
    expect(shadowRoots).toHaveLength(2);
    expect(shadowRoots).toContain(shadow1);
    expect(shadowRoots).toContain(shadow2);
  });

  test("ネストしたshadowRoot（shadow DOM内のshadow DOM）も収集できる", () => {
    const outerDiv = document.createElement("div");
    const outerShadow = outerDiv.attachShadow({ mode: "open" });
    document.body.appendChild(outerDiv);

    const innerDiv = document.createElement("div");
    const innerShadow = innerDiv.attachShadow({ mode: "open" });
    innerShadow.innerHTML = "<p>Inner shadow</p>";
    outerShadow.appendChild(innerDiv);

    const shadowRoots = collectShadowRoots(document.body);
    expect(shadowRoots).toHaveLength(2);
    expect(shadowRoots).toContain(outerShadow);
    expect(shadowRoots).toContain(innerShadow);
  });

  test("rootノードを指定した場合、そのノード以下のshadowRootのみを収集", () => {
    const container1 = document.createElement("div");
    container1.id = "container1";
    const shadow1 = container1.attachShadow({ mode: "open" });
    shadow1.innerHTML = "<p>Shadow 1</p>";
    document.body.appendChild(container1);

    const container2 = document.createElement("div");
    container2.id = "container2";
    const shadow2 = container2.attachShadow({ mode: "open" });
    shadow2.innerHTML = "<p>Shadow 2</p>";
    document.body.appendChild(container2);

    const shadowRoots = collectShadowRoots(container1);
    expect(shadowRoots).toHaveLength(1);
    expect(shadowRoots[0]).toBe(shadow1);
  });

  test("ルートノード自体がshadowRootを持つ場合も含める", () => {
    const div = document.createElement("div");
    const shadow = div.attachShadow({ mode: "open" });
    shadow.innerHTML = "<p>Shadow content</p>";
    document.body.appendChild(div);

    const shadowRoots = collectShadowRoots(div);
    expect(shadowRoots).toHaveLength(1);
    expect(shadowRoots[0]).toBe(shadow);
  });

  test("深くネストしたshadowRootも全て収集できる", () => {
    const level1 = document.createElement("div");
    const shadow1 = level1.attachShadow({ mode: "open" });
    document.body.appendChild(level1);

    const level2 = document.createElement("div");
    const shadow2 = level2.attachShadow({ mode: "open" });
    shadow1.appendChild(level2);

    const level3 = document.createElement("div");
    const shadow3 = level3.attachShadow({ mode: "open" });
    shadow2.appendChild(level3);

    const shadowRoots = collectShadowRoots(document.body);
    expect(shadowRoots).toHaveLength(3);
    expect(shadowRoots).toContain(shadow1);
    expect(shadowRoots).toContain(shadow2);
    expect(shadowRoots).toContain(shadow3);
  });
});
