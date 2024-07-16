import { describe, test, expect } from "vitest";
import { isFormControl } from "./formTips";

describe("isFormControl()", () => {
  test("div", () => {
    const element = document.createElement("div");
    expect(isFormControl(element)).toBe(false);
  });

  test("input", () => {
    const element = document.createElement("input");
    expect(isFormControl(element)).toBe(true);
  });

  test("input hidden", () => {
    const element = document.createElement("input");
    element.setAttribute("type", "hidden");
    expect(isFormControl(element)).toBe(false);
  });

  test("textarea", () => {
    const element = document.createElement("textarea");
    expect(isFormControl(element)).toBe(true);
  });

  test("select", () => {
    const element = document.createElement("select");
    expect(isFormControl(element)).toBe(true);
  });
});
