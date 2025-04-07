import * as React from 'react';
import { clsx } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
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
  const {
    min,
    max,
    direction,
    included,
    includedStart,
    includedEnd,
    disabled,
    semanticCls: rootSemanticCls,
  } = React.useContext(SliderContext);

  const active = included && includedStart <= value && value <= includedEnd;
  const semanticCls = useSemanticCls(rootSemanticCls.mark, { active });

  const dotClassName = clsx(
    `${prefixCls}-dot`,
    { [`${prefixCls}-dot-active`]: active },
    'bg-container outline-fill-quaternary absolute h-1 w-1 rounded-full outline-2 backdrop-blur-2xl',
    {
      'group-hover:outline-fill-tertiary': !disabled,
      'outline-primary': active,
      'group-hover:outline-primary-hover': active && !disabled,
    },
    semanticCls.dot,
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
