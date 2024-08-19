import type { FC } from 'react';
import React, { useContext, useRef } from 'react';
import { useEvent } from 'rc-util';
import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';
import { clsx } from '../../_util/classNameUtils';
import Segmented from '../../segmented';
import type { Color } from '../color';
import { AggregationColor } from '../color';
import { PanelPickerContext } from '../context';
import useColorDrag from '../hooks/useColorDrag';
import type { ModeOptions } from '../hooks/useMode';
import type { ModeType, TransformOffset } from '../interface';
import { calcOffset, calculateColor, genAlphaColor, generateColor, genHueColor } from '../util';
import ColorBlock from './ColorBlock';
import ColorClear from './ColorClear';
import ColorInput from './ColorInput';
import Slider, { GradientSlider } from './Slider';

const HUE_COLORS = [
  {
    color: 'rgb(255, 0, 0)',
    percent: 0,
  },
  {
    color: 'rgb(255, 255, 0)',
    percent: 17,
  },
  {
    color: 'rgb(0, 255, 0)',
    percent: 33,
  },
  {
    color: 'rgb(0, 255, 255)',
    percent: 50,
  },
  {
    color: 'rgb(0, 0, 255)',
    percent: 67,
  },
  {
    color: 'rgb(255, 0, 255)',
    percent: 83,
  },
  {
    color: 'rgb(255, 0, 0)',
    percent: 100,
  },
];

const Operation: FC<{
  prefixCls: string;
  options: ModeOptions;
  mode: ModeType;
  color: AggregationColor;
  onModeChange: (mode: ModeType) => void;
  onClear?: (color: AggregationColor) => void;
}> = ({ prefixCls, options, mode, color, onModeChange, onClear }) => {
  return (
    <div className={`${prefixCls}-operation`}>
      {!!options.length && (
        <Segmented size="small" options={options} value={mode} onChange={onModeChange} />
      )}
      <ColorClear prefixCls={prefixCls} value={color} onChange={onClear} />
    </div>
  );
};

