export const hasInteractiveDescendant = (el: Element): boolean => {
  return !!el.querySelector(
    [
      "a[href]",
      "audio[controls]",
      "button",
      "details",
      "embed",
      "iframe",
      "img[usemap]",
      'input:not([type="hidden"])',
      "label",
      "select",
      "textarea",
      "video",
    ].join(","),
  );
};
