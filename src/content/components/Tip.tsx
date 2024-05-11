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

const Icon = ({ type }: { type: TipType }) => {
  const { t } = useLang();
  switch (type) {
    case "name":
      return (
        <IoAccessibility
          className="Tip__icon"
          role="img"
          aria-label={t("tip.name")}
        />
      );
    case "role":
      return (
        <IoPricetag
          className="Tip__icon"
          role="img"
          aria-label={t("tip.role")}
        />
      );
    case "tagName":
      return (
        <IoCodeSlash
          className="Tip__icon"
          role="img"
          aria-label={t("tip.element")}
        />
      );
    case "description":
      return (
        <IoDocument
          className="Tip__icon"
          role="img"
          aria-label={t("tip.description")}
        />
      );
    case "level":
      return (
        <IoBookmark
          className="Tip__icon"
          role="img"
          aria-label={t("tip.heading")}
        />
      );
    case "warning":
      return (
        <IoWarning
          className="Tip__icon"
          role="img"
          aria-label={t("tip.warning")}
        />
      );
    case "error":
      return (
        <IoAlertCircle
          className="Tip__icon"
          role="img"
          aria-label={t("tip.error")}
        />
      );
  }
};
export const Tip = ({ tip }: { tip: ElementTip }) => {
  const { t } = useLang();
  return (
    <div className={["Tip", `Tip--${tip.type}`].join(" ")}>
      <Icon type={tip.type} />
      {tip.type === "level"
        ? `${t("messages.headingLevel")}${tip.content}`
        : tip.type === "warning" || tip.type === "error"
          ? t(tip.content)
          : tip.content}
    </div>
  );
};
