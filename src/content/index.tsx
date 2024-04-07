import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";

const rootDiv = document.createElement("div");
rootDiv.id = "crx-root";
document.body.append(rootDiv);

ReactDOM.createRoot(rootDiv).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
