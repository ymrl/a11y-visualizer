import React from "react";
import ReactDOM from "react-dom/client";
import { TestPage } from "./TestPage";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TestPage />
  </React.StrictMode>,
);
