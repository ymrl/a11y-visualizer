import React from "react";
import { CategorySectionTitle, CategoryTitle } from "../components";
import { AutoAnnounceExample } from "./LiveRegion";

export const Layout = () => {
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  return (
    <>
      <CategoryTitle>Layout</CategoryTitle>
      <CategorySectionTitle>&lt;dialog&gt; element</CategorySectionTitle>
      <button
        className="bg-blue-600 text-white p-2 rounded-lg inline-block"
        onClick={() => dialogRef.current?.showModal()}
      >
        Open Dialog
      </button>

      <dialog
        ref={dialogRef}
        className=" bg-white p-3 w-80 rounded-xl shadow-lg"
      >
        <h1 className="text-2xl font-bold">Hello</h1>
        <div className="mb-4">
          <AutoAnnounceExample />
        </div>
        <button
          className="bg-blue-600 text-white p-2 rounded-lg inline-block"
          onClick={() => dialogRef.current?.close()}
        >
          Close Dialog
        </button>
      </dialog>
      <CategorySectionTitle>"popover" attribute</CategorySectionTitle>
      <button
        className="bg-blue-600 text-white p-2 rounded-lg inline-block"
        {...{ popoverTarget: "layout-popover" }}
      >
        Click me
      </button>
      <div
        id="layout-popover"
        className="bg-white p-3 w-80 rounded-xl shadow-lg"
        {...{ popover: "auto" }}
      >
        <h1 className="text-2xl font-bold">Hello from popover</h1>
      </div>
      <CategorySectionTitle>&lt;iframe&gt; element</CategorySectionTitle>
      <iframe
        src="/src/test/iframe.html"
        title="iframe"
        className="mt-3 h-96 w-10/12 mx-auto border-gray-300 border-solid border-2"
        loading="lazy"
      ></iframe>
    </>
  );
};
