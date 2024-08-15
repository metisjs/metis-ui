import { useEvent } from 'rc-util';
import React from 'react';
import { clsx } from '../../_util/classNameUtils';
import { GetContextProp, GetProp } from '../../_util/type';
import Slider from '../../slider';
import {
  SliderInternalContext,
  SliderInternalContextProps,
  UnstableContext,
} from '../../slider/context';
import Color from '../Color';
import type { HSBAColorType } from '../interface';
import { getGradientPercentColor } from '../util';

export interface SingleSliderProps {
  prefixCls: string;
  colors: { percent: number; color: string }[];
  min: number;
  max: number;
  value: number;
  disabled: boolean;
  onChange: (value: number) => void;
  onChangeComplete: (value: number) => void;
  type: HSBAColorType;
  color: Color;
}

export interface GradientSliderProps
  extends Omit<SingleSliderProps, 'value' | 'onChange' | 'onChangeComplete' | 'type'> {
  value: number[];
  onChange?: (value: number[]) => void;
  onChangeComplete: (value: number[]) => void;
  range?: boolean;
  className?: string;
  activeIndex?: number;
  onActive?: (index: number) => void;
  type: HSBAColorType | 'gradient';

  // Drag events
  onDragStart?: GetContextProp<typeof UnstableContext, 'onDragStart'>;
  onDragChange?: GetContextProp<typeof UnstableContext, 'onDragChange'>;

  // Key event
  onKeyDelete?: (index: number) => void;
}

export const GradientSlider = (props: GradientSliderProps) => {
  const {
    prefixCls,
    colors,
    type,
    color,
    range = true,
    className,
    activeIndex,
    onActive,

    onDragStart,
    onDragChange,
    onKeyDelete,

    ...restProps
  } = props;

  // ========================== Background ==========================
  const linearCss = React.useMemo(() => {
    const colorsStr = colors.map((c) => `${c.color} ${c.percent}%`).join(', ');
    return `linear-gradient(90deg, ${colorsStr})`;
  }, [colors]);

  const pointColor = React.useMemo(() => {
    if (!color || !type) {
      return null;
    }

    if (type === 'alpha') {
      return color.toRgbString();
    }

    return `hsl(${color.toHsb().h}, 100%, 50%)`;
  }, [color, type]);

  // ======================= Context: Slider ========================
  const onInternalDragStart: GetContextProp<typeof UnstableContext, 'onDragStart'> = useEvent(
    onDragStart!,
  );

  const onInternalDragChange: GetContextProp<typeof UnstableContext, 'onDragChange'> = useEvent(
    onDragChange!,
  );

  const unstableContext = React.useMemo(
    () => ({
      onDragStart: onInternalDragStart,
      onDragChange: onInternalDragChange,
    }),
    [],
  );

  // ======================= Context: Render ========================
  const handleRender: GetProp<SliderInternalContextProps, 'handleRender'> = useEvent(
    (ori, info) => {
      const { onFocus, style, className: handleCls, onKeyDown } = ori.props;

      // Point Color
      const mergedStyle = { ...style };
      if (type === 'gradient') {
        mergedStyle.background = getGradientPercentColor(colors, info.value);
      }

      return React.cloneElement(ori, {
        onFocus: (e: React.FocusEvent<HTMLDivElement>) => {
          onActive?.(info.index);
          onFocus?.(e);
        },
        style: mergedStyle,
        className: clsx(handleCls, {
          [`${prefixCls}-slider-handle-active`]: activeIndex === info.index,
        }),
        onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => {
          if ((e.key === 'Delete' || e.key === 'Backspace') && onKeyDelete) {
            onKeyDelete(info.index);
          }

          onKeyDown?.(e);
        },
      });
    },
  );

  const sliderContext: SliderInternalContextProps = React.useMemo(
    () => ({
      handleRender,
    }),
    [],
  );

  // ============================ Render ============================
  return (
    <SliderInternalContext.Provider value={sliderContext}>
      <UnstableContext.Provider value={unstableContext}>
        <Slider
          {...restProps}
          className={clsx(className, `${prefixCls}-slider`)}
          track={false}
          tooltip={{ open: false }}
          range={range as any}
          railStyle={{
            background: linearCss,
          }}
          handleStyle={
            pointColor
              ? {
                  background: pointColor,
                }
              : {}
          }
        />
      </UnstableContext.Provider>
    </SliderInternalContext.Provider>
  );
};

const SingleSlider = (props: SingleSliderProps) => {
  const { value, onChange, onChangeComplete } = props;

  const singleOnChange = (v: number[]) => onChange(v[0]);
  const singleOnChangeComplete = (v: number[]) => onChangeComplete(v[0]);

  return (
    <GradientSlider
      {...props}
      range={false}
      value={[value]}
      onChange={singleOnChange}
      onChangeComplete={singleOnChangeComplete}
    />
  );
};

export default SingleSlider;
