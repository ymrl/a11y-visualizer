import React from "react";
import root from "react-shadow";
import { SettingsContext } from "../contexts/SettingsContext";
import type { ElementMeta } from "../types";
import { ElementInfo } from "./ElementInfo";
import { Style } from "./Style";

const ELEMENT_SIZE_ENHANCEMENT = 4;

export const ElementList = ({
  list,
  width,
  height,
}: {
  list: ElementMeta[];
  width: number;
  height: number;
}) => {
  const { interactiveMode } = React.useContext(SettingsContext);
  const [hoveredElementIndices, setHoveredElementIndices] = React.useState<
    number[]
  >([]);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!ref.current) return;
    const doc = ref.current.ownerDocument;
    if (!doc) return;
    const win = doc.defaultView;
    if (!win) return;
    if (!interactiveMode) {
      setHoveredElementIndices([]);
      return;
    }

    const getElementIndicesAtCoordinate = (x: number, y: number): number[] => {
      // Find all elements at the given coordinates
      return list.reduce<number[]>((acc, meta, i) => {
        const { absoluteX, absoluteY } = meta;
        if (
          meta.rects.some((rect) => {
            const {
              relativeX,
              relativeY,
              width: rectWidth,
              height: rectHeight,
            } = rect;
            return (
              x >= absoluteX + relativeX - ELEMENT_SIZE_ENHANCEMENT &&
              x <=
                absoluteX + relativeX + rectWidth + ELEMENT_SIZE_ENHANCEMENT &&
              y >= absoluteY + relativeY - ELEMENT_SIZE_ENHANCEMENT &&
              y <= absoluteY + relativeY + rectHeight + ELEMENT_SIZE_ENHANCEMENT
            );
          })
        ) {
          acc.push(i);
        }
        return acc;
      }, []);
    };

    const updateHoveredElements = (coordinates: { x: number; y: number }[]) => {
      // Collect all element indices from all coordinates
      const allIndices = new Set<number>();
      coordinates.forEach(({ x, y }) => {
        getElementIndicesAtCoordinate(x, y).forEach((index) => {
          allIndices.add(index);
        });
      });
      setHoveredElementIndices(Array.from(allIndices));
    };

    const handleMouseMove = (e: MouseEvent) => {
      updateHoveredElements([{ x: e.pageX, y: e.pageY }]);
    };

    const handleTouchStart = (e: TouchEvent) => {
      const coordinates = Array.from(e.touches).map((touch) => ({
        x: touch.pageX,
        y: touch.pageY,
      }));
      updateHoveredElements(coordinates);
    };

    // Debounce touchmove to reduce update frequency
    let touchMoveTimeout: number | null = null;
    const handleTouchMove = (e: TouchEvent) => {
      if (touchMoveTimeout !== null) {
        win.clearTimeout(touchMoveTimeout);
      }
      touchMoveTimeout = win.setTimeout(() => {
        const coordinates = Array.from(e.touches).map((touch) => ({
          x: touch.pageX,
          y: touch.pageY,
        }));
        updateHoveredElements(coordinates);
        touchMoveTimeout = null;
      }, 16); // ~60fps throttling
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchMoveTimeout !== null) {
        win.clearTimeout(touchMoveTimeout);
        touchMoveTimeout = null;
      }
      // When touchend occurs, e.touches is empty, so we need to check if there are any remaining touches
      if (e.touches.length === 0) {
        // No touches remaining, clear all highlighted elements
        setHoveredElementIndices([]);
      } else {
        // Some touches remaining, update with current touches
        const coordinates = Array.from(e.touches).map((touch) => ({
          x: touch.pageX,
          y: touch.pageY,
        }));
        updateHoveredElements(coordinates);
      }
    };

    win.addEventListener("mousemove", handleMouseMove, { passive: true });
    const isTouchDevice = 'ontouchstart' in win || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      win.addEventListener("touchstart", handleTouchStart, { passive: true });
      win.addEventListener("touchmove", handleTouchMove, { passive: true });
      win.addEventListener("touchend", handleTouchEnd, { passive: true });
    }
    return () => {
      win.removeEventListener("mousemove", handleMouseMove);
      if (isTouchDevice) {
        win.removeEventListener("touchstart", handleTouchStart);
        win.removeEventListener("touchmove", handleTouchMove);
        win.removeEventListener("touchend", handleTouchEnd);
      }
      if (touchMoveTimeout !== null) {
        win.clearTimeout(touchMoveTimeout);
      }
    };
  }, [interactiveMode, list]);
  return (
    <root.div mode="closed">
      <Style />
      <div
        className="ElementList"
        style={{
          width: width,
          height: height,
          overflow: "hidden",
        }}
        ref={ref}
      >
        {list.map((meta, i) => {
          return (
            <ElementInfo
              key={`${i}-${meta.category}-${meta.name}`}
              meta={meta}
              rootHeight={height}
              rootWidth={width}
              isHovered={hoveredElementIndices.includes(i)}
            />
          );
        })}
      </div>
    </root.div>
  );
};
