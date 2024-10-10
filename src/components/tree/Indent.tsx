import * as React from 'react';
import { clsx } from '../_util/classNameUtils';

interface IndentProps {
  prefixCls: string;
  level: number;
  isStart: boolean[];
  isEnd: boolean[];
  showLine?: boolean;
}

const Indent: React.FC<IndentProps> = ({ prefixCls, level, isStart, isEnd, showLine }) => {
  const baseClassName = `${prefixCls}-indent-unit`;
  const list: React.ReactElement[] = [];
  for (let i = 0; i < level; i += 1) {
    list.push(
      <span
        key={i}
        className={clsx(
          baseClassName,
          {
            [`${baseClassName}-start`]: isStart[i],
            [`${baseClassName}-end`]: isEnd[i],
          },
          'inline-block w-5',
          showLine && [
            'relative h-full',
            'before:absolute before:-bottom-2 before:-top-2 before:start-2 before:border-r before:border-border',
            isEnd[i] && 'before:hidden',
          ],
        )}
      />,
    );
  }

  return (
    <span
      aria-hidden="true"
      className={clsx(`${prefixCls}-indent`, 'select-none self-stretch whitespace-nowrap')}
    >
      {list}
    </span>
  );
};

export default React.memo(Indent);
