import React from "react";
import { CategorySectionTitle, CategoryTitle } from "../components";

const ClockExample = ({
  renderExample,
}: {
  renderExample: (time: string) => React.ReactNode;
}) => {
  const [date, setDate] = React.useState(new Date());
  return (
    <div className="mt-3 flex flex-row items-center gap-2">
      <button
        onClick={() => setDate(new Date())}
        className="bg-blue-600 text-white p-2 rounded-lg inline-block"
      >
        What time is it?
      </button>
      <div className="text-lg font-bold">
        {renderExample(date.toLocaleTimeString())}
      </div>
    </div>
  );
};

export const LiveRegion = () => {
  return (
    <>
      <CategoryTitle>Live Region</CategoryTitle>
      <CategorySectionTitle>Normal Live Region</CategorySectionTitle>
      <ClockExample
        renderExample={(time) => (
          <span aria-live="polite" aria-atomic="true">
            {time}
          </span>
        )}
      />
      <CategorySectionTitle>aria-live="assertive"!</CategorySectionTitle>
      <ClockExample
        renderExample={(time) => (
          <span aria-live="assertive" aria-atomic="true">
            {time}
          </span>
        )}
      />

      <CategorySectionTitle>Live Region Is Hidden</CategorySectionTitle>
      <ClockExample
        renderExample={(time) => (
          <span
            className="hidden"
            aria-live="polite"
            aria-atomic="true"
            aria-hidden="true"
          >
            {time}
          </span>
        )}
      />

      <CategorySectionTitle>Live Region Is aria-hidden</CategorySectionTitle>
      <ClockExample
        renderExample={(time) => (
          <span aria-live="polite" aria-atomic="true" aria-hidden="true">
            {time}
          </span>
        )}
      />
    </>
  );
};
