import * as React from 'react';
import { clsx } from '../../_util/classNameUtils';
import useSemanticCls from '../../_util/hooks/useSemanticCls';
import SliderContext from '../context';
import { getDirectionStyle } from '../util';

export interface MarkProps {
  prefixCls: string;
  children?: React.ReactNode;
  className?: string;
  value: number;
  onClick: (value: number) => void;
}

const Mark: React.FC<MarkProps> = (props) => {
  const { prefixCls, className, children, value, onClick } = props;
  const {
    min,
    max,
    direction,
    includedStart,
    includedEnd,
    included,
    disabled,
    semanticCls: rootSemanticCls,
  } = React.useContext(SliderContext);

  const active = included && includedStart <= value && value <= includedEnd;

  const semanticCls = useSemanticCls(rootSemanticCls.mark, { active });

  const textCls = clsx(
    `${prefixCls}-text`,
    {
      [`${prefixCls}-text-active`]: active,
    },
    'absolute inline-block cursor-pointer select-none break-keep text-center text-text-tertiary',
    active && 'text-text',
    disabled && 'cursor-not-allowed',
    semanticCls.root,
    semanticCls.label,
    className,
  );

  // ============================ Offset ============================
  const positionStyle = getDirectionStyle(direction, value, min, max);

  return (
    <span
      className={textCls}
      style={positionStyle}
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
      onClick={() => {
        onClick(value);
      }}
    >
      {children}
    </span>
  );
};

export default Mark;
