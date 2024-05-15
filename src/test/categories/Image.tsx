import {
  CategoryTitle,
  CategorySectionTitle,
  ExampleList,
} from "../components";
import bigsight from "../assets/bigsight.jpg";

export const Image = () => (
  <>
    <CategoryTitle>Images</CategoryTitle>
    <CategorySectionTitle>&lt;img&gt; element</CategorySectionTitle>
    <ExampleList
      examples={[
        {
          title: "with alt",
          body: (
            <img
              className="w-full"
              src={bigsight}
              alt="Tokyo Big Sight"
              width="160"
              height="120"
            />
          ),
        },
        {
          title: "<img> element with alt and title",
          body: (
            <img
              className="w-full"
              src={bigsight}
              alt="Tokyo Big Sight"
              title="Tokyo Big Sight"
              width="160"
              height="120"
            />
          ),
        },
        {
          title: "without alt",
          body: (
            <img className="w-full" src={bigsight} width="160" height="120" />
          ),
        },
        {
          title: "with title",
          body: (
            <img
              className="w-full"
              src={bigsight}
              title="Tokyo Big Sight"
              width="160"
              height="120"
            />
          ),
        },
        {
          title: "with empty alt",
          body: (
            <img
              className="w-full"
              src={bigsight}
              alt=""
              width="160"
              height="120"
            />
          ),
        },
        {
          title: "with empty alt and title",
          body: (
            <img
              className="w-full"
              src={bigsight}
              alt=""
              title="Tokyo Big Sight"
              width="160"
              height="120"
            />
          ),
        },
        {
          title: "with aria-hidden",
          body: (
            <img
              className="w-full"
              src={bigsight}
              alt="Tokyo Big Sight"
              aria-hidden="true"
              width="160"
              height="120"
            />
          ),
        },
      ]}
    />
    <CategorySectionTitle>&lt;svg&gt; element</CategorySectionTitle>

    <ExampleList
      examples={[
        {
          title: "with title element",
          body: (
            <svg
              width="100"
              height="100"
              viewBox="0 0 100 100"
              className="intentional-violation"
            >
              <title>Blue circle</title>
              <circle cx="50" cy="50" r="40" fill="blue" />
            </svg>
          ),
        },
        {
          title: "without title element",
          body: (
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="blue" />
            </svg>
          ),
        },
        {
          title: "with aria-hidden",
          body: (
            <svg
              width="100"
              height="100"
              viewBox="0 0 100 100"
              aria-hidden="true"
            >
              <title>Blue circle</title>
              <circle cx="50" cy="50" r="40" fill="blue" />
            </svg>
          ),
        },
        {
          title: "with aria-label",
          body: (
            <svg
              width="100"
              height="100"
              viewBox="0 0 100 100"
              aria-label="Blue circle"
            >
              <circle cx="50" cy="50" r="40" fill="blue" />
            </svg>
          ),
        },
        {
          title: "with role",
          body: (
            <svg
              width="100"
              height="100"
              viewBox="0 0 100 100"
              role="img"
              aria-label="Blue circle"
            >
              <circle cx="50" cy="50" r="40" fill="blue" />
            </svg>
          ),
        },
        {
          title: "inside link",
          body: (
            <a href="https://example.com">
              <svg width="100" height="100" viewBox="0 0 100 100" id="debug">
                <circle cx="50" cy="50" r="40" fill="blue" />
              </svg>
              example
            </a>
          ),
        },
      ]}
    />
    <CategorySectionTitle>role="img"</CategorySectionTitle>
    <ExampleList
      examples={[
        {
          title: 'role="img" with aria-label',
          body: (
            <span
              role="img"
              aria-label="tableflip text art"
              className="text-lg"
            >
              (╯°□°)╯︵ ┻━┻{" "}
            </span>
          ),
        },
        {
          title: 'role="img" without aria-label',
          body: (
            <span role="img" className="text-lg">
              (╯°□°)╯︵ ┻━┻{" "}
            </span>
          ),
        },
      ]}
    />
  </>
);
