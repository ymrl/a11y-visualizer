import React from "react";
import { ElementMeta } from "../types";
import { MetaInfo } from "./MetaInfo";
import { Settings } from "../../types";

const MetaListRenderer = (
  {
    list,
    settings,
    width,
    height,
  }: {
    list: ElementMeta[];
    settings: Settings;
    width: number;
    height: number;
  },
  ref: React.Ref<HTMLDivElement>,
) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 2147483647,
        pointerEvents: "none",
        width,
        height,
        overflow: "hidden",
      }}
      ref={ref}
    >
      {list.map((meta, i) => {
        return (
          meta &&
          !meta.hidden && (
            <MetaInfo
              key={i}
              x={meta.x}
              y={meta.y}
              width={meta.width}
              height={meta.height}
              tips={meta.tips}
              categories={meta.categories}
              settings={settings}
              rootHeight={height}
              rootWidth={width}
            />
          )
        );
      })}
    </div>
  );
};
export const MetaList = React.forwardRef(MetaListRenderer);
