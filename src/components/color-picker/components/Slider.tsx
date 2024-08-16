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
import { AggregationColor, GradientColor } from '../color';
import type { ColorPickerProps, HSBAColorType } from '../interface';
import { getGradientPercentColor, sortColors } from '../util';

export interface BaseSliderProps {
  prefixCls: string;
  colors: { percent: number; color: string }[];
  min: number;
  max: number;
  color: AggregationColor;
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
}

export interface SingleSliderProps
  extends Omit<BaseSliderProps, 'value' | 'onChange' | 'onChangeComplete' | 'type'> {
  value: number;
  onChange: (value: number) => void;
  onChangeComplete: (value: number) => void;
  type: HSBAColorType;
}

export interface GradientSliderProps
  extends Omit<
    BaseSliderProps,
    'colors' | 'onChange' | 'onChangeComplete' | 'type' | 'color' | 'value'
  > {
  colors: GradientColor;
  onDragging: (dragging: boolean) => void;
  onChange: (value?: AggregationColor, pickColor?: boolean) => void;
  onChangeComplete: GetProp<ColorPickerProps, 'onChangeComplete'>;
  activeIndex: number;
  onActive: (index: number) => void;
}

export const BaseSlider = (props: BaseSliderProps) => {
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
      const { onFocus, style, className: handleCls } = ori.props;

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
    <BaseSlider
      {...props}
      range={false}
      value={[value]}
      onChange={singleOnChange}
      onChangeComplete={singleOnChangeComplete}
    />
  );
};

export const GradientSlider = (props: GradientSliderProps) => {
  const { prefixCls, onChange, onChangeComplete, onActive, activeIndex, onDragging, colors } =
    props;

  // ============================= Colors =============================
  const colorList = React.useMemo(
    () =>
      colors.map((info) => ({
        percent: info.percent,
        color: info.color.toRgbString(),
      })),
    [colors],
  );

  const values = React.useMemo(() => colorList.map((info) => info.percent), [colorList]);

  // ============================== Drag ==============================
  const colorsRef = React.useRef(colorList);

  // Record current colors
  const onDragStart: GetContextProp<typeof UnstableContext, 'onDragStart'> = ({
    rawValues,
    draggingIndex,
    draggingValue = 0,
  }) => {
    if (rawValues.length > colorList.length) {
      // Add new node
      const newPointColor = getGradientPercentColor(colorList, draggingValue);
      const nextColors = [...colorList];
      nextColors.splice(draggingIndex, 0, {
        percent: draggingValue,
        color: newPointColor,
      });

      colorsRef.current = nextColors;
    } else {
      colorsRef.current = colorList;
    }

    onDragging(true);
    onChange(new AggregationColor(sortColors(colorsRef.current)), true);
  };

  // Adjust color when dragging
  const onDragChange: GetContextProp<typeof UnstableContext, 'onDragChange'> = ({
    draggingIndex,
    draggingValue = 0,
  }) => {
    let nextColors = [...colorsRef.current];

    nextColors[draggingIndex] = {
      ...nextColors[draggingIndex],
      percent: draggingValue,
    };

    nextColors = sortColors(nextColors);

    onChange(new AggregationColor(nextColors), true);
  };

  // ============================= Change =============================
  const onInternalChangeComplete = (nextValues: number[]) => {
    onChangeComplete(new AggregationColor(colorList));

    // Reset `activeIndex` if out of range
    if (activeIndex >= nextValues.length) {
      onActive(nextValues.length - 1);
    }

    onDragging(false);
  };

  // ============================= Render =============================
  return (
    <BaseSlider
      min={0}
      max={100}
      prefixCls={prefixCls}
      className={`${prefixCls}-gradient-slider`}
      colors={colorList}
      color={null!}
      value={values}
      range
      onChangeComplete={onInternalChangeComplete}
      type="gradient"
      // Active
      activeIndex={activeIndex}
      onActive={onActive}
      // Drag
      onDragStart={onDragStart}
      onDragChange={onDragChange}
    />
  );
};

export default SingleSlider;
