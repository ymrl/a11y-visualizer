import { ElementMeta } from "../types";
import { ElementInfo } from "./ElementInfo";
import root from "react-shadow";
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
    <root.div>
      <Style />
      <div className="ElementList">
        {list.map((meta, i) => {
          return (
            <ElementInfo
              key={`${i}-${meta.category}-${meta.tips.map((tip) => tip.content).join("-")}`}
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
