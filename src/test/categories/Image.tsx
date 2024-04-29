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
          body: <img className="w-full" src={bigsight} alt="Tokyo Big Sight" />,
        },
        {
          title: "<img> element with alt and title",
          body: (
            <img
              className="w-full"
              src={bigsight}
              alt="Tokyo Big Sight"
              title="Tokyo Big Sight"
            />
          ),
        },
        {
          title: "without alt",
          body: <img className="w-full" src={bigsight} />,
        },
        {
          title: "with title",
          body: (
            <img className="w-full" src={bigsight} title="Tokyo Big Sight" />
          ),
        },
        {
          title: "with empty alt",
          body: <img className="w-full" src={bigsight} alt="" />,
        },
        {
          title: "with empty alt and title",
          body: (
            <img
              className="w-full"
              src={bigsight}
              alt=""
              title="Tokyo Big Sight"
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
            <svg width="100" height="100" viewBox="0 0 100 100">
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
