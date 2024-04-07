import React from "react";
import ReactDOM from "react-dom/client";
import { Popup } from "./Popup";

const root = document.createElement("div");
root.id = "crx-root";
document.body.append(root);

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
);
