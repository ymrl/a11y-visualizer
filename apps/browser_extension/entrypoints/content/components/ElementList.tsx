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

    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = e.pageX;
      const mouseY = e.pageY;

      // Find all elements the mouse is over
      const newHoveredIndices: number[] = [];

      for (let i = 0; i < list.length; i++) {
        const {
          absoluteX,
          absoluteY,
          width: elWidth,
          height: elHeight,
        } = list[i];

        if (
          mouseX >= absoluteX - ELEMENT_SIZE_ENHANCEMENT &&
          mouseX <= absoluteX + elWidth + ELEMENT_SIZE_ENHANCEMENT &&
          mouseY >= absoluteY - ELEMENT_SIZE_ENHANCEMENT &&
          mouseY <= absoluteY + elHeight + ELEMENT_SIZE_ENHANCEMENT
        ) {
          newHoveredIndices.push(i);
        }
      }

      setHoveredElementIndices(newHoveredIndices);
    };

    win.addEventListener("mousemove", handleMouseMove);
    return () => {
      win.removeEventListener("mousemove", handleMouseMove);
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
