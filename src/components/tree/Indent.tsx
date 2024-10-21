import * as React from 'react';
import { clsx } from '../_util/classNameUtils';

interface IndentProps {
  prefixCls: string;
  level: number;
  isStart: boolean[];
  isEnd: boolean[];
  showLine?: boolean | 'hover';
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
          'inline-block w-2',
          showLine && [
            'relative h-full opacity-35',
            'before:absolute before:bottom-0 before:start-2 before:top-0 before:border-r before:border-border before:transition-opacity before:duration-300',
            showLine === 'hover' && 'opacity-0 group-hover/tree:opacity-35',
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
