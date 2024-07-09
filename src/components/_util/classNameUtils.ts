import classNames from 'classnames';
import { mergeWith } from 'lodash';
import { twMerge } from 'tailwind-merge';

export type SemanticClassName<T extends string, R = void> = R extends void
  ? string | ({ [P in T]?: string } & { root?: string })
  : string | ({ [P in T]?: string } & R & { root?: string });

export function clsx(...args: classNames.ArgumentArray) {
  return twMerge(classNames(...args));
}

export function getSemanticCls<T extends SemanticClassName<any, any>>(
  semanticClassName?: T,
): T extends string
  ? { root?: string } & {
      [key: string]: string;
    }
  : T;
export function getSemanticCls(semanticClassName: any = {}): any {
  if (typeof semanticClassName === 'string') {
    return { root: semanticClassName };
  }

  return semanticClassName;
}

export function mergeSemanticCls<
  T extends SemanticClassName<any, any>,
  R extends SemanticClassName<any, any>,
>(c1: T, ...classes: (R | undefined)[]): T {
  const cls1 = getSemanticCls(c1);

  if (!classes || !classes.length) return cls1 as T;

  return classes.reduce((prev, curr) => {
    if (!curr) return prev;
    const currCls = getSemanticCls(curr);
    return mergeWith(prev, currCls, (objValue, srcValue) => clsx(objValue, srcValue));
  }, cls1) as T;
}
