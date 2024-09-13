import React from 'react';
import { StarSolid } from '@metisjs/icons';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import KeyCode from 'rc-util/lib/KeyCode';
import pickAttrs from 'rc-util/lib/pickAttrs';
import { clsx, getSemanticCls, type SemanticClassName } from '../_util/classNameUtils';
import { ConfigContext } from '../config-provider';
import DisabledContext from '../config-provider/DisabledContext';
import type { StarProps } from './Star';
import Star from './Star';
import useRefs from './useRefs';
import { getOffsetLeft } from './util';

export interface RateProps
  extends Pick<StarProps, 'count' | 'character' | 'characterRender' | 'allowHalf' | 'disabled'> {
  value?: number;
  defaultValue?: number;
  allowClear?: boolean;
  style?: React.CSSProperties;
  prefixCls?: string;
  onChange?: (value: number) => void;
  onHoverChange?: (value?: number) => void;
  className?: SemanticClassName<'star'>;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLUListElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLUListElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLUListElement>;
  id?: string;
  autoFocus?: boolean;
  /**
   * Is keyboard control enabled.
   * @default true
   */
  keyboard?: boolean;
  tooltips?: Array<string>;
}

export interface RateRef {
  focus: VoidFunction;
  blur: VoidFunction;
}

const Rate = React.forwardRef<RateRef, RateProps>((props, ref) => {
  const {
    // Base
    prefixCls: customizePrefixCls,
    className,

    // Value
    defaultValue,
    value: propValue,
    count = 5,
    allowHalf = false,
    allowClear = true,
    keyboard = true,

    // Display
    character = <StarSolid />,
    characterRender,

    // Meta
    disabled: customizeDisabled,
    autoFocus,
    tooltips,

    // Events
    onHoverChange,
    onChange,
    onFocus,
    onBlur,
    onKeyDown,
    onMouseLeave,

    ...restProps
  } = props;

  const { getPrefixCls } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('rate', customizePrefixCls);
  const semanticCls = getSemanticCls(className);

  const [getStarRef, setStarRef] = useRefs<HTMLElement>();
  const rateRef = React.useRef<HTMLUListElement>(null);

  // ===================== Disabled =====================
  const disabled = React.useContext(DisabledContext);
  const mergedDisabled = customizeDisabled ?? disabled;

  // ============================ Ref =============================
  const triggerFocus = () => {
    if (!mergedDisabled) {
      rateRef.current?.focus();
    }
  };

  React.useImperativeHandle(ref, () => ({
    focus: triggerFocus,
    blur: () => {
      if (!mergedDisabled) {
        rateRef.current?.blur();
      }
    },
  }));

  // =========================== Value ============================
  const [value, setValue] = useMergedState(defaultValue || 0, {
    value: propValue,
  });
  const [cleanedValue, setCleanedValue] = useMergedState<number | null>(null);

  const getStarValue = (index: number, x: number) => {
    let starValue = index + 1;
    if (allowHalf) {
      const starEle = getStarRef(index);
      const leftDis = getOffsetLeft(starEle);
      const width = starEle.clientWidth;
      if (x - leftDis < width / 2) {
        starValue -= 0.5;
      }
    }
    return starValue;
  };

  // >>>>> Change
  const changeValue = (nextValue: number) => {
    setValue(nextValue);
    onChange?.(nextValue);
  };

  // =========================== Focus ============================
  const [focused, setFocused] = React.useState(false);

  const onInternalFocus = () => {
    setFocused(true);
    onFocus?.();
  };

  const onInternalBlur = () => {
    setFocused(false);
    onBlur?.();
  };

  // =========================== Hover ============================
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);

  const onHover = (event: React.MouseEvent<HTMLDivElement>, index: number) => {
    const nextHoverValue = getStarValue(index, event.pageX);
    if (nextHoverValue !== cleanedValue) {
      setHoverValue(nextHoverValue);
      setCleanedValue(null);
    }
    onHoverChange?.(nextHoverValue);
  };

  const onMouseLeaveCallback = (event?: React.MouseEvent<HTMLUListElement>) => {
    if (!mergedDisabled) {
      setHoverValue(null);
      setCleanedValue(null);
      onHoverChange?.(undefined);
    }
    if (event) {
      onMouseLeave?.(event);
    }
  };

  // =========================== Click ============================
  const onClick = (event: React.MouseEvent | React.KeyboardEvent, index: number) => {
    const newValue = getStarValue(index, (event as React.MouseEvent).pageX);
    let isReset = false;
    if (allowClear) {
      isReset = newValue === value;
    }
    onMouseLeaveCallback();
    changeValue(isReset ? 0 : newValue);
    setCleanedValue(isReset ? newValue : null);
  };

  const onInternalKeyDown: React.KeyboardEventHandler<HTMLUListElement> = (event) => {
    const { keyCode } = event;
    const step = allowHalf ? 0.5 : 1;

    if (keyboard) {
      if (keyCode === KeyCode.RIGHT && value < count) {
        changeValue(value + step);
        event.preventDefault();
      } else if (keyCode === KeyCode.LEFT && value > 0) {
        changeValue(value - step);
        event.preventDefault();
      }
    }

    onKeyDown?.(event);
  };

  // =========================== Effect ===========================

  React.useEffect(() => {
    if (autoFocus && !mergedDisabled) {
      triggerFocus();
    }
  }, []);

  // =========================== Style ===========================
  const rootCls = clsx(
    prefixCls,
    className,
    {
      [`${prefixCls}-disabled`]: disabled,
    },
    'inline-flex gap-2 text-2xl leading-none text-yellow-400',
    semanticCls.root,
  );

  // =========================== Render ===========================
  // >>> Star
  const starNodes = new Array(count)
    .fill(0)
    .map((item, index) => (
      <Star
        ref={setStarRef(index) as any}
        index={index}
        count={count}
        disabled={mergedDisabled}
        prefixCls={`${prefixCls}-star`}
        allowHalf={allowHalf}
        value={hoverValue === null ? value : hoverValue}
        onClick={onClick}
        onHover={onHover}
        key={item || index}
        character={character}
        characterRender={characterRender}
        focused={focused}
        tooltip={tooltips?.[index]}
        className={semanticCls.star}
      />
    ));

  // >>> Node
  return (
    <ul
      className={rootCls}
      onMouseLeave={onMouseLeaveCallback}
      onFocus={disabled ? undefined : onInternalFocus}
      onBlur={disabled ? undefined : onInternalBlur}
      onKeyDown={disabled ? undefined : onInternalKeyDown}
      ref={rateRef}
      role="radiogroup"
      {...pickAttrs(restProps, { aria: true, data: true, attr: true })}
    >
      {starNodes}
    </ul>
  );
});

if (process.env.NODE_ENV !== 'production') {
  Rate.displayName = 'Rate';
}

export default Rate;
