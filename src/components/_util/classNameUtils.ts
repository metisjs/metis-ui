import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';

export type SemanticClassName<T extends string> =
  | string
  | ({
      [P in T]?: string;
    } & { root?: string });

export function clsx(...args: classNames.ArgumentArray) {
  return twMerge(classNames(...args));
}

export function getSemanticCls(semanticClassName?: string): { root?: string };
export function getSemanticCls<T extends string>(
  semanticClassName?: SemanticClassName<T>,
): {
  [P in T]?: string;
};
export function getSemanticCls(semanticClassName: any = ''): any {
  if (typeof semanticClassName === 'string') {
    return { root: semanticClassName };
  }

  return semanticClassName;
}
