export default function getInnerWidth(el?: HTMLDivElement | null) {
  if (!el) return 0;
  const { clientWidth } = el;
  const { paddingLeft, paddingRight } = getComputedStyle(el);
  return clientWidth - parseFloat(paddingLeft) - parseFloat(paddingRight);
}
