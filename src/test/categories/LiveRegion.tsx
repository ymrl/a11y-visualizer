import React from "react";
import { CategorySectionTitle, CategoryTitle } from "../components";

export const LiveRegion = () => {
  const [date1, setDate1] = React.useState(new Date());
  const [date2, setDate2] = React.useState(new Date());
  const [date3, setDate3] = React.useState(new Date());
  return (
    <>
      <CategoryTitle>Live Region</CategoryTitle>
      <CategorySectionTitle>Normal Live Region</CategorySectionTitle>
      <div className="mt-3 flex flex-row items-center gap-2">
        <button
          onClick={() => setDate1(new Date())}
          className="bg-blue-600 text-white p-2 rounded-lg inline-block"
        >
          What time is it?
        </button>
        <span
          className="text-lg font-bold"
          aria-live="polite"
          aria-atomic="true"
        >
          {date1.toLocaleTimeString()}
        </span>
      </div>

      <CategorySectionTitle>Live Region Is Hidden</CategorySectionTitle>
      <div className="mt-3 flex flex-row items-center gap-2">
        <button
          onClick={() => setDate2(new Date())}
          className="bg-blue-600 text-white p-2 rounded-lg inline-block"
        >
          What time is it?
        </button>
        <span
          className="text-lg font-bold hidden"
          aria-live="polite"
          aria-atomic="true"
        >
          {date2.toLocaleTimeString()}
        </span>
      </div>

      <CategorySectionTitle>Live Region Is aria-hidden</CategorySectionTitle>
      <div className="mt-3 flex flex-row items-center gap-2">
        <button
          onClick={() => setDate3(new Date())}
          className="bg-blue-600 text-white p-2 rounded-lg inline-block"
        >
          What time is it?
        </button>
        <span
          className="text-lg font-bold"
          aria-live="polite"
          aria-atomic="true"
          aria-hidden="true"
        >
          {date3.toLocaleTimeString()}
        </span>
      </div>
    </>
  );
};
