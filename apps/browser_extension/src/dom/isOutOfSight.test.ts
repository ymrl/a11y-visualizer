import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { isOutOfSight } from "./isOutOfSight";

describe("isOutOfSight", () => {
  let mockElementsFromPoint: ReturnType<typeof vi.fn>;
  let mockGetBoundingClientRect: ReturnType<typeof vi.fn>;
  let mockGetComputedStyle: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    document.body.innerHTML = "";
    mockElementsFromPoint = vi.fn();
    mockGetBoundingClientRect = vi.fn();
    mockGetComputedStyle = vi.fn();

    // Mock getBoundingClientRect for elements
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;

    // Mock getComputedStyle and elementsFromPoint for window
    const mockWindow = {
      getComputedStyle: mockGetComputedStyle,
      document: {
        elementsFromPoint: mockElementsFromPoint,
      },
    };
    Object.defineProperty(document, "defaultView", {
      value: mockWindow,
      configurable: true,
    });
  });

  afterEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

  test("要素が opacity: 0 の場合は見えないとみなす", () => {
    const element = document.createElement("div");
    document.body.appendChild(element);

    mockGetBoundingClientRect.mockReturnValue({
      width: 100,
      height: 100,
      left: 0,
      top: 0,
      right: 100,
      bottom: 100,
    });

    mockGetComputedStyle.mockReturnValue({
      opacity: "0",
    });

    expect(isOutOfSight(element)).toBe(true);
  });

  test("祖先要素が opacity: 0 の場合は見えないとみなす", () => {
    const parent = document.createElement("div");
    const element = document.createElement("div");
    parent.appendChild(element);
    document.body.appendChild(parent);

    mockGetBoundingClientRect.mockReturnValue({
      width: 100,
      height: 100,
      left: 0,
      top: 0,
      right: 100,
      bottom: 100,
    });

    mockGetComputedStyle
      .mockReturnValueOnce({ opacity: "1" }) // element
      .mockReturnValueOnce({ opacity: "0" }); // parent

    expect(isOutOfSight(element)).toBe(true);
  });

  test("要素の幅や高さが0の場合は見えないとみなす", () => {
    const element = document.createElement("div");
    document.body.appendChild(element);

    mockGetBoundingClientRect.mockReturnValue({
      width: 0,
      height: 100,
      left: 0,
      top: 0,
      right: 0,
      bottom: 100,
    });

    mockGetComputedStyle.mockReturnValue({
      opacity: "1",
    });

    expect(isOutOfSight(element)).toBe(true);
  });

  test("elementsFromPointで要素が見つかる場合は見えているとみなす", () => {
    const element = document.createElement("div");
    document.body.appendChild(element);

    mockGetBoundingClientRect.mockReturnValue({
      width: 100,
      height: 100,
      left: 0,
      top: 0,
      right: 100,
      bottom: 100,
    });

    mockGetComputedStyle.mockReturnValue({
      opacity: "1",
    });

    // elementsFromPointで要素自身が最上位で返される
    mockElementsFromPoint.mockReturnValue([element, document.body]);

    expect(isOutOfSight(element)).toBe(false);
  });

  test("elementsFromPointで要素の子要素が見つかる場合は見えているとみなす", () => {
    const element = document.createElement("div");
    const child = document.createElement("span");
    element.appendChild(child);
    document.body.appendChild(element);

    mockGetBoundingClientRect.mockReturnValue({
      width: 100,
      height: 100,
      left: 0,
      top: 0,
      right: 100,
      bottom: 100,
    });

    mockGetComputedStyle.mockReturnValue({
      opacity: "1",
    });

    // elementsFromPointで子要素が最上位で返される
    mockElementsFromPoint.mockReturnValue([child, element, document.body]);

    expect(isOutOfSight(element)).toBe(false);
  });

  test("elementsFromPointで他の要素が返される場合は見えないとみなす", () => {
    const element = document.createElement("div");
    const otherElement = document.createElement("div");
    document.body.appendChild(element);
    document.body.appendChild(otherElement);

    mockGetBoundingClientRect.mockReturnValue({
      width: 100,
      height: 100,
      left: 0,
      top: 0,
      right: 100,
      bottom: 100,
    });

    mockGetComputedStyle.mockReturnValue({
      opacity: "1",
    });

    // elementsFromPointで他の要素が最上位で返される（4つの角すべて）
    mockElementsFromPoint.mockReturnValue([otherElement, document.body]);

    expect(isOutOfSight(element)).toBe(true);
  });

  test("除外要素がelementsFromPointで返される場合は無視する", () => {
    const element = document.createElement("div");
    const excludeElement = document.createElement("div");
    document.body.appendChild(element);
    document.body.appendChild(excludeElement);

    mockGetBoundingClientRect.mockReturnValue({
      width: 100,
      height: 100,
      left: 0,
      top: 0,
      right: 100,
      bottom: 100,
    });

    mockGetComputedStyle.mockReturnValue({
      opacity: "1",
    });

    // 最初の3つの角で除外要素が返され、最後の角で要素自身が最上位で返される
    mockElementsFromPoint
      .mockReturnValueOnce([excludeElement, document.body])
      .mockReturnValueOnce([excludeElement, document.body])
      .mockReturnValueOnce([excludeElement, document.body])
      .mockReturnValueOnce([element, document.body]);

    expect(isOutOfSight(element, [excludeElement])).toBe(false);
  });

  test("ownerDocumentがnullの場合は見えないとみなす", () => {
    const element = document.createElement("div");
    // documentから切り離す
    Object.defineProperty(element, "ownerDocument", {
      value: null,
      configurable: true,
    });

    expect(isOutOfSight(element)).toBe(true);
  });

  test("defaultViewがnullの場合は見えないとみなす", () => {
    const element = document.createElement("div");
    document.body.appendChild(element);

    // mockで defaultView を null に設定
    Object.defineProperty(element.ownerDocument, "defaultView", {
      value: null,
      configurable: true,
    });

    expect(isOutOfSight(element)).toBe(true);
  });

  test("Accessibility Visualizerの要素がelementsFromPointで返される場合は無視する", () => {
    const element = document.createElement("div");
    const accessibilityVisualizerElement = document.createElement("div");
    accessibilityVisualizerElement.setAttribute(
      "data-a11y-visualizer-extension",
      "",
    );

    document.body.appendChild(element);
    document.body.appendChild(accessibilityVisualizerElement);

    mockGetBoundingClientRect.mockReturnValue({
      width: 100,
      height: 100,
      left: 0,
      top: 0,
      right: 100,
      bottom: 100,
    });

    mockGetComputedStyle.mockReturnValue({
      opacity: "1",
    });

    // 最初の3つの角でAccessibility Visualizerの要素が上に来て、最後の角で要素自身が最上位
    mockElementsFromPoint
      .mockReturnValueOnce([
        accessibilityVisualizerElement,
        element,
        document.body,
      ])
      .mockReturnValueOnce([
        accessibilityVisualizerElement,
        element,
        document.body,
      ])
      .mockReturnValueOnce([
        accessibilityVisualizerElement,
        element,
        document.body,
      ])
      .mockReturnValueOnce([element, document.body]);

    expect(isOutOfSight(element)).toBe(false);
  });

  test("Accessibility Visualizerの子要素がelementsFromPointで返される場合は無視する", () => {
    const element = document.createElement("div");
    const accessibilityVisualizerRoot = document.createElement("div");
    const accessibilityVisualizerChild = document.createElement("span");

    accessibilityVisualizerRoot.setAttribute(
      "data-a11y-visualizer-extension",
      "",
    );
    accessibilityVisualizerRoot.appendChild(accessibilityVisualizerChild);

    document.body.appendChild(element);
    document.body.appendChild(accessibilityVisualizerRoot);

    mockGetBoundingClientRect.mockReturnValue({
      width: 100,
      height: 100,
      left: 0,
      top: 0,
      right: 100,
      bottom: 100,
    });

    mockGetComputedStyle.mockReturnValue({
      opacity: "1",
    });

    // 最初の3つの角でAccessibility Visualizerの子要素が上に来て、最後の角で要素自身が最上位
    mockElementsFromPoint
      .mockReturnValueOnce([
        accessibilityVisualizerChild,
        element,
        document.body,
      ])
      .mockReturnValueOnce([
        accessibilityVisualizerChild,
        element,
        document.body,
      ])
      .mockReturnValueOnce([
        accessibilityVisualizerChild,
        element,
        document.body,
      ])
      .mockReturnValueOnce([element, document.body]);

    expect(isOutOfSight(element)).toBe(false);
  });

  test("Accessibility Visualizerの要素のみが返される場合は見えないとみなす", () => {
    const element = document.createElement("div");
    const accessibilityVisualizerElement = document.createElement("div");
    accessibilityVisualizerElement.setAttribute(
      "data-a11y-visualizer-extension",
      "",
    );

    document.body.appendChild(element);
    document.body.appendChild(accessibilityVisualizerElement);

    mockGetBoundingClientRect.mockReturnValue({
      width: 100,
      height: 100,
      left: 0,
      top: 0,
      right: 100,
      bottom: 100,
    });

    mockGetComputedStyle.mockReturnValue({
      opacity: "1",
    });

    // すべての角でAccessibility Visualizerの要素のみが返される（要素は完全に隠れている）
    mockElementsFromPoint.mockReturnValue([
      accessibilityVisualizerElement,
      document.body,
    ]);

    expect(isOutOfSight(element)).toBe(true);
  });
});
