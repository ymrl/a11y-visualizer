import { describe, expect, test } from "vitest";
import { getElementPosition } from "./getElementPosition";

const position = {
  x: 10,
  y: 20,
  absoluteX: 10,
  absoluteY: 20,
  width: 30,
  height: 40,
};
describe("getElementPosition", () => {
  const w = { scrollX: 100, scrollY: 200 } as Window;
  const el = document.createElement("div");
  el.getBoundingClientRect = () => ({
    ...position,
    top: position.y,
    left: position.x,
    right: 40,
    bottom: 60,
    toJSON: () => "",
  });
  test("normal element", () => {
    expect(getElementPosition(el, w)).toEqual({
      x: 110,
      y: 220,
      absoluteX: 110,
      absoluteY: 220,
      width: 30,
      height: 40,
    });
  });

  test("with offset", () => {
    const offsetX = 10;
    const offsetY = 20;
    expect(getElementPosition(el, w, offsetX, offsetY)).toEqual({
      x: 100,
      y: 200,
      absoluteX: 110,
      absoluteY: 220,
      width: 30,
      height: 40,
    });
  });

  describe("area element", () => {
    const img = document.createElement("img");
    img.getBoundingClientRect = () => ({
      ...position,
      top: position.y,
      left: position.x,
      right: 40,
      bottom: 60,
      toJSON: () => "",
    });
    img.id = "img";
    img.useMap = "#map";
    document.body.appendChild(img);
    const map = document.createElement("map");
    map.id = "map";
    document.body.appendChild(map);
    const area = document.createElement("area");
    map.appendChild(area);

    test("without coords or shape", () => {
      const w = { scrollX: 0, scrollY: 0 } as Window;
      const area = document.createElement("area");
      map.appendChild(area);
      expect(getElementPosition(area, w)).toEqual(position);
    });
    test("without shape", () => {
      const w = { scrollX: 0, scrollY: 0 } as Window;
      const area = document.createElement("area");
      map.appendChild(area);
      area.setAttribute("coords", "5,6,10,12");
      expect(getElementPosition(area, w)).toEqual({
        x: position.x + 5,
        y: position.y + 6,
        absoluteX: position.x + 5,
        absoluteY: position.y + 6,
        width: 5,
        height: 6,
      });
    });
    test("without coords", () => {
      const w = { scrollX: 0, scrollY: 0 } as Window;
      const area = document.createElement("area");
      map.appendChild(area);
      area.setAttribute("shape", "rect");
      expect(getElementPosition(area, w)).toEqual(position);
    });
    test("rect", () => {
      const w = { scrollX: 0, scrollY: 0 } as Window;
      const area = document.createElement("area");
      map.appendChild(area);
      area.setAttribute("shape", "rect");
      area.setAttribute("coords", "5,6,10,12");
      expect(getElementPosition(area, w)).toEqual({
        x: position.x + 5,
        y: position.y + 6,
        absoluteX: position.x + 5,
        absoluteY: position.y + 6,
        width: 5,
        height: 6,
      });
    });
    test("circle", () => {
      const w = { scrollX: 0, scrollY: 0 } as Window;
      const area = document.createElement("area");
      map.appendChild(area);
      area.setAttribute("shape", "circle");
      area.setAttribute("coords", "9,8,7");
      expect(getElementPosition(area, w)).toEqual({
        x: position.x + 2,
        y: position.y + 1,
        absoluteX: position.x + 2,
        absoluteY: position.y + 1,
        width: 14,
        height: 14,
      });
    });
    test("poly", () => {
      const w = { scrollX: 0, scrollY: 0 } as Window;
      const area = document.createElement("area");
      map.appendChild(area);
      area.setAttribute("shape", "poly");
      area.setAttribute("coords", "5,6,10,6,10,12,5,12");
      expect(getElementPosition(area, w)).toEqual({
        x: position.x + 5,
        y: position.y + 6,
        absoluteX: position.x + 5,
        absoluteY: position.y + 6,
        width: 5,
        height: 6,
      });
    });
  });
});
