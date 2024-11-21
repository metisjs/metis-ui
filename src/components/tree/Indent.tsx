import * as React from 'react';
import { clsx } from '../_util/classNameUtils';

interface IndentProps {
  prefixCls: string;
  className?: string;
  level: number;
  isStart: boolean[];
  isEnd: boolean[];
  showLine?: boolean | 'hover';
  width?: number;
}

const Indent: React.FC<IndentProps> = ({
  prefixCls,
  className,
  level,
  isStart,
  isEnd,
  showLine,
  width,
}) => {
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
          'inline-block',
          showLine && [
            'relative h-full opacity-35 transition-opacity',
            'before:absolute before:bottom-0 before:start-[7.5px] before:top-0 before:border-r before:border-border',
            showLine === 'hover' && 'opacity-0 group-hover/tree:opacity-35',
          ],
          className,
        )}
        style={{ width }}
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
