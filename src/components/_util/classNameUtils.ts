import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';

export type ComplexClassName<T extends string> =
  | string
  | ({
      [P in T]?: string;
    } & { root?: string });

export function clsx(...args: classNames.ArgumentArray) {
  return twMerge(classNames(...args));
}

function getComplexCls(complexClassName?: string): { root?: string };
function getComplexCls<T extends string>(
  complexClassName?: ComplexClassName<T>,
): {
  [P in T]?: string;
};
function getComplexCls(complexClassName: any = ''): any {
  if (typeof complexClassName === 'string') {
    return { root: complexClassName };
  }

  return complexClassName;
}
export { getComplexCls };
