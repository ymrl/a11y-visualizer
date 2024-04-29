import React from "react";
import { CategoryTitle } from "../components";

export const LiveRegion = () => {
  const [date, setDate] = React.useState(new Date());
  return (
    <>
      <CategoryTitle>Live Region</CategoryTitle>
      <div className="mt-3 flex flex-row items-center gap-2">
        <button
          onClick={() => setDate(new Date())}
          className="bg-blue-600 text-white p-2 rounded-lg inline-block"
        >
          What time is it?
        </button>
        <span
          className="text-lg font-bold"
          aria-live="polite"
          aria-atomic="true"
        >
          {date.toLocaleTimeString()}
        </span>
      </div>
    </>
  );
};
