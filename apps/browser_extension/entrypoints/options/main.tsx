import React from "react";
import ReactDOM from "react-dom/client";
import "../popup/index.css";
import { OptionsPage } from "./OptionsPage";

const root = document.createElement("div");
root.id = "crx-root";
document.body.append(root);
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <OptionsPage />
  </React.StrictMode>,
);
