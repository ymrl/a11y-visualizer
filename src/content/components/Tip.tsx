import { useLang } from "../../useLang";
import { ElementTip, TipType } from "../types";
import {
  IoAccessibility,
  IoAlertCircle,
  IoBookmark,
  IoBrowsersOutline,
  IoCodeSlash,
  IoDocument,
  IoFlag,
  IoGrid,
  IoInformationCircle,
  IoLanguage,
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
    case "landmark":
      return (
        <IoFlag
          className="Tip__icon"
          role="img"
          aria-label={t("tip.landmark")}
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
    case "ariaStatus":
      return (
        <IoInformationCircle
          className="Tip__icon"
          role="img"
          aria-label={t("tip.ariaStatus")}
        />
      );
    case "tableHeader":
      return (
        <IoGrid
          className="Tip__icon"
          role="img"
          aria-label={t("tip.tableHeader")}
        />
      );

    case "pageTitle":
      return (
        <IoBrowsersOutline
          className="Tip__icon"
          role="img"
          aria-label={t("tip.pageTitle")}
        />
      );
    case "lang":
      return (
        <IoLanguage
          className="Tip__icon"
          role="img"
          aria-label={t("tip.lang")}
        />
      );
  }
};
export const Tip = ({
  tip,
  hideLabel = false,
  maxWidth,
}: {
  tip: ElementTip;
  hideLabel: boolean;
  maxWidth: number;
}) => {
  const { t } = useLang();
  return (
    <div className={["Tip", `Tip--${tip.type}`].join(" ")} style={{ maxWidth }}>
      <Icon type={tip.type} />
      {!hideLabel &&
        (tip.type === "level"
          ? `${t("messages.headingLevel")}${tip.content}`
          : tip.type === "warning" ||
              tip.type === "error" ||
              tip.type === "ariaStatus"
            ? t(tip.content)
            : tip.content)}
    </div>
  );
};
