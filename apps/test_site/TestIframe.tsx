import { useState } from "react";
import { LiveRegion } from "./categories";
export const TestIframe = () => {
  const [iframe, setIframe] = useState(false);
  return (
    <main className="p-3">
      <h1 className="text-2xl font-bold">Hello From &lt;iframe&gt;</h1>
      <LiveRegion />
      <button
        className="mt-3 p-2 bg-blue-500 text-white rounded"
        onClick={() => setIframe(true)}
      >
        Add iframe
      </button>
      {iframe && (
        <iframe
          src="/src/test/iframe.html"
          title="iframe"
          className="mt-3 h-96 w-10/12 mx-auto border-gray-300 border-solid border-2"
          loading="lazy"
        ></iframe>
      )}
    </main>
  );
};
