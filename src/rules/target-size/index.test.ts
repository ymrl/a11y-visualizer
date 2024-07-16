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

  test("disabled", () => {
    const el = document.createElement("button");
    el.textContent = "button";
    el.style.width = "10px";
    el.style.height = "10px";
    document.body.appendChild(el);
    expect(TargetSize.evaluate(el, { enabled: false }, {})).toBeUndefined();
  });
});
