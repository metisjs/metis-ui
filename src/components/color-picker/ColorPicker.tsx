import type { CSSProperties } from 'react';
import React, { forwardRef, useMemo } from 'react';
import { clsx } from '../_util/classNameUtils';
import ColorBlock from './components/ColorBlock';
import Picker from './components/Picker';
import Slider from './components/Slider';
import useColorState from './hooks/useColorState';
import type { BaseColorPickerProps, ColorGenInput } from './interface';
import { ColorPickerPrefixCls, genAlphaColor, genHueColor } from './util';

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

export interface ColorPickerProps extends Omit<BaseColorPickerProps, 'color'> {
  value?: ColorGenInput;
  defaultValue?: ColorGenInput;
  className?: string;
  style?: CSSProperties;
  /** Get panel element  */
  panelRender?: (panel: React.ReactElement) => React.ReactElement;
  /** Disabled alpha selection */
  disabledAlpha?: boolean;
}

const ColorPicker = forwardRef<HTMLDivElement, ColorPickerProps>((props, ref) => {
  const {
    value,
    defaultValue,
    prefixCls = ColorPickerPrefixCls,
    onChange,
    onChangeComplete,
    className,
    style,
    panelRender,
    disabledAlpha = false,
    disabled = false,
  } = props;

  // ============================ Color =============================
  const [colorValue, setColorValue] = useColorState(defaultValue, value);
  const alphaColor = useMemo(() => colorValue.clone().setAlpha(1).toRgbString(), [colorValue]);

  // ============================ Events ============================
  const handleChange: BaseColorPickerProps['onChange'] = (data, type) => {
    if (!value) {
      setColorValue(data);
    }
    onChange?.(data, type);
  };

  // Slider change
  const onHueChange = (hue: number) => {
    handleChange(genHueColor(colorValue, hue), { type: 'hue', value: hue });
  };

  const onAlphaChange = (alpha: number) => {
    handleChange(genAlphaColor(colorValue, alpha / 100), { type: 'alpha', value: alpha });
  };

  // Complete
  const onHueChangeComplete = (hue: number) => {
    if (onChangeComplete) {
      onChangeComplete(genHueColor(colorValue, hue));
    }
  };

  const onAlphaChangeComplete = (alpha: number) => {
    if (onChangeComplete) {
      onChangeComplete(genAlphaColor(colorValue, alpha / 100));
    }
  };

  const hue = React.useMemo(() => colorValue.toHsv().h, [colorValue]);

  // ============================ Render ============================
  const mergeCls = clsx(`${prefixCls}-panel`, className, {
    [`${prefixCls}-panel-disabled`]: disabled,
  });

  const sharedSliderProps = {
    prefixCls,
    disabled,
    color: colorValue,
  };

  const defaultPanel = (
    <>
      <Picker onChange={handleChange} {...sharedSliderProps} onChangeComplete={onChangeComplete} />
      <div className={`${prefixCls}-slider-container`}>
        <div
          className={clsx(`${prefixCls}-slider-group`, {
            [`${prefixCls}-slider-group-disabled-alpha`]: disabledAlpha,
          })}
        >
          <Slider
            {...sharedSliderProps}
            type="hue"
            colors={HUE_COLORS}
            min={0}
            max={359}
            value={hue}
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
              value={colorValue.a * 100}
              onChange={onAlphaChange}
              onChangeComplete={onAlphaChangeComplete}
            />
          )}
        </div>
        <ColorBlock color={colorValue.toRgbString()} prefixCls={prefixCls} />
      </div>
    </>
  );

  return (
    <div className={mergeCls} style={style} ref={ref}>
      {typeof panelRender === 'function' ? panelRender(defaultPanel) : defaultPanel}
    </div>
  );
});

if (process.env.NODE_ENV !== 'production') {
  ColorPicker.displayName = 'ColorPicker';
}

export default ColorPicker;
