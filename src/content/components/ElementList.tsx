// import React from "react";
import { ElementMeta } from "../types";
import { ElementInfo } from "./ElementInfo";
import root from "react-shadow";
import { Style } from "./Style";
// import { SettingsContext } from "./SettingsProvider";

export const ElementList = ({
  list,
  width,
  height,
}: {
  list: ElementMeta[];
  width: number;
  height: number;
}) => {
  return (
    <root.div>
      <Style />
      <div
        className="ElementList"
        style={{
          width,
          height,
        }}
      >
        {list.map((meta, i) => {
          return (
            meta &&
            !meta.hidden && (
              <ElementInfo
                key={i}
                x={meta.x}
                y={meta.y}
                absoluteX={meta.absoluteX}
                absoluteY={meta.absoluteY}
                width={meta.width}
                height={meta.height}
                tips={meta.tips}
                categories={meta.categories}
                rootHeight={height}
                rootWidth={width}
              />
            )
          );
        })}
      </div>
    </root.div>
  );
};
