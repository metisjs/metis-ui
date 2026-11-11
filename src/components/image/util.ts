export function isImageValid(src?: string) {
  return new Promise((resolve) => {
    if (src) {
      const img = document.createElement('img');
      img.onerror = () => resolve(false);
      img.onload = () => resolve(true);
      img.src = src;
    } else {
      resolve(false);
    }
  });
}

function fixPoint(key: 'x' | 'y', start: number, width: number, clientWidth: number) {
  const startAddWidth = start + width;
  const offsetStart = (width - clientWidth) / 2;

  if (width > clientWidth) {
    if (start > 0) {
      return {
        [key]: offsetStart,
      };
    }
    if (start < 0 && startAddWidth < clientWidth) {
      return {
        [key]: -offsetStart,
      };
    }
  } else if (start < 0 || startAddWidth > clientWidth) {
    return {
      [key]: start < 0 ? offsetStart : -offsetStart,
    };
  }
  return {};
}

export function getClientSize(container?: HTMLElement | null) {
  if (container) {
    return {
      width: container.clientWidth,
      height: container.clientHeight,
    };
  }

  const width = document.documentElement.clientWidth;
  const height = window.innerHeight || document.documentElement.clientHeight;
  return {
    width,
    height,
  };
}

/**
 * Resolve the image layout center in viewport coordinates, excluding the image transform.
 *
 * `offsetLeft`/`offsetTop` are relative to the offset parent, while pointer positions are
 * viewport based. The offset parent viewport position is added so both sides live in the same
 * coordinate space. Its own scale is returned as well, because an ancestor transition scales
 * the rendered size without changing the layout size.
 */
export function getImageLayoutCenter(img: HTMLImageElement) {
  const width = img.offsetWidth;
  const height = img.offsetHeight;
  const offsetParent = img.offsetParent as HTMLElement | null;

  if (!offsetParent) {
    return {
      centerX: img.offsetLeft + width / 2,
      centerY: img.offsetTop + height / 2,
      scale: 1,
    };
  }

  const parentRect = offsetParent.getBoundingClientRect();
  const scaleX = offsetParent.offsetWidth ? parentRect.width / offsetParent.offsetWidth : 1;
  const scaleY = offsetParent.offsetHeight ? parentRect.height / offsetParent.offsetHeight : 1;

  return {
    centerX: parentRect.left + offsetParent.clientLeft + (img.offsetLeft + width / 2) * scaleX,
    centerY: parentRect.top + offsetParent.clientTop + (img.offsetTop + height / 2) * scaleY,
    scale: (scaleX + scaleY) / 2 || 1,
  };
}

/**
 * Fix positon x,y point when
 *
 * Ele width && height < client
 * - Back origin
 *
 * - Ele width | height > clientWidth | clientHeight
 * - left | top > 0 -> Back 0
 * - left | top + width | height < clientWidth | clientHeight -> Back left | top + width | height === clientWidth | clientHeight
 *
 * Regardless of other
 *
 * `left`/`top` are viewport coordinates, so they are converted into the container coordinate
 * space before comparing with the container size. Without that conversion the boundary check
 * uses the viewport origin even though the image is bounded by its container.
 */
export function getFixScaleEleTransPosition(
  width: number,
  height: number,
  left: number,
  top: number,
  container?: HTMLElement | null,
): null | { x?: number; y?: number } {
  const { width: clientWidth, height: clientHeight } = getClientSize(container);

  const containerRect = container?.getBoundingClientRect();
  const localLeft = containerRect ? left - containerRect.left : left;
  const localTop = containerRect ? top - containerRect.top : top;

  let fixPos: null | { x?: number; y?: number } = null;

  if (width <= clientWidth && height <= clientHeight) {
    fixPos = {
      x: 0,
      y: 0,
    };
  } else if (width > clientWidth || height > clientHeight) {
    fixPos = {
      ...fixPoint('x', localLeft, width, clientWidth),
      ...fixPoint('y', localTop, height, clientHeight),
    };
  }

  return fixPos;
}