const Palette: FC<{
  children?: React.ReactNode;
  style?: React.CSSProperties;
  prefixCls?: string;
}> = ({ children, style, prefixCls }) => {
  return (
    <div
      className={clsx(`${prefixCls}-palette`, 'min-h-40 overflow-hidden rounded')}
      style={{
        position: 'relative',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const Handler: FC<{
  color?: string;
  prefixCls?: string;
}> = ({ color, prefixCls }) => {
  return (
    <div
      className={clsx(
        `${prefixCls}-handler`,
        'w-4 h-4 rounded-full relative cursor-pointer ring-2 ring-elevated ring-inset',
      )}
      style={{
        backgroundColor: color,
      }}
    />
  );
};

const Transform = React.forwardRef<
  HTMLDivElement,
  {
    x: number;
    y: number;
    children: React.ReactNode;
  }
>((props, ref) => {
  const { children, x, y } = props;
  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        zIndex: 1,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {children}
    </div>
  );
});

const Picker: FC = () => {
  const panelPickerContext = useContext(PanelPickerContext);

  const {
    mode,
    onModeChange,
    modeOptions,
    prefixCls,
    allowClear,
    value,
    disabledAlpha,
    onChange,
    onClear,
    onChangeComplete,
    activeIndex,
    gradientDragging,
    onFormatChange,
    format,
    onGradientDragging,
    onActive,
  } = panelPickerContext;

  const pickerRef = useRef(null);
  const transformRef = useRef(null);

  // ============================ Colors ============================
  const colors = React.useMemo(() => {
    if (!value.cleared) {
      return value.getColors();
    }

    return [
      {
        percent: 0,
        color: new AggregationColor(''),
      },
      {
        percent: 100,
        color: new AggregationColor(''),
      },
    ];
  }, [value]);

  // ========================= Single Color =========================
  const isSingle = !value.isGradient();

  // We cache the point color in case user drag the gradient point across another one
  const [lockedColor, setLockedColor] = React.useState<AggregationColor>(value);

  // Use layout effect here since `useEffect` will cause a blink when mouseDown
  useLayoutEffect(() => {
    if (!isSingle) {
      setLockedColor(colors[activeIndex]?.color);
    }
  }, [gradientDragging, activeIndex]);

  const activeColor = React.useMemo(() => {
    if (isSingle) {
      return value;
    }

    // Use cache when dragging. User can not operation panel when dragging.
    if (gradientDragging) {
      return lockedColor;
    }

    return colors[activeIndex]?.color;
  }, [value, activeIndex, isSingle, lockedColor, gradientDragging]);

  // ============================ Change ============================
  const fillColor = (nextColor: AggregationColor) => {
    if (mode === 'single') {
      return nextColor;
    }

    const nextColors = [...colors];
    nextColors[activeIndex] = {
      ...nextColors[activeIndex],
      color: nextColor,
    };

    return new AggregationColor(nextColors);
  };

  const onInternalChange = (
    colorValue: AggregationColor | Color,
    fromPicker?: boolean,
    info?: {
      type?: 'hue' | 'alpha';
      value?: number;
    },
  ) => {
    const nextColor = generateColor(colorValue);

    let submitColor = nextColor;

    if (value.cleared) {
      const rgb = submitColor.toRgb();

      // Auto fill color if origin is `0/0/0` to enhance user experience
      if (!rgb.r && !rgb.g && !rgb.b && info) {
        const { type: infoType, value: infoValue = 0 } = info;

        submitColor = new AggregationColor({
          h: infoType === 'hue' ? infoValue : 0,
          s: 1,
          b: 1,
          a: infoType === 'alpha' ? infoValue / 100 : 1,
        });
      } else {
        submitColor = genAlphaColor(submitColor);
      }
    }

    onChange(fillColor(submitColor), fromPicker);
  };

  const onInternalChangeComplete = (nextColor: AggregationColor) => {
    onChangeComplete(fillColor(nextColor));
  };

  const colorRef = useRef(activeColor);
  const onDragChange = useEvent((offsetValue: TransformOffset) => {
    const calcColor = calculateColor({
      offset: offsetValue,
      targetRef: transformRef,
      containerRef: pickerRef,
      color: activeColor,
    });
    colorRef.current = calcColor;
    onInternalChange(calcColor, true);
  });

  const [offset, dragStartHandle] = useColorDrag({
    color: activeColor,
    containerRef: pickerRef,
    targetRef: transformRef,
    calculate: () => calcOffset(activeColor),
    onDragChange,
    onDragChangeComplete: () => onInternalChangeComplete(colorRef.current),
  });

  // Slider change
  const onHueChange = (hue: number) => {
    onInternalChange(genHueColor(activeColor, hue), false, { type: 'hue', value: hue });
  };

  const onAlphaChange = (alpha: number) => {
    onInternalChange(genAlphaColor(activeColor, alpha / 100), false, {
      type: 'alpha',
      value: alpha,
    });
  };

  // Complete
  const onHueChangeComplete = (hue: number) => {
    if (onChangeComplete) {
      onChangeComplete(genHueColor(activeColor, hue));
    }
  };

  const onAlphaChangeComplete = (alpha: number) => {
    if (onChangeComplete) {
      onChangeComplete(genAlphaColor(activeColor, alpha / 100));
    }
  };

  // ============================ Style ============================
  const panelCls = clsx(`${prefixCls}-panel`, 'select-none');
  const panelSelectCls = clsx(`${prefixCls}-select`, 'mb-3');
  const saturationCls = clsx(
    `${prefixCls}-saturation`,
    'absolute rounded inset-0 ring-1 ring-inset ring-fill-tertiary',
  );
  const sliderContainerCls = clsx(`${prefixCls}-slider-container`, 'flex gap-3 mb-3');
  const sliderGroupCls = clsx(
    `${prefixCls}-slider-group`,
    {
      [`${prefixCls}-slider-group-disabled-alpha`]: disabledAlpha,
    },
    'flex-1 flex flex-col justify-between',
  );

  // ============================ Render ============================

  const sharedSliderProps = {
    prefixCls,
    color: activeColor,
  };

  const hsbColor = React.useMemo(() => activeColor.toHsb(), [activeColor]);
  const alphaColor = React.useMemo(
    () => genAlphaColor(activeColor, 1).toRgbString(),
    [activeColor],
  );

  return (
    <>
      {(allowClear || modeOptions.length > 1) && (
        <Operation
          options={modeOptions}
          prefixCls={prefixCls}
          mode={mode}
          color={value}
          onModeChange={onModeChange}
          onClear={(clearColor) => {
            onChange(clearColor);
            onClear?.();
          }}
        />
      )}

      {mode === 'gradient' && (
        <GradientSlider
          prefixCls={prefixCls}
          min={0}
          max={100}
          colors={colors}
          onDragging={onGradientDragging}
          onChange={onChange}
          onChangeComplete={onChangeComplete}
          activeIndex={0}
          onActive={onActive}
        />
      )}

      <div className={panelCls}>
        <div
          ref={pickerRef}
          className={panelSelectCls}
          onMouseDown={dragStartHandle}
          onTouchStart={dragStartHandle}
        >
          <Palette prefixCls={prefixCls}>
            <Transform x={offset.x} y={offset.y} ref={transformRef}>
              <Handler color={activeColor.toRgbString()} prefixCls={prefixCls} />
            </Transform>
            <div
              className={saturationCls}
              style={{
                backgroundColor: `hsl(${activeColor.toHsb().h},100%, 50%)`,
                backgroundImage:
                  'linear-gradient(0deg, #000, transparent),linear-gradient(90deg, #fff, hsla(0, 0%, 100%, 0))',
              }}
            />
          </Palette>
        </div>
        <div className={sliderContainerCls}>
          <div className={sliderGroupCls}>
            <Slider
              {...sharedSliderProps}
              type="hue"
              colors={HUE_COLORS}
              min={0}
              max={359}
              value={hsbColor.h}
              onChange={onHueChange}
              onChangeComplete={onHueChangeComplete}
            />
            {!disabledAlpha && (
              <Slider
                {...sharedSliderProps}
                type="alpha"
                colors={[
                  { percent: 0, color: 'rgba(255, 0, 4, 0)' },
                  { percent: 100, color: alphaColor },
                ]}
                min={0}
                max={100}
                value={hsbColor.a * 100}
                onChange={onAlphaChange}
                onChangeComplete={onAlphaChangeComplete}
              />
            )}
          </div>
          <ColorBlock color={activeColor.toRgbString()} prefixCls={prefixCls} />
        </div>
      </div>
      <ColorInput
        value={activeColor}
        onChange={onInternalChange}
        prefixCls={prefixCls}
        disabledAlpha={disabledAlpha}
        onFormatChange={onFormatChange}
        format={format}
      />
    </>
  );
};

export default Picker;
