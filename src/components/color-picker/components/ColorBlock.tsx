import type { FC } from 'react';
import React from 'react';
import { clsx } from '@util/classNameUtils';

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
      className={clsx(
        colorBlockCls,
        'relative h-7 w-7 flex-none rounded bg-[length:50%_50%]',
        className,
      )}
      style={{
        backgroundImage:
          'conic-gradient(hsla(var(--fill-quaternary)) 0 25%, transparent 0 50%, hsla(var(--fill-quaternary)) 0 75%, transparent 0)',
        ...style,
      }}
      onClick={onClick}
    >
      <div
        className={clsx(
          `${colorBlockCls}-inner`,
          'h-full w-full rounded ring-1 ring-inset ring-fill-tertiary',
        )}
        style={{
          background: color,
        }}
      />
    </div>
  );
};

export default ColorBlock;
