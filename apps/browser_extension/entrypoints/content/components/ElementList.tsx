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
  const [hoveredElementIndex, setHoveredElementIndex] = React.useState<
    number | null
  >(null);

  React.useEffect(() => {
    if (!interactiveMode) {
      setHoveredElementIndex(null);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = e.pageX;
      const mouseY = e.pageY;

      // Find which element the mouse is over
      let newHoveredIndex: number | null = null;

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
          newHoveredIndex = i;
          break; // First match wins
        }
      }

      setHoveredElementIndex(newHoveredIndex);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
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
      >
        {list.map((meta, i) => {
          return (
            <ElementInfo
              key={`${i}-${meta.category}-${meta.name}`}
              meta={meta}
              rootHeight={height}
              rootWidth={width}
              isHovered={hoveredElementIndex === i}
            />
          );
        })}
      </div>
    </root.div>
  );
};
