import React, { useEffect, useRef, useState } from 'react';
import raf from '@rc-component/util/es/raf';
import type { TabOffset } from '../interface';

export type GetIndicatorSize = number | ((origin: number) => number);

interface UseIndicatorOptions {
  tabOffset?: TabOffset;
  horizontal: boolean;
  indicator?: {
    size?: GetIndicatorSize;
    align?: 'start' | 'center' | 'end';
  };
}

const useIndicator = (options: UseIndicatorOptions) => {
  const { tabOffset, horizontal, indicator = {} } = options;

  const { size, align = 'center' } = indicator;

  const [style, setStyle] = useState<React.CSSProperties>();
  const rafRef = useRef<number>(null);

  const getLength = React.useCallback(
    (origin: number) => {
      if (typeof size === 'function') {
        return size(origin);
      }
      if (typeof size === 'number') {
        return size;
      }
      return origin;
    },
    [size],
  );

  // Delay set ink style to avoid close tab blink
  function cleanRaf() {
    if (rafRef.current) raf.cancel(rafRef.current);
  }

  useEffect(() => {
    const newStyle: React.CSSProperties = {};

    if (tabOffset) {
      if (horizontal) {
        newStyle.width = getLength(tabOffset.width);
        const key = 'left';
        if (align === 'start') {
          newStyle[key] = tabOffset[key];
        }
        if (align === 'center') {
          newStyle[key] = tabOffset[key] + tabOffset.width / 2;
          newStyle.transform = 'translateX(-50%)';
        }
        if (align === 'end') {
          newStyle[key] = tabOffset[key] + tabOffset.width;
          newStyle.transform = 'translateX(-100%)';
        }
      } else {
        newStyle.height = getLength(tabOffset.height);
        if (align === 'start') {
          newStyle.top = tabOffset.top;
        }
        if (align === 'center') {
          newStyle.top = tabOffset.top + tabOffset.height / 2;
          newStyle.transform = 'translateY(-50%)';
        }
        if (align === 'end') {
          newStyle.top = tabOffset.top + tabOffset.height;
          newStyle.transform = 'translateY(-100%)';
        }
      }
    }

    cleanRaf();
    rafRef.current = raf(() => {
      setStyle(newStyle);
    });

    return cleanRaf;
  }, [tabOffset, horizontal, align, getLength]);

  return { style, align, size: style?.width ?? style?.height ?? 0 };
};

export default useIndicator;
