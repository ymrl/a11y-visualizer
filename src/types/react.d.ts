import "react";
declare module "react" {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // extends React's HTMLAttributes
    popover?: string;
    popoverTarget?: string;
  }
}
