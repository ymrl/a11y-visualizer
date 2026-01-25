import { afterEach, describe, expect, test } from "vitest";
import { AccessibleDescription } from ".";

describe("accessible-description", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });
  test("div", () => {
    const element = document.createElement("div");
    document.body.appendChild(element);
    const result = AccessibleDescription.evaluate(
      element,
      { enabled: true },
      {},
    );
    expect(result).toBeUndefined();
  });

  test("button with aria-describedby", () => {
    const element = document.createElement("button");
    element.setAttribute("aria-describedby", "description-id");
    const description = document.createElement("p");
    description.id = "description-id";
    description.textContent = "this is description";
    document.body.appendChild(element);
    document.body.appendChild(description);
    const result = AccessibleDescription.evaluate(
      element,
      { enabled: true },
      {},
    );
    expect(result).toEqual([
      {
        type: "description",
        content: "this is description",
        ruleName: "accessible-description",
      },
    ]);
  });

  test("button with aria-describedby and hidden description", () => {
    const element = document.createElement("button");
    element.setAttribute("aria-describedby", "description-id");
    const description = document.createElement("p");
    description.id = "description-id";
    description.textContent = "this is description";
    description.hidden = true;
    document.body.appendChild(element);
    document.body.appendChild(description);
    const result = AccessibleDescription.evaluate(
      element,
      { enabled: true },
      {},
    );
    expect(result).toEqual([
      {
        type: "description",
        content: "this is description",
        ruleName: "accessible-description",
      },
    ]);
  });

  test("div with aria-describedby", () => {
    const element = document.createElement("div");
    element.setAttribute("aria-describedby", "description-id");
    const description = document.createElement("p");
    description.id = "description-id";
    description.textContent = "this is description";
    document.body.appendChild(element);
    document.body.appendChild(description);
    const result = AccessibleDescription.evaluate(
      element,
      { enabled: true },
      {},
    );
    expect(result).toEqual([
      {
        type: "description",
        content: "this is description",
        ruleName: "accessible-description",
      },
    ]);
  });

  test("button with title", () => {
    const element = document.createElement("button");
    element.title = "this is title";
    document.body.appendChild(element);
    const result = AccessibleDescription.evaluate(
      element,
      { enabled: true },
      {},
    );
    expect(result).toEqual([
      {
        type: "description",
        content: "this is title",
        ruleName: "accessible-description",
      },
    ]);
  });

  test("disabled", () => {
    const element = document.createElement("div");
    element.setAttribute("aria-describedby", "description-id");
    const description = document.createElement("p");
    description.id = "description-id";
    description.textContent = "this is description";
    document.body.appendChild(element);
    document.body.appendChild(description);
    const result = AccessibleDescription.evaluate(
      element,
      { enabled: false },
      {},
    );
    expect(result).toBeUndefined();
  });
});
