import React from "react";
import ReactDOM from "react-dom/client";
import { Root } from "./Root";

export const injectRoot = (w: Window) => {
  const rootDiv = w.document.createElement("div");
  rootDiv.id = "crx-root";
  w.document.body.append(rootDiv);

  ReactDOM.createRoot(rootDiv).render(
    <React.StrictMode>
      <Root />
    </React.StrictMode>,
  );
};
