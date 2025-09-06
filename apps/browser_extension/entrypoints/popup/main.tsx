import React from "react";
import ReactDOM from "react-dom/client";
import { Popup } from "./Popup.tsx";
import "./index.css";

const root = document.getElementById("root");
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <Popup />
    </React.StrictMode>,
  );
}
