import * as React from 'react';
import { clsx } from '@util/classNameUtils';
import SliderContext from '../context';
import type { OnStartMove } from '../interface';
import { getDirectionStyle } from '../util';

interface RenderProps {
  index: number;
  prefixCls: string;
  value: number;
  dragging: boolean;
}

export interface HandleProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onFocus' | 'onMouseEnter'> {
  prefixCls: string;
  style?: React.CSSProperties;
  value: number;
  valueIndex: number | null;
  dragging: boolean;
  onStartMove: OnStartMove;
  onOffsetChange: (value: number | 'min' | 'max', valueIndex: number) => void;
  onFocus: (e: React.FocusEvent<HTMLDivElement>, index: number) => void;
  onMouseEnter: (e: React.MouseEvent<HTMLDivElement>, index: number) => void;
  render?: (
    origin: React.ReactElement<React.HTMLAttributes<HTMLDivElement>>,
    props: RenderProps,
  ) => React.ReactElement;
  onChangeComplete?: () => void;
  mock?: boolean;
}

const Handle = React.forwardRef<HTMLDivElement, HandleProps>((props, ref) => {
  const {
    prefixCls,
    value,
    valueIndex,
    onStartMove,
    style,
    render,
    dragging,
    onOffsetChange,
    onChangeComplete,
    onFocus,
    onMouseEnter,
    ...restProps
  } = props;
  const { min, max, direction, disabled, keyboard, range, semanticCls } =
    React.useContext(SliderContext);

  const handlePrefixCls = `${prefixCls}-handle`;

  // ============================ Events ============================
  const onInternalStartMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!disabled) {
      onStartMove(e, valueIndex!);
    }
  };

  const onInternalFocus = (e: React.FocusEvent<HTMLDivElement>) => {
    onFocus?.(e, valueIndex!);
  };

  const onInternalMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    onMouseEnter(e, valueIndex!);
  };

  // =========================== Keyboard ===========================
  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (!disabled && keyboard) {
      let offset: number | 'min' | 'max' | null = null;

      // Change the value
      switch (e.key) {
        case 'ArrowLeft':
          offset = direction === 'ltr' || direction === 'btt' ? -1 : 1;
          break;

        case 'ArrowRight':
          offset = direction === 'ltr' || direction === 'btt' ? 1 : -1;
          break;

        // Up is plus
        case 'ArrowUp':
          offset = direction !== 'ttb' ? 1 : -1;
          break;

        // Down is minus
        case 'ArrowDown':
          offset = direction !== 'ttb' ? -1 : 1;
          break;

        case 'Home':
          offset = 'min';
          break;

        case 'End':
          offset = 'max';
          break;

        case 'PageUp':
          offset = 2;
          break;

        case 'PageDown':
          offset = -2;
          break;
      }

      if (offset !== null) {
        e.preventDefault();
        onOffsetChange(offset, valueIndex!);
      }
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowRight':
      case 'ArrowUp':
      case 'ArrowDown':
      case 'Home':
      case 'End':
      case 'PageUp':
      case 'PageDown':
        onChangeComplete?.();
        break;
    }
  };

  // ============================ Offset ============================
  const positionStyle = getDirectionStyle(direction, value, min, max);

  // ============================ Style ============================
  const handleCls = clsx(
    handlePrefixCls,
    {
      [`${handlePrefixCls}-${valueIndex! + 1}`]: valueIndex !== null && range,
      [`${handlePrefixCls}-dragging`]: dragging,
    },
    'absolute h-2 w-2 rounded-full outline-hidden',
    'after:bg-container after:outline-primary after:absolute after:top-0 after:left-0 after:h-2 after:w-2 after:cursor-pointer after:rounded-full after:outline-2 after:backdrop-blur-2xl after:transition-[width,height,left,top]',
    !disabled &&
      'hover:after:outline-primary-hover hover:after:-top-[0.0626rem] hover:after:-left-[0.0626rem] hover:after:h-[0.625rem] hover:after:w-2.5',
    !disabled &&
      'focus:after:outline-primary-hover focus:after:-top-[0.0626rem] focus:after:-left-[0.0626rem] focus:after:h-[0.625rem] focus:after:w-2.5',
    disabled && 'after:cursor-not-allowed',
    {
      'left-[0.125rem]': direction === 'ttb' || direction === 'btt',
      'top-[0.125rem]': direction === 'ltr' || direction === 'rtl',
    },
    semanticCls.handle,
  );

  // ============================ Render ============================
  let divProps: React.HtmlHTMLAttributes<HTMLDivElement> = {};

  if (valueIndex !== null) {
    divProps = {
      tabIndex: disabled ? undefined : 0,
      role: 'slider',
      'aria-valuemin': min,
      'aria-valuemax': max,
      'aria-valuenow': value,
      'aria-disabled': disabled,
      'aria-orientation': direction === 'ltr' || direction === 'rtl' ? 'horizontal' : 'vertical',
      onMouseDown: onInternalStartMove,
      onTouchStart: onInternalStartMove,
      onFocus: onInternalFocus,
      onMouseEnter: onInternalMouseEnter,
      onKeyDown,
      onKeyUp: handleKeyUp,
    };
  }

  let handleNode = (
    <div
      ref={ref}
      className={handleCls}
      style={{
        ...positionStyle,
        ...style,
      }}
      {...divProps}
      {...restProps}
    />
  );

  // Customize
  if (render) {
    handleNode = render(handleNode, {
      index: valueIndex!,
      prefixCls,
      value,
      dragging,
    });
  }

  return handleNode;
});

export default Handle;
