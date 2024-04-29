import React from "react";
import { CategorySectionTitle, CategoryTitle } from "../components";

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
        popovertarget="layout-popover"
      >
        Click me
      </button>
      <div
        id="layout-popover"
        className="bg-white p-3 w-80 rounded-xl shadow-lg"
        popover="auto"
      >
        <h4 className="text-2xl font-bold">Hello from popover</h4>
      </div>
      <CategorySectionTitle>&lt;iframe&gt; element</CategorySectionTitle>
      <iframe
        src="/src/test/iframe.html"
        title="iframe"
        className="mt-3 h-48 w-10/12 mx-auto border-gray-300 border-solid border-2"
      ></iframe>
    </>
  );
};
