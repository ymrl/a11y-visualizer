import root from "react-shadow";
import type { ElementMeta } from "../types";
import { ElementInfo } from "./ElementInfo";
import { Style } from "./Style";

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
            />
          );
        })}
      </div>
    </root.div>
  );
};
