import { afterEach, describe, expect, test } from "vitest";
import { collectElements } from "./collectElements";

describe("collectElements()", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("no category", () => {
    document.body.innerHTML = `
      <h1>image</h1>
      <img src="https://example.com/image.jpg" alt="img" />
      <button>hoge</button><a href="https://example.com">link</a>
    `;
    const emptyResult = collectElements(document.body, [], {});
    expect(emptyResult.elements).toHaveLength(0);
  });

  test("image", () => {
    document.body.innerHTML = `
      <h1>image</h1>
      <img src="https://example.com/image.jpg" alt="img" />
      <span role="img">hoge</span>
    `;
    const exclude = document.createElement("div");
    const excludedImg = document.createElement("img");
    excludedImg.src = "https://example.com/image.jpg";
    exclude.appendChild(excludedImg);
    document.body.appendChild(exclude);

    const result = collectElements(document.body, [exclude], { image: true });
    expect(result.elements).toHaveLength(2);
    expect(result.elements[0].category).toBe("image");
    expect(result.elements[1].category).toBe("image");
  });

  test("formControl", () => {
    document.body.innerHTML = `
      <h1>formControl</h1>
      <input type="text">
      <select><option>hoge</option></select>
      <textarea></textarea>
    `;
    const exclude = document.createElement("div");
    document.body.appendChild(exclude);
    const result = collectElements(document.body, [], { formControl: true });
    expect(result.elements).toHaveLength(3);
  });

  test("link", () => {
    document.body.innerHTML = `
      <h1>link</h1>
      <a href="https://example.com">link</a>
      <span role="link">hoge</span>
    `;
    const result = collectElements(document.body, [], { link: true });
    expect(result.elements).toHaveLength(2);
  });

  test("button", () => {
    document.body.innerHTML = `
      <h1>button</h1>
      <button>button</button>
      <input type="button" value="button">
      <input type="submit" value="submit">
      <input type="reset" value="reset">
      <span role="button">hoge</span>
    `;
    const result = collectElements(document.body, [], { button: true });
    expect(result.elements).toHaveLength(5);
  });

  test("heading", () => {
    document.body.innerHTML = `
      <h1>h1</h1>
      <h2>h2</h2>
      <div role="heading">hoge</div>
      <p>hoge</p>
    `;
    const result = collectElements(document.body, [], { heading: true });
    expect(result.elements).toHaveLength(3);
  });

  test("ariaHidden", () => {
    document.body.innerHTML = `
      <h1>ariaHidden</h1>
      <div aria-hidden="true">hidden</div>`;
    const result = collectElements(document.body, [], { ariaHidden: true });
    expect(result.elements).toHaveLength(1);
  });
});
