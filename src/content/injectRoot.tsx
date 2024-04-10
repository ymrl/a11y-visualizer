import React from "react";
import ReactDOM from "react-dom/client";
import { Root } from "./Root";

export const injectRoot = (w: Window, parent: Element) => {
  const rootDiv = w.document.createElement("div");
  rootDiv.id = "crx-root";
  parent.append(rootDiv);

  ReactDOM.createRoot(rootDiv).render(
    <React.StrictMode>
      <Root />
    </React.StrictMode>,
  );
};
