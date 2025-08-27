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

  test("small button with adequate spacing", () => {
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "0px";
    container.style.top = "0px";
    container.style.width = "300px";
    container.style.height = "300px";

    // First small button at (50, 50)
    const el1 = document.createElement("button");
    el1.textContent = "button1";
    el1.style.position = "absolute";
    el1.style.left = "50px";
    el1.style.top = "50px";
    el1.style.width = "10px";
    el1.style.height = "10px";
    container.appendChild(el1);

    // Second small button at (150, 50) - 100px away (>> 24px spacing)
    const el2 = document.createElement("button");
    el2.textContent = "button2";
    el2.style.position = "absolute";
    el2.style.left = "150px";
    el2.style.top = "50px";
    el2.style.width = "10px";
    el2.style.height = "10px";
    container.appendChild(el2);

    document.body.appendChild(container);

    // Both buttons should not show warnings due to adequate spacing
    expect(TargetSize.evaluate(el1, { enabled: true }, {})).toBeUndefined();
    expect(TargetSize.evaluate(el2, { enabled: true }, {})).toBeUndefined();
  });

  test("small button with inadequate spacing", () => {
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "0px";
    container.style.top = "0px";
    container.style.width = "200px";
    container.style.height = "200px";

    // First small button at (50, 50)
    const el1 = document.createElement("button");
    el1.textContent = "button1";
    el1.style.position = "absolute";
    el1.style.left = "50px";
    el1.style.top = "50px";
    el1.style.width = "10px";
    el1.style.height = "10px";
    container.appendChild(el1);

    // Second small button at (65, 50) - 15px away (< 24px spacing, within 24px square)
    const el2 = document.createElement("button");
    el2.textContent = "button2";
    el2.style.position = "absolute";
    el2.style.left = "65px";
    el2.style.top = "50px";
    el2.style.width = "10px";
    el2.style.height = "10px";
    container.appendChild(el2);

    document.body.appendChild(container);

    // Both buttons should show warnings due to inadequate spacing
    expect(TargetSize.evaluate(el1, { enabled: true }, {})).toEqual([
      {
        type: "warning",
        message: "Small target",
        ruleName: "target-size",
      },
    ]);
    expect(TargetSize.evaluate(el2, { enabled: true }, {})).toEqual([
      {
        type: "warning",
        message: "Small target",
        ruleName: "target-size",
      },
    ]);
  });

  test("small button near large button", () => {
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "0px";
    container.style.top = "0px";
    container.style.width = "200px";
    container.style.height = "200px";

    // Small button at (50, 50)
    const smallButton = document.createElement("button");
    smallButton.textContent = "small";
    smallButton.style.position = "absolute";
    smallButton.style.left = "50px";
    smallButton.style.top = "50px";
    smallButton.style.width = "10px";
    smallButton.style.height = "10px";
    container.appendChild(smallButton);

    // Large button at (62, 45) - overlaps with 24px square around small button
    const largeButton = document.createElement("button");
    largeButton.textContent = "large";
    largeButton.style.position = "absolute";
    largeButton.style.left = "62px";
    largeButton.style.top = "45px";
    largeButton.style.width = "30px";
    largeButton.style.height = "30px";
    container.appendChild(largeButton);

    document.body.appendChild(container);

    // Small button should show warning due to inadequate spacing with large button
    expect(TargetSize.evaluate(smallButton, { enabled: true }, {})).toEqual([
      {
        type: "warning",
        message: "Small target",
        ruleName: "target-size",
      },
    ]);

    // Large button should not show warning (not small)
    expect(
      TargetSize.evaluate(largeButton, { enabled: true }, {}),
    ).toBeUndefined();
  });
});
