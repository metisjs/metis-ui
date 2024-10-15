import classNames from 'classnames';
import { mergeWith } from 'lodash';
import { twMerge } from 'tailwind-merge';

export type SemanticClassName<
  T extends string,
  A extends Record<string, any> | void = void,
  R = void,
> = R extends void
  ?
      | string
      | ({ [P in T]?: string } & { root?: string })
      | ((args: A) => string)
      | ((args: A) => { [P in T]?: string } & { root?: string })
  :
      | string
      | ({ [P in T]?: string } & R & { root?: string })
      | ((args: A) => string)
      | ((args: A) => { [P in T]?: string } & R & { root?: string });

export function clsx(...args: classNames.ArgumentArray) {
  return twMerge(classNames(...args));
}

export function getSemanticCls<T extends SemanticClassName<any, any, any>>(
  semanticClassName?: T,
  args?: T extends (args: any) => any ? Parameters<T>[0] : void,
): T extends string
  ? { root?: string } & {
      [key: string]: string;
    }
  : T extends (...args: any) => any
    ? ReturnType<T> extends string
      ? { root?: string } & {
          [key: string]: string;
        }
      : ReturnType<T>
    : T;
export function getSemanticCls(semanticClassName: any = {}, args: any = {}): any {
  if (typeof semanticClassName === 'string') {
    return { root: semanticClassName };
  }

  if (typeof semanticClassName === 'function') {
    return getSemanticCls(semanticClassName(args));
  }

  return semanticClassName;
}

export function mergeSemanticCls<
  T extends SemanticClassName<any, any, any>,
  R extends SemanticClassName<any, any, any>,
>(c1?: T, ...classes: (R | undefined)[]) {
  return (
    args: (T extends (...args: any) => any ? Parameters<T>[0] : void) &
      (R extends (...args: any) => any ? Parameters<R>[0] : void),
  ) => {
    const cls1 = getSemanticCls(c1, args);

    if (!classes || !classes.length) return cls1;

    return classes.reduce((prev, curr) => {
      if (!curr) return prev;
      const currCls = getSemanticCls(curr, args);
      return mergeWith(prev, currCls, (objValue, srcValue) => clsx(objValue, srcValue));
    }, cls1);
  };
}
