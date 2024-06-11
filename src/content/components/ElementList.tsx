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
      <div
        className="ElementList"
        style={{
          width,
          height,
        }}
      >
        {list.map((meta, i) => {
          return (
            <ElementInfo
              key={i}
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
