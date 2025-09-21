import React from "react";
import root from "react-shadow";
import { SettingsContext } from "../contexts/SettingsContext";
import type { ElementMeta } from "../types";
import { ElementInfo } from "./ElementInfo";
import { Style } from "./Style";

const ELEMENT_SIZE_ENHANCEMENT = 4;

const isElementIncludeCoordinates = (
  element: ElementMeta,
  coordinates: { x: number; y: number }[],
): boolean => {
  const { absoluteX, absoluteY } = element;
  return element.rects.some((rect) => {
    const { relativeX, relativeY, width: rectWidth, height: rectHeight } = rect;
    return coordinates.some(
      ({ x, y }) =>
        x >= absoluteX + relativeX - ELEMENT_SIZE_ENHANCEMENT &&
        x <= absoluteX + relativeX + rectWidth + ELEMENT_SIZE_ENHANCEMENT &&
        y >= absoluteY + relativeY - ELEMENT_SIZE_ENHANCEMENT &&
        y <= absoluteY + relativeY + rectHeight + ELEMENT_SIZE_ENHANCEMENT,
    );
  });
};

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
  const [userCoordinates, setUserCoordinates] = React.useState<
    { x: number; y: number }[]
  >([]);
  const cleanupRef = React.useRef<() => void>();

  const setCallbacks = React.useCallback(
    (node: HTMLDivElement | null) => {
      if (!interactiveMode) {
        if (cleanupRef.current) {
          cleanupRef.current();
          cleanupRef.current = undefined;
        }
        setUserCoordinates([]);
        return;
      }
      if (cleanupRef.current) return;
      const win = node?.ownerDocument?.defaultView;
      if (!win) return;

      const handleMouseMove = (e: MouseEvent) => {
        setUserCoordinates([{ x: e.pageX, y: e.pageY }]);
      };

      const handleTouchStart = (e: TouchEvent) => {
        const coordinates = Array.from(e.touches).map((touch) => ({
          x: touch.pageX,
          y: touch.pageY,
        }));
        setUserCoordinates(coordinates);
      };

      const handleTouchMove = (e: TouchEvent) => {
        const coordinates = Array.from(e.touches).map((touch) => ({
          x: touch.pageX,
          y: touch.pageY,
        }));
        setUserCoordinates(coordinates);
      };

      const handleTouchEnd = (e: TouchEvent) => {
        // When touchend occurs, e.touches is empty, so we need to check if there are any remaining touches
        if (e.touches.length === 0) {
          setUserCoordinates([]);
        } else {
          // Some touches remaining, update with current touches
          const coordinates = Array.from(e.touches).map((touch) => ({
            x: touch.pageX,
            y: touch.pageY,
          }));
          setUserCoordinates(coordinates);
        }
      };
      win.addEventListener("mousemove", handleMouseMove, { passive: true });
      const isTouchDevice =
        "ontouchstart" in win || navigator.maxTouchPoints > 0;
      if (isTouchDevice) {
        win.addEventListener("touchstart", handleTouchStart, { passive: true });
        win.addEventListener("touchmove", handleTouchMove, { passive: true });
        win.addEventListener("touchend", handleTouchEnd, { passive: true });
      }
      cleanupRef.current = () => {
        try {
          win.removeEventListener("mousemove", handleMouseMove);
          if (isTouchDevice) {
            win.removeEventListener("touchstart", handleTouchStart);
            win.removeEventListener("touchmove", handleTouchMove);
            win.removeEventListener("touchend", handleTouchEnd);
          }
        } catch (e) {
          // Ignore errors of same-origin policy
          if (
            e &&
            typeof e === "object" &&
            "name" in e &&
            e.name !== "SecurityError"
          ) {
            throw e;
          }
        }
      };
    },
    [interactiveMode],
  );

  React.useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = undefined;
      }
    };
  }, []);

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
        ref={setCallbacks}
      >
        {list.map((meta, i) => {
          return (
            <ElementInfo
              key={`${i}-${meta.category}-${meta.name}`}
              meta={meta}
              rootHeight={height}
              rootWidth={width}
              isHovered={isElementIncludeCoordinates(meta, userCoordinates)}
            />
          );
        })}
      </div>
    </root.div>
  );
};
