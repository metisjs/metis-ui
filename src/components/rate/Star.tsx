import React from 'react';
import KeyCode from 'rc-util/lib/KeyCode';
import { clsx } from '../_util/classNameUtils';
import Tooltip from '../tooltip';

export interface StarProps {
  value: number;
  index: number;
  prefixCls?: string;
  allowHalf?: boolean;
  disabled?: boolean;
  onHover?: (e: React.MouseEvent<HTMLDivElement>, index: number) => void;
  onClick?: (
    e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>,
    index: number,
  ) => void;
  character?: React.ReactNode | ((props: StarProps) => React.ReactNode);
  characterRender?: (origin: React.ReactElement, props: StarProps) => React.ReactNode;
  focused?: boolean;
  count?: number;
  tooltip?: string;
  className?: string;
}

function Star(props: StarProps, ref: React.Ref<HTMLLIElement>) {
  const {
    disabled,
    prefixCls,
    character,
    characterRender,
    index,
    count,
    value,
    allowHalf,
    focused: originFocused,
    tooltip,
    className,
    onHover,
    onClick,
  } = props;

  // =========================== Events ===========================
  const onInternalHover: React.MouseEventHandler<HTMLDivElement> = (e) => {
    onHover?.(e, index);
  };

  const onInternalClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    onClick?.(e, index);
  };

  const onInternalKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.keyCode === KeyCode.ENTER) {
      onClick?.(e, index);
    }
  };

  // =========================== Style ===========================
  const starValue = index + 1;

  let focused = false;
  let half = false;
  let active = false;
  let full = false;

  if (value === 0 && index === 0 && originFocused) {
    focused = true;
  } else if (allowHalf && value + 0.5 >= starValue && value < starValue) {
    half = true;
    active = true;
    focused = !!originFocused;
  } else {
    full = starValue <= value;
    focused = starValue === value && !!originFocused;
  }

  const rootCls = clsx(
    prefixCls,
    {
      [`${prefixCls}-focused`]: focused,
      [`${prefixCls}-half`]: half,
      [`${prefixCls}-active`]: active,
      [`${prefixCls}-full`]: full,
      [`${prefixCls}-zero`]: !full,
    },
    'relative inline-flex cursor-pointer',
    disabled && 'cursor-default',
    className,
  );
  const innerCls = clsx(
    'relative inline-flex outline-none outline-offset-0 transition-all duration-200 hover:scale-110 focus-visible:scale-110 focus-visible:outline-dashed focus-visible:outline-1 focus-visible:outline-yellow-400',
  );
  const firstCls = clsx(
    `${prefixCls}-first`,
    'absolute left-0 top-0 inline-flex w-1/2 select-none overflow-hidden opacity-0 transition-all duration-200',
    {
      'opacity-100': half,
    },
  );
  const secondCls = clsx(
    `${prefixCls}-second`,
    'inline-flex select-none text-fill-tertiary transition-all duration-200',
    {
      'text-inherit': full,
    },
  );

  // =========================== Render ===========================
  // >>>>> ClassName

  // >>>>> Node
  const characterNode = typeof character === 'function' ? character(props) : character;
  let start: React.ReactNode = (
    <li className={rootCls} ref={ref}>
      <div
        onClick={disabled ? undefined : onInternalClick}
        onKeyDown={disabled ? undefined : onInternalKeyDown}
        onMouseMove={disabled ? undefined : onInternalHover}
        role="radio"
        aria-checked={value > index ? 'true' : 'false'}
        aria-posinset={index + 1}
        aria-setsize={count}
        tabIndex={disabled ? -1 : 0}
        className={innerCls}
      >
        <div className={firstCls}>
          <span className="inline-flex">{characterNode}</span>
        </div>
        <div className={secondCls}>
          <span className="inline-flex">{characterNode}</span>
        </div>
      </div>
    </li>
  );

  if (tooltip) {
    start = <Tooltip title={tooltip}>{start}</Tooltip>;
  }

  if (characterRender) {
    start = characterRender(start as React.ReactElement, props);
  }

  return start as React.ReactElement;
}

export default React.forwardRef(Star);
