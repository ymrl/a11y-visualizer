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

export const AutoAnnounceExample = () => {
  const [time, setTime] = React.useState(new Date().toLocaleTimeString());
  const [playing, setPlaying] = React.useState(false);
  const intervalRef = React.useRef<number | null>(null);

  const update = () => {
    setTime(new Date().toLocaleTimeString());
  };
  React.useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = null;
    };
  }, []);

  return (
    <div className="mt-3 flex flex-row items-center gap-2">
      <button
        onClick={() => {
          if (playing) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }
            intervalRef.current = null;
          } else {
            intervalRef.current = window.setInterval(update, 1000);
          }
          setPlaying(!playing);
        }}
        className="bg-blue-600 text-white p-2 rounded-lg inline-block"
      >
        {playing ? "stop" : "start"}
      </button>
      <div className="text-lg font-bold">
        <span aria-live="polite" aria-atomic="true">
          {time}
        </span>
      </div>
    </div>
  );
};

export const LiveRegion = () => {
  return (
    <>
      <CategoryTitle>Live Region</CategoryTitle>
      <CategorySectionTitle>Auto Announce</CategorySectionTitle>
      <AutoAnnounceExample />
      <CategorySectionTitle>Normal Live Region</CategorySectionTitle>
      <ClockExample
        renderExample={(time) => (
          <span aria-live="polite" aria-atomic="true">
            polite {time}
          </span>
        )}
      />
      <CategorySectionTitle>
        aria-live=&dquot;assertive&dquot;!
      </CategorySectionTitle>
      <ClockExample
        renderExample={(time) => (
          <span aria-live="assertive" aria-atomic="true">
            assertive!
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
