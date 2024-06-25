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

function getSemanticCls(complexClassName?: string): { root?: string };
function getSemanticCls<T extends string>(
  complexClassName?: SemanticClassName<T>,
): {
  [P in T]?: string;
};
function getSemanticCls(complexClassName: any = ''): any {
  if (typeof complexClassName === 'string') {
    return { root: complexClassName };
  }

  return complexClassName;
}
export { getSemanticCls };
