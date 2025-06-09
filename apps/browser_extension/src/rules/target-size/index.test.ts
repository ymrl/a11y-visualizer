import { describe, test, expect, afterEach } from "vitest";
import { TargetSize } from ".";

describe(TargetSize.ruleName, () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("default button", () => {
    const el = document.createElement("button");
    el.textContent = "button";
    document.body.appendChild(el);
    expect(TargetSize.evaluate(el, { enabled: true }, {})).toBeUndefined();
  });

  test("small button", () => {
    const el = document.createElement("button");
    el.textContent = "button";
    el.style.width = "10px";
    el.style.height = "10px";
    document.body.appendChild(el);
    expect(TargetSize.evaluate(el, { enabled: true }, {})).toEqual([
      {
        type: "warning",
        message: "Small target",
        ruleName: "target-size",
      },
    ]);
  });

  test("inline link", () => {
    const el = document.createElement("a");
    el.textContent = "link";
    el.setAttribute("href", "#");
    document.body.appendChild(el);
    expect(TargetSize.evaluate(el, { enabled: true }, {})).toBeUndefined();
  });

  test("default checkbox", () => {
    const el = document.createElement("input");
    el.setAttribute("type", "checkbox");
    document.body.appendChild(el);
    expect(TargetSize.evaluate(el, { enabled: true }, {})).toBeUndefined();
  });

  test("small checkbox", () => {
    const el = document.createElement("input");
    el.setAttribute("type", "checkbox");
    el.style.width = "10px";
    el.style.height = "10px";
    document.body.appendChild(el);
    expect(TargetSize.evaluate(el, { enabled: true }, {})).toEqual([
      {
        type: "warning",
        message: "Small target",
        ruleName: "target-size",
      },
    ]);
  });
  test("small checkbox in big label", () => {
    const label = document.createElement("label");
    const el = document.createElement("input");
    el.setAttribute("type", "checkbox");
    label.appendChild(el);
    label.appendChild(document.createTextNode("label"));
    label.style.display = "inline-block";
    label.style.width = "24px";
    label.style.height = "24px";
    document.body.appendChild(label);
    expect(TargetSize.evaluate(el, { enabled: true }, {})).toBeUndefined();
  });

  test("small rect in image map", () => {
    const map = document.createElement("map");
    map.setAttribute("name", "map");
    const img = document.createElement("img");
    img.setAttribute("usemap", "#map");
    img.style.width = "100px";
    img.style.height = "100px";
    document.body.appendChild(map);
    document.body.appendChild(img);
    const el = document.createElement("area");
    el.setAttribute("shape", "rect");
    el.setAttribute("coords", "10,10,33,33");
    map.appendChild(el);
    expect(TargetSize.evaluate(el, { enabled: true }, {})).toEqual([
      {
        type: "warning",
        message: "Small target",
        ruleName: "target-size",
      },
    ]);
  });

  test("big rect in image map", () => {
    const map = document.createElement("map");
    map.setAttribute("name", "map");
    const img = document.createElement("img");
    img.setAttribute("usemap", "#map");
    img.style.width = "100px";
    img.style.height = "100px";
    document.body.appendChild(map);
    document.body.appendChild(img);
    const el = document.createElement("area");
    el.setAttribute("shape", "rect");
    el.setAttribute("coords", "10,10,34,34");
    map.appendChild(el);
    expect(TargetSize.evaluate(el, { enabled: true }, {})).toBeUndefined();
  });

  test("small circle in image map", () => {
    const map = document.createElement("map");
    map.setAttribute("name", "map");
    const img = document.createElement("img");
    img.setAttribute("usemap", "#map");
    img.style.width = "100px";
    img.style.height = "100px";
    document.body.appendChild(map);
    document.body.appendChild(img);
    const el = document.createElement("area");
    el.setAttribute("shape", "circle");
    el.setAttribute("coords", "20,20,11");
    map.appendChild(el);
    expect(TargetSize.evaluate(el, { enabled: true }, {})).toEqual([
      {
        type: "warning",
        message: "Small target",
        ruleName: "target-size",
      },
    ]);
  });

  test("big circle in image map", () => {
    const map = document.createElement("map");
    map.setAttribute("name", "map");
    const img = document.createElement("img");
    img.setAttribute("usemap", "#map");
    img.style.width = "100px";
    img.style.height = "100px";
    document.body.appendChild(map);
    document.body.appendChild(img);
    const el = document.createElement("area");
    el.setAttribute("shape", "circle");
    el.setAttribute("coords", "20,20,12");
    map.appendChild(el);
    expect(TargetSize.evaluate(el, { enabled: true }, {})).toBeUndefined();
  });

  test("small poly in image map", () => {
    const map = document.createElement("map");
    map.setAttribute("name", "map");
    const img = document.createElement("img");
    img.setAttribute("usemap", "#map");
    img.style.width = "100px";
    img.style.height = "100px";
    document.body.appendChild(map);
    document.body.appendChild(img);
    const el = document.createElement("area");
    el.setAttribute("shape", "poly");
    el.setAttribute("coords", "10,10,10,33,33,33,33,10");
    map.appendChild(el);
    expect(TargetSize.evaluate(el, { enabled: true }, {})).toEqual([
      {
        type: "warning",
        message: "Small target",
        ruleName: "target-size",
      },
    ]);
  });

  test("big poly in image map", () => {
    const map = document.createElement("map");
    map.setAttribute("name", "map");
    const img = document.createElement("img");
    img.setAttribute("usemap", "#map");
    img.style.width = "100px";
    img.style.height = "100px";
    document.body.appendChild(map);
    document.body.appendChild(img);
    const el = document.createElement("area");
    el.setAttribute("shape", "poly");
    el.setAttribute("coords", "10,10,10,34,34,34,34,10");
    map.appendChild(el);
    expect(TargetSize.evaluate(el, { enabled: true }, {})).toBeUndefined();
  });

  test("disabled", () => {
    const el = document.createElement("button");
    el.textContent = "button";
    el.style.width = "10px";
    el.style.height = "10px";
    document.body.appendChild(el);
    expect(TargetSize.evaluate(el, { enabled: false }, {})).toBeUndefined();
  });
});
