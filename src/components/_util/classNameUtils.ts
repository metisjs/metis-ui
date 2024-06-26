import classNames from 'classnames';
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
