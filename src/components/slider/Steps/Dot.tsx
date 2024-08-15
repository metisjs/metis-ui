import * as React from 'react';
import { clsx } from '../../_util/classNameUtils';
import SliderContext from '../context';
import { getDirectionStyle } from '../util';

export interface DotProps {
  prefixCls: string;
  value: number;
  style?: React.CSSProperties | ((dotValue: number) => React.CSSProperties);
  activeStyle?: React.CSSProperties | ((dotValue: number) => React.CSSProperties);
}

const Dot: React.FC<DotProps> = (props) => {
  const { prefixCls, value, style, activeStyle } = props;
  const { min, max, direction, included, includedStart, includedEnd, disabled } =
    React.useContext(SliderContext);

  const active = included && includedStart <= value && value <= includedEnd;
  const dotClassName = clsx(
    `${prefixCls}-dot`,
    { [`${prefixCls}-dot-active`]: active },
    'absolute h-1 w-1 rounded-full bg-elevated ring-2 ring-fill-quaternary',
    {
      'group-hover:ring-fill-tertiary': !disabled,
      'ring-primary': active,
      'group-hover:ring-primary-hover': active && !disabled,
    },
  );

  // ============================ Offset ============================
  let mergedStyle: React.CSSProperties = {
    ...getDirectionStyle(direction, value, min, max),
    ...(typeof style === 'function' ? style(value) : style),
  };

  if (active) {
    mergedStyle = {
      ...mergedStyle,
      ...(typeof activeStyle === 'function' ? activeStyle(value) : activeStyle),
    };
  }

  return <span className={dotClassName} style={mergedStyle} />;
};

export default Dot;
