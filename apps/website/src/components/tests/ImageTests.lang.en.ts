export default {
  title: "Images",
  intro:
    "Images are a fundamental part of web content that must be accessible to users of assistive technologies. The following examples demonstrate various approaches to image accessibility, including both correct implementations and common mistakes.",
  sections: {
    imgElement: {
      title: "<img> element",
      desc: "The img element requires proper alternative text to be accessible.",
    },
    svgElement: {
      title: "<svg> element",
      desc: "SVG elements can be made accessible using techniques including title elements, aria-label, and role attributes.",
    },
    roleImg: {
      title: 'role="img"',
      desc: 'Elements with role="img" should have accessible names, typically provided by aria-label.',
    },
  },
  examples: {
    img: {
      withAlt: {
        title: "Image with alt text",
        desc: "Properly accessible image with descriptive alternative text. This is the correct way to make images accessible.",
      },
      withAltAndTitle: {
        title: "Image with alt and title",
        desc: "Image with both alt text and title attribute. The title attribute shows as a tooltip but doesn't improve accessibility significantly.",
      },
      missingAlt: {
        title: "Image without alt attribute",
        desc: "❌ Missing alt attribute - this is problematic! Screen readers will announce the filename or 'image' instead of meaningful content.",
      },
      titleOnly: {
        title: "Image with title but no alt",
        desc: "❌ Having only a title attribute is insufficient for accessibility. Screen readers primarily use the alt attribute, not title.",
      },
      decorativeEmptyAlt: {
        title: "Decorative image with empty alt",
        desc: "✅ Empty alt attribute for decorative images. This tells screen readers to skip the image since it doesn't convey important information.",
      },
      decorativeEmptyAltWithTitle: {
        title: "Decorative image with empty alt and title",
        desc: "Decorative image marked properly with empty alt, but unnecessarily includes a title. The title may still show tooltips to mouse users.",
      },
      ariaHidden: {
        title: "Image with aria-hidden",
        desc: "Image hidden from assistive technologies using aria-hidden. This is another way to mark decorative images, though empty alt is more common.",
      },
    },
    svg: {
      withTitle: {
        title: "SVG with title element",
        desc: "✅ SVG with a title element provides accessible names to screen readers. This is the standard way to make SVG content accessible.",
      },
      noTitle: {
        title: "SVG without title element",
        desc: "❌ SVG without title or other accessibility attributes. Screen readers may not be able to understand what this graphic represents.",
      },
      ariaHidden: {
        title: "SVG with aria-hidden",
        desc: "SVG hidden from assistive technologies. Use this for decorative graphics that don't convey important information.",
      },
      withAriaLabel: {
        title: "SVG with aria-label",
        desc: "✅ SVG with aria-label attribute. This provides an accessible name without needing a title element.",
      },
      withImgRole: {
        title: "SVG with img role",
        desc: "✅ SVG with explicit img role and aria-label. This clearly indicates the SVG is an image and provides its accessible name.",
      },
      withPresentationRole: {
        title: "SVG with presentation role",
        desc: "SVG marked as decorative using role='presentation'. This removes semantic meaning from the SVG.",
      },
      insideLink: {
        title: "SVG inside link",
        desc: "SVG used as part of a link. The link text provides context, and the SVG itself may not need additional labeling.",
      },
    },
    roleImg: {
      withAriaLabel: {
        title: 'role="img" with aria-label',
        desc: "✅ Proper use of role='img' with descriptive aria-label. This technique is useful for text-based graphics or emoji.",
      },
      withoutAriaLabel: {
        title: 'role="img" without aria-label',
        desc: "❌ Role='img' without aria-label provides no accessible name. Screen readers may read the literal text content, which could be confusing.",
      },
    },
  },
} as const;
