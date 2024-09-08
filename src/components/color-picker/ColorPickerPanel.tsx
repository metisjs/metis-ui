import type { FC } from 'react';
import React from 'react';
import { clsx } from '../_util/classNameUtils';
import Divider from '../divider';
import Picker from './components/Picker';
import Presets from './components/Presets';
import type { PanelPickerContextProps, PanelPresetsContextProps } from './context';
import { PanelPickerContext, PanelPresetsContext } from './context';
import type { ColorPickerProps } from './interface';

export interface ColorPickerPanelProps
  extends PanelPickerContextProps,
    Omit<PanelPresetsContextProps, 'onChange'> {
  onClear?: () => void;
  panelRender?: ColorPickerProps['panelRender'];
}

const ColorPickerPanel: FC<ColorPickerPanelProps> = (props) => {
  const {
    prefixCls,
    presets,
    panelRender,
    value,
    onChange,
    onClear,
    allowClear,
    disabledAlpha,
    mode,
    onModeChange,
    modeOptions,
    onChangeComplete,
    activeIndex,
    onActive,
    format,
    onFormatChange,
    gradientDragging,
    onGradientDragging,
  } = props;
  const colorPickerPanelPrefixCls = `${prefixCls}-inner`;

  // ===================== Context ======================
  const panelContext: PanelPickerContextProps = React.useMemo(
    () => ({
      prefixCls,
      value,
      onChange,
      onClear,
      allowClear,
      disabledAlpha,
      mode,
      onModeChange,
      modeOptions,
      onChangeComplete,
      activeIndex,
      onActive,
      format,
      onFormatChange,
      gradientDragging,
      onGradientDragging,
    }),
    [
      prefixCls,
      value,
      onChange,
      onClear,
      allowClear,
      disabledAlpha,
      mode,
      onModeChange,
      modeOptions,
      onChangeComplete,
      activeIndex,
      onActive,
      format,
      onFormatChange,
      gradientDragging,
      onGradientDragging,
    ],
  );

  const presetContext: PanelPresetsContextProps = React.useMemo(
    () => ({
      prefixCls,
      value,
      presets,
      onChange,
    }),
    [prefixCls, value, presets, onChange],
  );

  // ====================== Style ======================
  const contentCls = clsx(`${colorPickerPanelPrefixCls}-content`, 'flex w-60 flex-col');

  // ====================== Render ======================
  const innerPanel = (
    <div className={contentCls}>
      <Picker />
      {Array.isArray(presets) && <Divider className="mb-2 mt-3" />}
      <Presets />
    </div>
  );

  return (
    <PanelPickerContext.Provider value={panelContext}>
      <PanelPresetsContext.Provider value={presetContext}>
        <div className={colorPickerPanelPrefixCls}>
          {typeof panelRender === 'function'
            ? panelRender(innerPanel, {
                components: {
                  Picker: Picker,
                  Presets: Presets,
                },
              })
            : innerPanel}
        </div>
      </PanelPresetsContext.Provider>
    </PanelPickerContext.Provider>
  );
};

if (process.env.NODE_ENV !== 'production') {
  ColorPickerPanel.displayName = 'ColorPickerPanel';
}

export default ColorPickerPanel;
