import { AbstractRole } from "./abstract-role";
import { AccessibleDescription } from "./accessible-description";
import { AccessibleName } from "./accessible-name";
import { AriaAttributes } from "./aria-attributes";
import { AriaState } from "./aria-state";
import { AriaValidation } from "./aria-validation";
import { ContenteditableRole } from "./contenteditable-role";
import { ControlFocus } from "./control-focus";
import { ControlName } from "./control-name";
import { Fieldset } from "./fieldset";
import { HeadingLevel } from "./heading-level";
import { HeadingName } from "./heading-name";
import { Hgroup } from "./hgroup";
import { IdReference } from "./id-reference";
import { IframeName } from "./iframe-name";
import { ImageName } from "./image-name";
import { LabelAssociatedControl } from "./label-associated-control";
import { Landmark } from "./landmark";
import { Lang } from "./lang";
import { LinkHref } from "./link-href";
import { LinkTarget } from "./link-target";
import { List } from "./list";
import { ListItem } from "./list-item";
import { NestedInteractive } from "./nested-interactive";
import { PageLang } from "./page-lang";
import { PageTitle } from "./page-title";
import { RadioGroup } from "./radio-group";
import { Role } from "./role";
import { SvgSkip } from "./svg-skip";
import { TabIndex } from "./tab-index";
import { TableHeader } from "./table-header";
import { TablePosition } from "./table-position";
import { TableSize } from "./table-size";
import { TargetSize } from "./target-size";

export const Rules = [
  HeadingLevel,
  AccessibleName,
  AriaState,
  Lang,
  ControlFocus,
  ControlName,
  ContenteditableRole,
  Fieldset,
  Hgroup,
  HeadingName,
  IdReference,
  IframeName,
  ImageName,
  LabelAssociatedControl,
  Landmark,
  LinkHref,
  LinkTarget,
  List,
  NestedInteractive,
  PageTitle,
  PageLang,
  RadioGroup,
  SvgSkip,
  TableHeader,
  TablePosition,
  TableSize,
  TargetSize,
  Role,
  ListItem,
  AriaValidation,
  AccessibleDescription,
  AbstractRole,
  AriaAttributes,
  TabIndex,
] as const;
