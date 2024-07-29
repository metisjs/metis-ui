function getPxRatio() {
  if (typeof window === 'undefined') return 1;
  return window.screen.availWidth / document.documentElement.clientWidth;
}

function getScrollbarWidthFromDom() {
  const div = document.createElement('div');

  // Apply styles to the div element
  div.style.width = '100px';
  div.style.height = '100px';
  div.style.position = 'absolute';
  div.style.top = '0';
  div.style.left = '0';
  div.style.visibility = 'hidden';
  div.style.overflow = 'scroll';

  document.body.appendChild(div);
  const result = div.offsetWidth - div.clientWidth;
  document.body.removeChild(div);

  return result;
}

let scrollbarWidth: number | undefined = undefined;
let pxRatio: number = getPxRatio();

export default function getScrollbarWidth() {
  /**
   * Check zoom ratio. If it was changed, then it would update scrollbatWidth
   */
  const newPxRatio = getPxRatio();

  if (pxRatio !== newPxRatio) {
    scrollbarWidth = getScrollbarWidthFromDom();
    pxRatio = newPxRatio;
  }

  if (typeof scrollbarWidth === 'number') return scrollbarWidth;

  /* istanbul ignore else */
  if (typeof document !== 'undefined') {
    scrollbarWidth = getScrollbarWidthFromDom();
  } else {
    scrollbarWidth = 0;
  }

  return scrollbarWidth || 0;
}
