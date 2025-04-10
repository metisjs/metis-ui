import * as React from 'react';

export const { isValidElement } = React;

export function isFragment<P>(child: any): boolean {
  return child && isValidElement<P>(child) && child.type === React.Fragment;
}

type AnyObject = Record<PropertyKey, any>;

type RenderProps = AnyObject | ((originProps: AnyObject) => AnyObject | void);

export function replaceElement<P>(
  element: React.ReactNode,
  replacement: React.ReactNode,
  props?: RenderProps,
): React.ReactNode {
  if (!isValidElement<P>(element)) {
    return replacement;
  }
  return React.cloneElement<P>(
    element,
    typeof props === 'function' ? props(element.props || {}) : props,
  );
}

export function cloneElement<P>(element: React.ReactNode, props?: RenderProps): React.ReactElement {
  return replaceElement<P>(element, element, props) as React.ReactElement;
}
