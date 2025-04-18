import React from 'react';
import { cloneElement, isFragment } from '@util/reactNode';
import type { ButtonType } from './Button';

const rxTwoCNChar = /^[\u4e00-\u9fa5]{2}$/;
export const isTwoCNChar = rxTwoCNChar.test.bind(rxTwoCNChar);

export function isString(str: any): str is string {
  return typeof str === 'string';
}

export function isUnBorderedButtonType(type?: ButtonType) {
  return type === 'text' || type === 'link';
}

function splitCNCharsBySpace(child: React.ReactElement | string | number, needInserted: boolean) {
  if (child === null || child === undefined) {
    return;
  }

  const SPACE = needInserted ? ' ' : '';

  if (
    typeof child !== 'string' &&
    typeof child !== 'number' &&
    isString(child.type) &&
    isTwoCNChar(
      (
        child as React.ReactElement<{
          children: string;
        }>
      ).props.children,
    )
  ) {
    return cloneElement(child, {
      children: (
        child as React.ReactElement<{
          children: string;
        }>
      ).props.children
        .split('')
        .join(SPACE),
    });
  }

  if (isString(child)) {
    return isTwoCNChar(child) ? <span>{child.split('').join(SPACE)}</span> : <span>{child}</span>;
  }

  if (isFragment(child)) {
    return <span>{child}</span>;
  }

  return child;
}

export function spaceChildren(children: React.ReactNode, needInserted: boolean) {
  let isPrevChildPure = false;
  const childList: React.ReactNode[] = [];

  React.Children.forEach(children, (child) => {
    const type = typeof child;
    const isCurrentChildPure = type === 'string' || type === 'number';
    if (isPrevChildPure && isCurrentChildPure) {
      const lastIndex = childList.length - 1;
      const lastChild = childList[lastIndex];
      childList[lastIndex] = `${lastChild}${child}`;
    } else {
      childList.push(child);
    }

    isPrevChildPure = isCurrentChildPure;
  });

  return React.Children.map(childList, (child) =>
    splitCNCharsBySpace(child as React.ReactElement | string | number, needInserted),
  );
}
