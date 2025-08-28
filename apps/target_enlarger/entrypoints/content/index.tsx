import React from "react";
import ReactDOM from "react-dom/client";
import { TargetEnlarger } from "./TargetEnlarger";

declare const defineContentScript: (config: {
  matches: string[];
  runAt: string;
  main: () => void | (() => void);
}) => unknown;

function TargetEnlargerContentScript() {
  const rootElement = document.createElement("div");
  rootElement.id = "target-enlarger-root";
  rootElement.style.position = "absolute";
  rootElement.style.top = "0";
  rootElement.style.left = "0";
  rootElement.style.width = "0";
  rootElement.style.height = "0";
  rootElement.style.pointerEvents = "none";
  rootElement.style.zIndex = "999999";
  rootElement.setAttribute("data-target-enlarger-extension", "");

  document.body.appendChild(rootElement);

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <TargetEnlarger />
    </React.StrictMode>,
  );

  // Cleanup function
  return () => {
    root.unmount();
    if (rootElement.parentNode) {
      rootElement.parentNode.removeChild(rootElement);
    }
  };
}

export default defineContentScript({
  matches: ["http://*/*", "https://*/*"],
  runAt: "document_end",
  main: TargetEnlargerContentScript,
});
