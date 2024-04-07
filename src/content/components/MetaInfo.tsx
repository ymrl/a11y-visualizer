import { Category, ElementTip } from "../types";
import { Tip } from "./Tip";

const colors = (category: Category): { border: string } => {
  switch (category) {
    case "image":
      return {
        border: "2px dashed rgb(3,175,122)",
      };
    case "formControl":
      return {
        border: "2px dashed rgb(255,128,130)",
      };
    case "link":
      return {
        border: "2px dashed rgb(153,0,153)",
      };
    case "heading":
      return {
        border: "2px dashed rgb(0,90,255)",
      };
    case "ariaHidden":
      return {
        border: "2px dashed rgb(255,75,0)",
      };
    default:
      return {
        border: "2px dashed rgb(132,145,158)",
      };
  }
};

export const MetaInfo = ({
  x,
  y,
  width,
  height,
  tips,
  category,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  tips: ElementTip[];
  category: Category;
}) => {
  const { border } = colors(category);
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: x,
        width,
        height,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          border,
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.8), inset 0 0 0 1px rgba(255,255,255,0.8)",
        }}
      />
      <div
        style={{
          position: "absolute",
          zIndex: 1,
          left: 0,
          top:
            category === "image"
              ? 0
              : category === "formControl" || category === "link"
                ? "100%"
                : undefined,
          bottom:
            category === "heading"
              ? "100%"
              : category === "ariaHidden"
                ? 0
                : undefined,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          flexDirection: "row",
          maxWidth: "160px",
          width: "max-content",
          flexWrap: "wrap",
        }}
      >
        {tips.map((tip, i) => (
          <Tip key={i} tip={tip} />
        ))}
      </div>
    </div>
  );
};
