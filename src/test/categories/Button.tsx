import React from "react";
import buttonImg from "../assets/button.png";
import { CategoryTitle, ExampleList } from "../components";

const buttonClassNames = "bg-blue-600 text-white p-2 rounded-lg inline-block";

const B = ({
  children,
  Tag = "button",
  ...props
}: {
  Tag?: "button" | "div";
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLButtonElement | HTMLDivElement>) => (
  <Tag {...props} className={buttonClassNames}>
    {children}
  </Tag>
);

export const Button = () => (
  <>
    <CategoryTitle>Buttons</CategoryTitle>
    <ExampleList
      examples={[
        {
          title: "Button",
          body: <B>Click Me</B>,
        },
        {
          title: "Button with aria-hidden",
          body: <B aria-hidden="true">Click Me</B>,
        },
        {
          title: "div as button",
          body: (
            <B Tag="div" role="button" tabIndex={0}>
              Click Me
            </B>
          ),
        },
        {
          title: "div as button without role",
          body: (
            <B Tag="div" tabIndex={0}>
              Click Me
            </B>
          ),
        },
        {
          title: "div as button without tabIndex",
          body: (
            <B Tag="div" role="button">
              Click Me
            </B>
          ),
        },
        {
          title: 'input type="button"',
          body: (
            <input
              type="button"
              value="Click Me"
              className={buttonClassNames}
            />
          ),
        },
        {
          title: 'input type="button" without value',
          body: <input type="button" className={buttonClassNames} />,
        },
        {
          title: 'input type="submit"',
          body: (
            <input type="submit" value="Submit" className={buttonClassNames} />
          ),
        },
        {
          title: 'input type="submit" without value',
          body: <input type="submit" className={buttonClassNames} />,
        },
        {
          title: 'input type="reset"',
          body: (
            <input type="reset" value="Reset" className={buttonClassNames} />
          ),
        },
        {
          title: 'input type="reset" without value',
          body: <input type="reset" className={buttonClassNames} />,
        },
        {
          title: 'input type="image"',
          body: <input type="image" src={buttonImg} />,
        },
        {
          title: 'input type="image" with alt',
          body: <input type="image" src={buttonImg} alt="Click Me" />,
        },
      ]}
    />
  </>
);
