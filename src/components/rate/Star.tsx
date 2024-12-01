import React from 'react';
import type { SemanticClassName } from '@util/classNameUtils';
import { clsx } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
import Tooltip from '../tooltip';

export type StarSemanticClassName = SemanticClassName<
  { first?: string; second?: string },
  { active?: boolean; half?: boolean }
>;

export interface StarProps {
  value: number;
  index: number;
  prefixCls?: string;
  allowHalf?: boolean;
  disabled?: boolean;
  onHover?: (e: React.MouseEvent<HTMLElement>, index: number) => void;
  onClick?: (
    e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
    index: number,
  ) => void;
  character?: React.ReactNode | ((props: StarProps) => React.ReactNode);
  characterRender?: (origin: React.ReactElement, props: StarProps) => React.ReactNode;
  focused?: boolean;
  count?: number;
  tooltip?: string;
  className?: StarSemanticClassName;
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
  const onInternalHover: React.MouseEventHandler<HTMLElement> = (e) => {
    onHover?.(e, index);
  };

  const onInternalClick: React.MouseEventHandler<HTMLElement> = (e) => {
    onClick?.(e, index);
  };

  const onInternalKeyDown: React.KeyboardEventHandler<HTMLElement> = (e) => {
    if (e.key === 'Enter') {
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

  const semanticCls = useSemanticCls(className, { active, half });

  const rootCls = clsx(
    prefixCls,
    {
      [`${prefixCls}-focused`]: focused,
      [`${prefixCls}-half`]: half,
      [`${prefixCls}-active`]: active,
      [`${prefixCls}-full`]: full,
      [`${prefixCls}-zero`]: !full,
    },
    'relative inline-flex cursor-pointer outline-none outline-offset-0 transition-all duration-200 hover:scale-110 focus-visible:scale-110 focus-visible:outline-dashed focus-visible:outline-1 focus-visible:outline-yellow-400',
    disabled && 'cursor-default',
    semanticCls.root,
  );
  const firstCls = clsx(
    `${prefixCls}-first`,
    'absolute left-0 top-0 inline-flex w-1/2 select-none overflow-hidden opacity-0 transition-all duration-200',
    {
      'opacity-100': half,
    },
    semanticCls.first,
  );
  const secondCls = clsx(
    `${prefixCls}-second`,
    'inline-flex select-none text-fill-tertiary transition-all duration-200',
    {
      'text-inherit': full,
    },
    semanticCls.second,
  );

  // =========================== Render ===========================
  // >>>>> ClassName

  // >>>>> Node
  const characterNode = typeof character === 'function' ? character(props) : character;
  let start: React.ReactNode = (
    <li
      className={rootCls}
      ref={ref}
      onClick={disabled ? undefined : onInternalClick}
      onKeyDown={disabled ? undefined : onInternalKeyDown}
      onMouseMove={disabled ? undefined : onInternalHover}
      role="radio"
      aria-checked={value > index ? 'true' : 'false'}
      aria-posinset={index + 1}
      aria-setsize={count}
      tabIndex={disabled ? -1 : 0}
    >
      <div className={firstCls}>
        <span className="inline-flex">{characterNode}</span>
      </div>
      <div className={secondCls}>
        <span className="inline-flex">{characterNode}</span>
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
