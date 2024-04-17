import { useLang } from "../../useLang";
import { ElementTip, TipType } from "../types";
import {
  IoAccessibility,
  IoAlertCircle,
  IoBookmark,
  IoCodeSlash,
  IoDocument,
  IoPricetag,
  IoWarning,
} from "react-icons/io5";

const colors = (
  type: TipType,
): { color: string; backgroundColor: string; border: string } => {
  switch (type) {
    case "name":
      return {
        backgroundColor: "rgb(119,217,168)",
        color: "#000",
        border: "1px solid rgb(3,175,122)",
      };
    case "role":
      return {
        backgroundColor: "rgb(255,202,191)",
        color: "#000",
        border: "1px solid rgb(255,128,130)",
      };
    case "tagName":
      return {
        backgroundColor: "rgb(201,172,2)",
        color: "#000",
        border: "1px solid rgb(153,0,153)",
      };
    case "description":
      return {
        backgroundColor: "rgb(200,200,203)",
        color: "#000",
        border: "1px solid rgb(132,145,158)",
      };
    case "level":
      return {
        backgroundColor: "rgb(191,228,255)",
        color: "#000",
        border: "1px solid rgb(0,90,255)",
      };
    case "warning":
      return {
        backgroundColor: "rgb(255,241,0)",
        color: "#000",
        border: "1px solid rgb(0,0,0)",
      };
    case "error":
      return {
        backgroundColor: "rgb(255,75,0)",
        color: "#FFF",
        border: "1px solid rgb(255,75,0)",
      };
    default:
      return {
        color: "white",
        backgroundColor: "rgb(0,0,0)",
        border: "0",
      };
  }
};
const Icon = ({ type }: { type: TipType }) => {
  const { t } = useLang();
  const iconStyle: React.CSSProperties = {
    width: "1.2em",
    height: "1.2em",
    flexShrink: 0,
  };
  switch (type) {
    case "name":
      return (
        <IoAccessibility
          style={iconStyle}
          role="img"
          aria-label={t("tip.name")}
        />
      );
    case "role":
      return (
        <IoPricetag style={iconStyle} role="img" aria-label={t("tip.role")} />
      );
    case "tagName":
      return (
        <IoCodeSlash
          style={iconStyle}
          role="img"
          aria-label={t("tip.element")}
        />
      );
    case "description":
      return (
        <IoDocument
          style={iconStyle}
          role="img"
          aria-label={t("tip.description")}
        />
      );
    case "level":
      return (
        <IoBookmark
          style={iconStyle}
          role="img"
          aria-label={t("tip.heading")}
        />
      );
    case "warning":
      return (
        <IoWarning style={iconStyle} role="img" aria-label={t("tip.warning")} />
      );
    case "error":
      return (
        <IoAlertCircle
          style={iconStyle}
          role="img"
          aria-label={t("tip.error")}
        />
      );
  }
};
export const Tip = ({ tip }: { tip: ElementTip }) => {
  const { color, backgroundColor, border } = colors(tip.type);
  const { t } = useLang();
  return (
    <div
      style={{
        padding: "2px 4px",
        font: "bold 10px/1 sans-serif",
        color,
        backgroundColor,
        border,
        whiteSpace: "nowrap",
        display: "inline-flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "4px",
      }}
    >
      <Icon type={tip.type} />
      {tip.type === "level"
        ? `${t("messages.headingLevel")}${tip.content}`
        : tip.type === "warning" || tip.type === "error"
          ? t(tip.content)
          : tip.content}
    </div>
  );
};
