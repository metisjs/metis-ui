import * as React from 'react';
import { clsx } from '@util/classNameUtils';
import SliderContext from '../context';
import Mark from './Mark';

export interface MarkObj {
  className?: string;
  label?: React.ReactNode;
}

export interface InternalMarkObj extends MarkObj {
  value: number;
}

export interface MarksProps {
  prefixCls: string;
  marks?: InternalMarkObj[];
  onClick: (value: number) => void;
}

const Marks: React.FC<MarksProps> = (props) => {
  const { prefixCls, marks, onClick } = props;
  const { direction } = React.useContext(SliderContext);

  const markPrefixCls = `${prefixCls}-mark`;
  const markCls = clsx(markPrefixCls, 'absolute', {
    'left-4 top-0 h-full': direction === 'ttb' || direction === 'btt',
    'left-0 top-3 w-full': direction === 'ltr' || direction === 'rtl',
  });

  // Not render mark if empty
  if (!marks?.length) {
    return null;
  }

  return (
    <div className={markCls}>
      {marks.map<React.ReactNode>(({ value, className, label }) => (
        <Mark
          key={value}
          prefixCls={markPrefixCls}
          className={className}
          value={value}
          onClick={onClick}
        >
          {label}
        </Mark>
      ))}
    </div>
  );
};

export default Marks;
