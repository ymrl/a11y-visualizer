import { afterEach, describe, expect, test } from "vitest";
import { getAnnounceableText, resolveLiveLevel } from "./liveRegion";

describe("resolveLiveLevel", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    document.head.innerHTML = "";
  });

  const create = (html: string): Element => {
    document.body.innerHTML = html;
    return document.body.firstElementChild as Element;
  };

  test("role=alert without aria-live is assertive", () => {
    expect(resolveLiveLevel(create(`<div role="alert"></div>`))).toBe(
      "assertive",
    );
  });

  test("explicit aria-live overrides role=alert", () => {
    expect(
      resolveLiveLevel(create(`<div role="alert" aria-live="polite"></div>`)),
    ).toBe("polite");
  });

  test("role=status without aria-live is polite", () => {
    expect(resolveLiveLevel(create(`<div role="status"></div>`))).toBe(
      "polite",
    );
  });

  test("explicit aria-live overrides role=status", () => {
    expect(
      resolveLiveLevel(
        create(`<div role="status" aria-live="assertive"></div>`),
      ),
    ).toBe("assertive");
  });

  test("role=log without aria-live is polite", () => {
    expect(resolveLiveLevel(create(`<div role="log"></div>`))).toBe("polite");
  });

  test("output element is polite", () => {
    expect(resolveLiveLevel(create(`<output></output>`))).toBe("polite");
  });

  test("aria-live=off is off", () => {
    expect(resolveLiveLevel(create(`<div aria-live="off"></div>`))).toBe("off");
  });

  test("aria-live=assertive on a plain element is assertive", () => {
    expect(resolveLiveLevel(create(`<div aria-live="assertive"></div>`))).toBe(
      "assertive",
    );
  });

  test("invalid aria-live value is treated as off", () => {
    expect(resolveLiveLevel(create(`<div aria-live="rude"></div>`))).toBe(
      "off",
    );
  });

  test("effective role that is not a live region is off", () => {
    // 先頭の有効なロールが button なので実効ロールは button
    expect(resolveLiveLevel(create(`<div role="button status"></div>`))).toBe(
      "off",
    );
  });

  test("plain element without role or aria-live is off", () => {
    expect(resolveLiveLevel(create(`<div></div>`))).toBe("off");
  });
});

describe("getAnnounceableText", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    document.head.innerHTML = "";
  });

  const create = (html: string): Element => {
    document.body.innerHTML = html;
    return document.body.firstElementChild as Element;
  };

  test("returns plain text content", () => {
    expect(getAnnounceableText(create(`<div>hello world</div>`))).toBe(
      "hello world",
    );
  });

  test("excludes aria-hidden descendants", () => {
    expect(
      getAnnounceableText(
        create(`<div>visible<span aria-hidden="true">hidden</span></div>`),
      ),
    ).toBe("visible");
  });

  test("excludes display:none descendants", () => {
    expect(
      getAnnounceableText(
        create(`<div>visible<span style="display:none">hidden</span></div>`),
      ),
    ).toBe("visible");
  });

  test("excludes visibility:hidden descendants", () => {
    expect(
      getAnnounceableText(
        create(
          `<div>visible<span style="visibility:hidden">hidden</span></div>`,
        ),
      ),
    ).toBe("visible");
  });

  test("returns empty string when the node itself is aria-hidden", () => {
    expect(
      getAnnounceableText(create(`<div aria-hidden="true">hidden</div>`)),
    ).toBe("");
  });

  test("preserves nested visible text", () => {
    expect(
      getAnnounceableText(create(`<div><span>a</span> <span>b</span></div>`)),
    ).toBe("a b");
  });

  test("filters aria-hidden even on detached nodes", () => {
    const div = document.createElement("div");
    div.innerHTML = `visible<span aria-hidden="true">hidden</span>`;
    // 切り離されたノードでも aria-hidden は除外する
    expect(getAnnounceableText(div)).toBe("visible");
  });

  test("returns text of a text node", () => {
    const text = document.createTextNode("plain");
    expect(getAnnounceableText(text)).toBe("plain");
  });
});
