import * as React from 'react';
import { ChevronLeftOutline, ChevronRightOutline } from '@metisjs/icons';
import { clsx } from '../_util/classNameUtils';
import Button from '../button';

export interface TransferOperationProps {
  prefixCls?: string;
  className?: string;
  leftArrowText?: string;
  rightArrowText?: string;
  moveToLeft?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  moveToRight?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  leftActive?: boolean;
  rightActive?: boolean;
  style?: React.CSSProperties;
  disabled?: boolean;
  oneWay?: boolean;
}

const Operation: React.FC<TransferOperationProps> = (props) => {
  const {
    prefixCls,
    disabled,
    moveToLeft,
    moveToRight,
    leftArrowText = '',
    rightArrowText = '',
    leftActive,
    rightActive,
    className,
    style,
    oneWay,
  } = props;
  return (
    <div
      className={clsx(prefixCls, 'mx-2 flex flex-col gap-2 self-center', className)}
      style={style}
    >
      <Button
        type="primary"
        size="mini"
        disabled={disabled || !rightActive}
        onClick={moveToRight}
        icon={<ChevronRightOutline />}
        className={clsx(rightArrowText && 'w-full')}
      >
        {rightArrowText}
      </Button>
      {!oneWay && (
        <Button
          type="primary"
          size="mini"
          disabled={disabled || !leftActive}
          onClick={moveToLeft}
          icon={<ChevronLeftOutline />}
          className={clsx(leftArrowText && 'w-full')}
        >
          {leftArrowText}
        </Button>
      )}
    </div>
  );
};

if (process.env.NODE_ENV !== 'production') {
  Operation.displayName = 'Operation';
}

export default Operation;
