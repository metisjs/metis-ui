import React from 'react';
import { TransitionStyle } from '../interface';

export function splitStyle(style?: TransitionStyle) {
  let result: {
    className?: string;
    style?: React.CSSProperties;
  } = {};
  if (typeof style === 'string') {
    result.className = style;
  } else if (typeof style === 'object') {
    if ('className' in style || 'style' in style) {
      result = style as {
        className?: string;
        style?: React.CSSProperties;
      };
    } else {
      result.style = style;
    }
  }

  return result;
}
