import { afterEach, describe, expect, test, vi } from "vitest";
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
    expect(emptyResult).toHaveLength(0);
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
    expect(result).toHaveLength(2);
    expect(result[0].category).toBe("image");
    expect(result[1].category).toBe("image");
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
    expect(result).toHaveLength(3);
  });

  test("link", () => {
    document.body.innerHTML = `
      <h1>link</h1>
      <a href="https://example.com">link</a>
      <span role="link">hoge</span>
    `;
    const result = collectElements(document.body, [], { link: true });
    expect(result).toHaveLength(2);
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
    expect(result).toHaveLength(5);
  });

  test("heading", () => {
    document.body.innerHTML = `
      <h1>h1</h1>
      <h2>h2</h2>
      <div role="heading">hoge</div>
      <p>hoge</p>
    `;
    const result = collectElements(document.body, [], { heading: true });
    expect(result).toHaveLength(3);
  });

  test("waiAria", () => {
    document.body.innerHTML = `
      <h1>waiAria</h1>
      <div aria-hidden="true">hidden</div>`;
    const result = collectElements(document.body, [], { waiAria: true });
    expect(result).toHaveLength(1);
  });

  describe("viewport options", () => {
    test("viewportScrollX, viewportScrollY, viewportWidth, viewportHeight が指定された場合、window のプロパティの代わりに使用される", () => {
      document.body.innerHTML = `
        <img src="test.jpg" alt="Test image">
      `;
      const result = collectElements(
        document.body,
        [],
        { image: true },
        {
          viewportScrollX: 0,
          viewportScrollY: 0,
          viewportWidth: 800,
          viewportHeight: 600,
        },
      );
      expect(result).toHaveLength(1);
    });

    test("viewport options が未指定の場合、window のプロパティが使用される", () => {
      document.body.innerHTML = `
        <img src="test.jpg" alt="Test image">
      `;
      const result = collectElements(document.body, [], { image: true }, {});
      expect(result).toHaveLength(1);
    });
  });

  describe("hideOutOfSightElementTips option", () => {
    test("hideOutOfSightElementTips が false の場合、視覚的に見えない要素もフィルタしない", () => {
      document.body.innerHTML = `
        <img src="test.jpg" alt="Test image">
        <div style="opacity: 0;"><img src="hidden.jpg" alt="Hidden image"></div>
      `;

      const mockIsOutOfSight = vi.fn();

      // _isOutOfSight が呼ばれないはず
      const result = collectElements(
        document.body,
        [],
        { image: true },
        { hideOutOfSightElementTips: false, _isOutOfSight: mockIsOutOfSight },
      );

      expect(mockIsOutOfSight).not.toHaveBeenCalled();
      expect(result).toHaveLength(2);
    });

    test("hideOutOfSightElementTips が true の場合、視覚的に見えない要素をフィルタする", () => {
      document.body.innerHTML = `
        <img src="test.jpg" alt="Test image">
        <div style="opacity: 0;"><img src="hidden.jpg" alt="Hidden image"></div>
      `;

      // 最初の画像は見える、2番目は見えない
      const mockIsOutOfSight = vi
        .fn()
        .mockReturnValueOnce(false) // 最初の画像
        .mockReturnValueOnce(true); // 2番目の画像

      const result = collectElements(
        document.body,
        [],
        { image: true },
        { hideOutOfSightElementTips: true, _isOutOfSight: mockIsOutOfSight },
      );

      expect(mockIsOutOfSight).toHaveBeenCalledTimes(2);
      expect(result).toHaveLength(1);
    });

    test("hideOutOfSightElementTips が undefined の場合、デフォルトでフィルタしない", () => {
      document.body.innerHTML = `
        <img src="test.jpg" alt="Test image">
        <div style="opacity: 0;"><img src="hidden.jpg" alt="Hidden image"></div>
      `;

      const mockIsOutOfSight = vi.fn();

      const result = collectElements(
        document.body,
        [],
        { image: true },
        { _isOutOfSight: mockIsOutOfSight }, // hideOutOfSightElementTips 未指定
      );

      expect(mockIsOutOfSight).not.toHaveBeenCalled();
      expect(result).toHaveLength(2);
    });
  });
});
