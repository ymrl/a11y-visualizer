import { describe, expect, test } from "vitest";
import { getKnownRole } from "./getKnownRole";

describe("getKnownRole", () => {
  test("implicit role", () => {
    const el = document.createElement("button");
    const role = getKnownRole(el);
    expect(role).toBe("button");
  });
  test("explicit single role", () => {
    const el = document.createElement("div");
    el.setAttribute("role", "button");
    const role = getKnownRole(el);
    expect(role).toBe("button");
  });

  test("explicit multiple roles", () => {
    const el = document.createElement("div");
    el.setAttribute("role", "unknown button");
    const role = getKnownRole(el);
    expect(role).toBe("button");
  });

  test("unknown role", () => {
    const el = document.createElement("div");
    el.setAttribute("role", "unknown");
    const role = getKnownRole(el);
    expect(role).toBe(null);
  });

  test("div", () => {
    const el = document.createElement("div");
    const role = getKnownRole(el);
    expect(role).toBe(null);
  });

  test("input provisional role", () => {
    const el = document.createElement("input");
    el.setAttribute("type", "password");
    const role = getKnownRole(el);
    expect(role).toBe("textbox");
  });

  test("svg without role", () => {
    const el = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const role = getKnownRole(el);
    expect(role).toBe("graphics-document");
  });
});
