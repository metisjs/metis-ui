import type { FC } from 'react';
import React from 'react';
import { clsx } from '../../_util/classNameUtils';

export type ColorBlockProps = {
  color: string;
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};

const ColorBlock: FC<ColorBlockProps> = ({ color, prefixCls, className, style, onClick }) => {
  const colorBlockCls = `${prefixCls}-color-block`;
  return (
    <div
      className={clsx(colorBlockCls, 'relative rounded-md w-7 h-7', className)}
      style={style}
      onClick={onClick}
    >
      <div
        className={clsx(`${colorBlockCls}-inner`, 'w-full h-full rounded-md shadow-inner')}
        style={{
          background: color,
        }}
      />
    </div>
  );
};

export default ColorBlock;
