import { afterEach, describe, expect, test } from "vitest";
import { isHidden } from "./isHidden";

describe("isHidden", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    document.head.innerHTML = "";
  });

  test("no parent", () => {
    const div = document.createElement("div");
    expect(isHidden(div)).toBe(true);
  });

  test("body", () => {
    expect(isHidden(document.body)).toBe(false);
  });

  test("body > div", () => {
    const div = document.createElement("div");
    document.body.appendChild(div);
    expect(isHidden(div)).toBe(false);
  });

  test("body > div > div", () => {
    const div = document.createElement("div");
    const child = document.createElement("div");
    div.appendChild(child);
    document.body.appendChild(div);
    expect(isHidden(child)).toBe(false);
  });

  test("body > div.display-none", () => {
    const style = document.createElement("style");
    style.textContent = `
      .display-none {
        display: none;
      }
    `;
    document.head.appendChild(style);
    const div = document.createElement("div");
    div.classList.add("display-none");
    document.body.appendChild(div);
    expect(isHidden(div)).toBe(true);
  });

  test("body > div.display-none > div", () => {
    const style = document.createElement("style");
    style.textContent = `
      .display-none {
        display: none;
      }
    `;
    document.head.appendChild(style);
    const div = document.createElement("div");
    div.classList.add("display-none");
    const child = document.createElement("div");
    div.appendChild(child);
    document.body.appendChild(div);
    expect(isHidden(child)).toBe(true);
  });

  test("body > div.visibility-hidden", () => {
    const style = document.createElement("style");
    style.textContent = `
      .visibility-hidden {
        visibility: hidden;
      }
    `;
    document.head.appendChild(style);
    const div = document.createElement("div");
    div.classList.add("visibility-hidden");
    document.body.appendChild(div);
    expect(isHidden(div)).toBe(true);
  });

  test("body > div.visibility-hidden > div", () => {
    const style = document.createElement("style");
    style.textContent = `
      .visibility-hidden {
        visibility: hidden;
      }
    `;
    document.head.appendChild(style);
    const div = document.createElement("div");
    div.classList.add("visibility-hidden");
    const child = document.createElement("div");
    div.appendChild(child);
    document.body.appendChild(div);
    expect(isHidden(child)).toBe(true);
  });

  test("body > div[hidden]", () => {
    const div = document.createElement("div");
    div.hidden = true;
    document.body.appendChild(div);
    expect(isHidden(div)).toBe(true);
  });

  test("body > div[hidden] > div", () => {
    const div = document.createElement("div");
    div.hidden = true;
    const child = document.createElement("div");
    div.appendChild(child);
    document.body.appendChild(div);
    expect(isHidden(child)).toBe(true);
  });

  test("body > details > summary + div", () => {
    const details = document.createElement("details");
    const summary = document.createElement("summary");
    const content = document.createElement("div");
    details.appendChild(summary);
    details.appendChild(content);
    document.body.appendChild(details);
    expect(isHidden(details)).toBe(false);
    expect(isHidden(summary)).toBe(false);
    expect(isHidden(content)).toBe(true);
  });

  test("body > details[open] > summary + div", () => {
    const details = document.createElement("details");
    details.open = true;
    const summary = document.createElement("summary");
    const content = document.createElement("div");
    details.appendChild(summary);
    details.appendChild(content);
    document.body.appendChild(details);
    expect(isHidden(details)).toBe(false);
    expect(isHidden(summary)).toBe(false);
    expect(isHidden(content)).toBe(false);
  });
});
