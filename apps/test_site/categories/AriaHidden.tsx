import { CategoryTitle } from "../components";

export const AriaHidden = () => (
  <>
    <CategoryTitle>aria-hidden</CategoryTitle>
    <div
      className="mt-3 border-x-gray-300 border-2 border-solid p-3"
      aria-hidden="true"
    >
      aria-hidden
    </div>
  </>
);
