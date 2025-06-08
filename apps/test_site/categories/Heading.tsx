import { CategoryTitle } from "../components";
export const Heading = () => (
  <>
    <CategoryTitle>Headings</CategoryTitle>
    <blockquote className="flex flex-col gap-6 mt-3 p-3 border-solid border-gray-300 border-2">
      <h1 className="text-5xl">Heading 1</h1>
      <h2 className="text-3xl font-bold">Heading 2</h2>
      <h3 className="text-2xl font-bold">Heading 3</h3>
      <h4 className="text-xl font-bold">Heading 4</h4>
      <h5 className="text-lg font-bold">Heading 5</h5>
      <h6 className="text-lg">Heading 6</h6>
      <div className="text-base font-bold" aria-level={7} role="heading">
        role=&dquot;heading&dquot; aria-level=&dquot;7&dquot;
      </div>
    </blockquote>
  </>
);
