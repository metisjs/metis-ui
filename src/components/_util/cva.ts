import { cva as originCVA } from 'class-variance-authority';
import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';

export default function cva(...inputs: Parameters<typeof originCVA>) {
  return (props: Parameters<ReturnType<typeof originCVA>>[0], extra: string[] = []) =>
    twMerge(classNames(originCVA(...inputs)({ className: extra.join(' '), ...props })));
}
