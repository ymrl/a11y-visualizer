export const isSmallTarget = (el: Element): boolean => {
  const rect = el.getBoundingClientRect();
  // boundingClientRectで24px以上ならfalse
  if (rect.width >= 24 && rect.height >= 24) {
    return false;
  }
  const style = window.getComputedStyle(el);
  const { display } = style;
  // inline以外の場合は、24px未満ならtrue
  if (display !== "inline" && rect.width < 24 && rect.height < 24) {
    return true;
  }

  // inlineの場合は、子要素に24px以上のものがあればfalse
  if ([...el.children].some((child) => !isSmallTarget(child))) {
    return false;
  }
  return true;
};
