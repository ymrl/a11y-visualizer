import React from "react";
import root from "react-shadow";
import { getElementKey } from "../../../src/utils/getElementKey";
import { rafThrottle } from "../../../src/utils/rafThrottle";
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

      // 高頻度イベントによる全チップの再レンダリングを1フレーム1回に抑える
      const updateCoordinates = rafThrottle(
        (coordinates: { x: number; y: number }[]) =>
          setUserCoordinates(coordinates),
      );
      const clearCoordinates = () => {
        updateCoordinates.cancel();
        setUserCoordinates([]);
      };
      const touchesToCoordinates = (touches: TouchList) =>
        Array.from(touches).map((touch) => ({
          x: touch.pageX,
          y: touch.pageY,
        }));

      const handleMouseMove = (e: MouseEvent) => {
        updateCoordinates([{ x: e.pageX, y: e.pageY }]);
      };

      const handleTouchStart = (e: TouchEvent) => {
        updateCoordinates(touchesToCoordinates(e.touches));
      };

      const handleTouchMove = (e: TouchEvent) => {
        updateCoordinates(touchesToCoordinates(e.touches));
      };

      const handleTouchEnd = (e: TouchEvent) => {
        // When touchend occurs, e.touches is empty, so we need to check if there are any remaining touches
        if (e.touches.length === 0) {
          clearCoordinates();
        } else {
          // Some touches remaining, update with current touches
          updateCoordinates(touchesToCoordinates(e.touches));
        }
      };
      const handleMouseOut = (e: MouseEvent) => {
        if (!e.relatedTarget) {
          clearCoordinates();
        }
      };

      win.addEventListener("mousemove", handleMouseMove, { passive: true });
      win.document.addEventListener("mouseout", handleMouseOut, {
        passive: true,
      });
      const isTouchDevice =
        "ontouchstart" in win || navigator.maxTouchPoints > 0;
      if (isTouchDevice) {
        win.addEventListener("touchstart", handleTouchStart, { passive: true });
        win.addEventListener("touchmove", handleTouchMove, { passive: true });
        win.addEventListener("touchend", handleTouchEnd, { passive: true });
      }
      cleanupRef.current = () => {
        updateCoordinates.cancel();
        try {
          win.removeEventListener("mousemove", handleMouseMove);
          win.document.removeEventListener("mouseout", handleMouseOut);
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
        {list.map((meta) => {
          return (
            <ElementInfo
              key={getElementKey(meta.element)}
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
