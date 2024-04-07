import React from "react";
import { ElementMeta } from "../types";
import { MetaInfo } from "./MetaInfo";

const MetaListRenderer = (
  {
    image,
    formControl,
    link,
    heading,
    ariaHidden,
  }: {
    image: (ElementMeta | null)[];
    formControl: (ElementMeta | null)[];
    link: (ElementMeta | null)[];
    heading: (ElementMeta | null)[];
    ariaHidden: (ElementMeta | null)[];
  },
  ref: React.Ref<HTMLDivElement>,
) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 2147483647,
        pointerEvents: "none",
        width: document.body.clientWidth,
        height: document.body.clientHeight,
        overflow: "hidden",
      }}
      ref={ref}
    >
      {image.map((meta, i) => {
        return (
          meta &&
          !meta.hidden && (
            <MetaInfo
              key={i}
              x={meta.x}
              y={meta.y}
              width={meta.width}
              height={meta.height}
              tips={meta.tips}
              category="image"
            />
          )
        );
      })}
      {formControl.map((meta, i) => {
        return (
          meta &&
          !meta.hidden && (
            <MetaInfo
              key={i}
              x={meta.x}
              y={meta.y}
              width={meta.width}
              height={meta.height}
              tips={meta.tips}
              category="formControl"
            />
          )
        );
      })}
      {link.map((meta, i) => {
        return (
          meta &&
          !meta.hidden && (
            <MetaInfo
              key={i}
              x={meta.x}
              y={meta.y}
              width={meta.width}
              height={meta.height}
              tips={meta.tips}
              category="link"
            />
          )
        );
      })}
      {heading.map((meta, i) => {
        return (
          meta &&
          !meta.hidden && (
            <MetaInfo
              key={i}
              x={meta.x}
              y={meta.y}
              width={meta.width}
              height={meta.height}
              tips={meta.tips}
              category="heading"
            />
          )
        );
      })}
      {ariaHidden.map((meta, i) => {
        return (
          meta &&
          !meta.hidden && (
            <MetaInfo
              key={i}
              x={meta.x}
              y={meta.y}
              width={meta.width}
              height={meta.height}
              tips={meta.tips}
              category="ariaHidden"
            />
          )
        );
      })}
    </div>
  );
};
export const MetaList = React.forwardRef(MetaListRenderer);
