import { CategoryTitle, ExampleList } from "../components";

const linkClassNames = "text-blue-600 underline cursor-pointer";

export const Link = () => (
  <>
    <CategoryTitle>Links</CategoryTitle>
    <ExampleList
      examples={[
        {
          title: "Link",
          body: (
            <a href="http://example.com" className={linkClassNames}>
              Click Me
            </a>
          ),
        },
        {
          title: "without href",
          body: <a className={linkClassNames}>Click Me</a>,
        },
        {
          title: 'role="link"',
          body: (
            <span role="link" className={linkClassNames} tabIndex={0}>
              Click Me
            </span>
          ),
        },
        {
          title: 'role="link" without tabIndex',
          body: (
            <span role="link" className={linkClassNames}>
              Click Me
            </span>
          ),
        },
      ]}
    />
  </>
);
