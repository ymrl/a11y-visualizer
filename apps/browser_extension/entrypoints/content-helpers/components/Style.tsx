import ElementList from "./ElementList.css?raw";
import ElementInfo from "./ElementInfo.css?raw";
import Tip from "./Tip.css?raw";
import vars from "./vars.css?raw";
export const Style = () => (
  <style>
    {`* {
      box-sizing: border-box;
    }`}
    {vars}
    {ElementList}
    {ElementInfo}
    {Tip}
  </style>
);
