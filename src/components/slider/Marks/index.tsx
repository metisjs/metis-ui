import * as React from 'react';
import { clsx } from '../../_util/classNameUtils';
import SliderContext from '../context';
import Mark from './Mark';

export interface MarkObj {
  style?: React.CSSProperties;
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
      {marks.map<React.ReactNode>(({ value, style, label }) => (
        <Mark key={value} prefixCls={markPrefixCls} style={style} value={value} onClick={onClick}>
          {label}
        </Mark>
      ))}
    </div>
  );
};

export default Marks;
