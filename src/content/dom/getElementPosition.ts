import { ElementPosition } from "../types";
export const getElementPosition = (
  el: Element,
  w: Window,
  offsetX: number = 0,
  offsetY: number = 0,
): ElementPosition => {
  if (el.tagName.toLowerCase() === "area") {
    return getAreaElementPosition(el, w, offsetX, offsetY);
  }
  const rect = el.getBoundingClientRect();
  return {
    x: rect.x + w.scrollX - offsetX,
    y: rect.y + w.scrollY - offsetY,
    absoluteX: rect.x + w.scrollX,
    absoluteY: rect.y + w.scrollY,
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

  if (coords && (shape === "rect" || !shape) && coords.length >= 4) {
    return {
      x: rect.x + coords[0] + w.scrollX - offsetX,
      y: rect.y + coords[1] + w.scrollY - offsetY,
      absoluteX: rect.x + coords[0] + w.scrollX,
      absoluteY: rect.y + coords[1] + w.scrollY,
      width: coords[2] - coords[0],
      height: coords[3] - coords[1],
    };
  }
  if (coords && shape === "circle" && coords.length >= 3) {
    return {
      x: rect.x + coords[0] - coords[2] + w.scrollX - offsetX,
      y: rect.y + coords[1] - coords[2] + w.scrollY - offsetY,
      absoluteX: rect.x + coords[0] - coords[2] + w.scrollX,
      absoluteY: rect.y + coords[1] - coords[2] + w.scrollY,
      width: coords[2] * 2,
      height: coords[2] * 2,
    };
  }
  if (coords && shape === "poly" && coords.length >= 6) {
    const absoluteX =
      rect.x + Math.min(...coords.filter((_, i) => i % 2 === 0)) + w.scrollX;
    const absoluteY =
      rect.y + Math.min(...coords.filter((_, i) => i % 2 === 1)) + w.scrollY;
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
    x: rect.x + w.scrollX - offsetX,
    y: rect.y + w.scrollY - offsetY,
    absoluteX: rect.x + w.scrollX,
    absoluteY: rect.y + w.scrollY,
    width: rect.width,
    height: rect.height,
  };
};
