import React from "react";
import ReactDOM from "react-dom/client";
import { OptionsPage } from "./OptionsPage";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <OptionsPage />
  </React.StrictMode>,
);
