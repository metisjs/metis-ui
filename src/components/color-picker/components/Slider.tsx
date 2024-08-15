import classNames from 'classnames';
import { useEvent } from 'rc-util';
import type { FC } from 'react';
import React, { useRef } from 'react';
import { Color } from '../color';
import useColorDrag from '../hooks/useColorDrag';
import type { HSBAColorType, TransformOffset } from '../interface';
import { calcOffset, calculateColor } from '../util';
import Gradient from './Gradient';
import Handler from './Handler';
import Palette from './Palette';
import Transform from './Transform';
import {GetContextProp} from '../../_util/type'

export interface GradientColorSliderProps {
  prefixCls: string;
  colors: { percent: number; color: string }[];
  min: number;
  max: number;
  disabled: boolean;
  color: Color;
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

export const GradientColorSlider = (props: GradientColorSliderProps) => {
  const {
    prefixCls,
    colors,
    type,
    color,
    range = false,
    className,
    activeIndex,
    onActive,

    onDragStart,
    onDragChange,
    onKeyDelete,

    ...restProps
  } = props;

  const sliderProps = {
    ...restProps,
    track: false,
  };

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
        className: classNames(handleCls, {
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
      direction: 'ltr',
      handleRender,
    }),
    [],
  );

  // ============================ Render ============================
  return (
    <SliderInternalContext.Provider value={sliderContext}>
      <UnstableContext.Provider value={unstableContext}>
        <Slider
          {...sliderProps}
          className={classNames(className, `${prefixCls}-slider`)}
          tooltip={{ open: false }}
          range={{
            editable: range,
            minCount: 2,
          }}
          styles={{
            rail: {
              background: linearCss,
            },
            handle: pointColor
              ? {
                  background: pointColor,
                }
              : {},
          }}
          classNames={{
            rail: `${prefixCls}-slider-rail`,
            handle: `${prefixCls}-slider-handle`,
          }}
        />
      </UnstableContext.Provider>
    </SliderInternalContext.Provider>
  );
};

const Slider: FC<BaseSliderProps> = (props) => {
  const { prefixCls, colors, disabled, onChange, onChangeComplete, color, type } = props;

  const sliderRef = useRef();
  const transformRef = useRef();
  const colorRef = useRef(color);

  const getValue = (c: Color) => {
    return type === 'hue' ? c.getHue() : c.a * 100;
  };

  const onDragChange = useEvent((offsetValue: TransformOffset) => {
    const calcColor = calculateColor({
      offset: offsetValue,
      targetRef: transformRef,
      containerRef: sliderRef,
      color,
      type,
    });

    colorRef.current = calcColor;
    onChange(getValue(calcColor));
  });

  const [offset, dragStartHandle] = useColorDrag({
    color,
    targetRef: transformRef,
    containerRef: sliderRef,
    calculate: () => calcOffset(color, type),
    onDragChange,
    onDragChangeComplete() {
      onChangeComplete(getValue(colorRef.current));
    },
    direction: 'x',
    disabledDrag: disabled,
  });

  const handleColor = React.useMemo(() => {
    if (type === 'hue') {
      const hsb = color.toHsb();
      hsb.s = 1;
      hsb.b = 1;
      hsb.a = 1;

      const lightColor = new Color(hsb);
      return lightColor;
    }

    return color;
  }, [color, type]);

  // ========================= Gradient =========================
  const gradientList = React.useMemo(
    () => colors.map((info) => `${info.color} ${info.percent}%`),
    [colors],
  );

  // ========================== Render ==========================
  return (
    <div
      ref={sliderRef}
      className={classNames(`${prefixCls}-slider`, `${prefixCls}-slider-${type}`)}
      onMouseDown={dragStartHandle}
      onTouchStart={dragStartHandle}
    >
      <Palette prefixCls={prefixCls}>
        <Transform x={offset.x} y={offset.y} ref={transformRef}>
          <Handler size="small" color={handleColor.toHexString()} prefixCls={prefixCls} />
        </Transform>
        <Gradient colors={gradientList} type={type} prefixCls={prefixCls} />
      </Palette>
    </div>
  );
};

export default Slider;
