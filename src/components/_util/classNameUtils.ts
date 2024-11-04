/* eslint-disable @typescript-eslint/ban-types */
import classNames from 'classnames';
import { cloneDeep, mergeWith } from 'lodash';
import { extendTailwindMerge, fromTheme } from 'tailwind-merge';

const twMerge = extendTailwindMerge<'translate-z'>({
  extend: {
    theme: {
      opacity: ['disabled'],
    },
    classGroups: {
      'translate-z': [{ 'translate-z': [fromTheme('translate')] }],
    },
  },
});

export type SemanticClassName<
  T extends Record<string, any> | void = {},
  A extends Record<string, any> = {},
> =
  | string
  | (Partial<T> & { root?: string })
  | ((args: A) => string)
  | ((args: A) => T & { root?: string });

export function clsx(...args: classNames.ArgumentArray) {
  return twMerge(classNames(...args));
}

export type SemanticRecord<T extends SemanticClassName<any, any> | undefined> = T extends
  | string
  | undefined
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

export function getSemanticCls<T extends SemanticClassName<any, any>>(
  semanticClassNames?: T | T[],
  args?: T extends (args: any) => any ? Parameters<T>[0] : void,
): SemanticRecord<T>;
export function getSemanticCls(semanticClassName: any = {}, args: any = {}): any {
  if (typeof semanticClassName === 'string') {
    return { root: semanticClassName };
  }

  if (typeof semanticClassName === 'function') {
    return getSemanticCls(semanticClassName(args));
  }

  if (Array.isArray(semanticClassName)) {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return getSemanticCls(mergeSemanticCls(...semanticClassName), args);
  }

  return semanticClassName;
}

export function mergeSemanticCls<
  T extends SemanticClassName<any, any> | undefined,
  R extends SemanticClassName<any, any> | undefined,
>(c1: T, ...classes: (R | undefined)[]) {
  return (
    args: (T extends (...args: any) => any ? Parameters<T>[0] : {}) &
      (R extends (...args: any) => any ? Parameters<R>[0] : {}),
  ): SemanticRecord<T> & SemanticRecord<R> => {
    const cls1 = getSemanticCls(c1, args);

    if (!classes || !classes.length) return cls1;

    return classes.reduce((prev, curr) => {
      if (!curr) return prev;

      const currCls = cloneDeep(getSemanticCls(curr, args));

      return mergeWith(prev, currCls, (objValue, srcValue) => {
        if (typeof objValue === 'string' && typeof srcValue === 'string') {
          return clsx(objValue, srcValue);
        }

        if (typeof objValue === 'function' || typeof srcValue === 'function') {
          type ObjType = typeof objValue;
          type SrcType = typeof srcValue;
          return (
            arg2: (ObjType extends (...args: any) => any ? Parameters<ObjType>[0] : {}) &
              (SrcType extends (...args: any) => any ? Parameters<SrcType>[0] : {}),
          ) => mergeSemanticCls(objValue, srcValue)(arg2);
        }
      });
    }, cloneDeep(cls1)) as SemanticRecord<T> & SemanticRecord<R>;
  };
}
