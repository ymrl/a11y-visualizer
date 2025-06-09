import React from "react";
import ReactDOM from "react-dom/client";
import { TestIframe } from "./TestIframe";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TestIframe />
  </React.StrictMode>,
);
