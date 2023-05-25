import type { ReactNode } from 'react';
import { isValidElement } from '../_util/reactNode';
import type { InputProps } from './Input';

export function hasPrefixSuffix(props: InputProps) {
  return !!(props.prefix || props.suffix || props.allowClear);
}

export function isMetaIcon(node: ReactNode) {
  return isValidElement(node) ? node.type === 'svg' : false;
}
