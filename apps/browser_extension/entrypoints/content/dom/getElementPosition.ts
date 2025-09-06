import type { ElementPosition } from "../types";
export const getElementPosition = (
  el: Element,
  w: Window,
  offsetX: number = 0,
  offsetY: number = 0,
): ElementPosition => {
  if (el.tagName.toLowerCase() === "area") {
    return getAreaElementPosition(el, w, offsetX, offsetY);
  }
  const scrollX = w.scrollX;
  const scrollY = w.scrollY;

  const rect = el.getBoundingClientRect();
  return {
    x: rect.x + scrollX - offsetX,
    y: rect.y + scrollY - offsetY,
    absoluteX: rect.x + scrollX,
    absoluteY: rect.y + scrollY,
    width: rect.width,
    height: rect.height,
  };
};

const getAreaElementPosition = (
  el: Element,
  w: Window,
  offsetX: number = 0,
  offsetY: number = 0,
): ElementPosition => {
  const map = el.closest("map");
  const img = map?.id
    ? map.ownerDocument.querySelector(`img[usemap="#${map.id}"]`)
    : map?.name
      ? map.ownerDocument.querySelector(`img[usemap="#${map.name}"]`)
      : null;
  const rect = (img || el).getBoundingClientRect();
  const coords = el.getAttribute("coords")?.split(",").map(Number);
  const shape = el.getAttribute("shape");
  const scrollX = w.scrollX;
  const scrollY = w.scrollY;

  if (coords && (shape === "rect" || !shape) && coords.length >= 4) {
    return {
      x: rect.x + coords[0] + scrollX - offsetX,
      y: rect.y + coords[1] + scrollY - offsetY,
      absoluteX: rect.x + coords[0] + scrollX,
      absoluteY: rect.y + coords[1] + scrollY,
      width: coords[2] - coords[0],
      height: coords[3] - coords[1],
    };
  }
  if (coords && shape === "circle" && coords.length >= 3) {
    return {
      x: rect.x + coords[0] - coords[2] + scrollX - offsetX,
      y: rect.y + coords[1] - coords[2] + scrollY - offsetY,
      absoluteX: rect.x + coords[0] - coords[2] + scrollX,
      absoluteY: rect.y + coords[1] - coords[2] + scrollY,
      width: coords[2] * 2,
      height: coords[2] * 2,
    };
  }
  if (coords && shape === "poly" && coords.length >= 6) {
    const absoluteX =
      rect.x + Math.min(...coords.filter((_, i) => i % 2 === 0)) + scrollX;
    const absoluteY =
      rect.y + Math.min(...coords.filter((_, i) => i % 2 === 1)) + scrollY;
    return {
      x: absoluteX - offsetX,
      y: absoluteY - offsetY,
      absoluteX,
      absoluteY,
      width:
        Math.max(...coords.filter((_, i) => i % 2 === 0)) -
        Math.min(...coords.filter((_, i) => i % 2 === 0)),
      height:
        Math.max(...coords.filter((_, i) => i % 2 === 1)) -
        Math.min(...coords.filter((_, i) => i % 2 === 1)),
    };
  }
  return {
    x: rect.x + scrollX - offsetX,
    y: rect.y + scrollY - offsetY,
    absoluteX: rect.x + scrollX,
    absoluteY: rect.y + scrollY,
    width: rect.width,
    height: rect.height,
  };
};
