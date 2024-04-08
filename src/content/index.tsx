import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";

const injectNode = (w: Window) => {
  const rootDiv = w.document.createElement("div");
  rootDiv.id = "crx-root";
  w.document.body.append(rootDiv);

  ReactDOM.createRoot(rootDiv).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
  if (w.frames.length > 0) {
    for (let i = 0; i < w.frames.length; i++) {
      const frame = w.frames[i];
      injectNode(frame)
    }
  }
}

injectNode(window);
