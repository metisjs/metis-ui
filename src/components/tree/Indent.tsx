import * as React from 'react';
import { clsx } from '../_util/classNameUtils';

interface IndentProps {
  prefixCls: string;
  level: number;
  isStart: boolean[];
  isEnd: boolean[];
}

const Indent: React.FC<IndentProps> = ({ prefixCls, level, isStart, isEnd }) => {
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
        )}
      />,
    );
  }

  return (
    <span
      aria-hidden="true"
      className={clsx(`${prefixCls}-indent`, 'select-none whitespace-nowrap')}
    >
      {list}
    </span>
  );
};

export default React.memo(Indent);
