import React from "react";
export const ExampleList = ({
  examples,
}: {
  examples: { title: string; body: React.ReactNode }[];
}) => (
  <dl className="mt-3 flex flex-wrap gap-6">
    {examples.map(({ title, body }, i) => (
      <div className="w-60" key={i}>
        <dt className="font-bold text-sm">{title}</dt>
        <dd>{body}</dd>
      </div>
    ))}
  </dl>
);
