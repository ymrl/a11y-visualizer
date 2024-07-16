export const ImageSelectors = ["img", "svg", '[role="img"]'] as const;

export const isImage = (el: Element): boolean => {
  const tagName = el.tagName.toLowerCase();
  return (
    tagName === "img" || tagName === "svg" || el.getAttribute("role") === "img"
  );
};
