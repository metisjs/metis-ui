import type { FC } from 'react';
import React from 'react';
import { clsx } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
import Divider from '../divider';
import Picker from './components/Picker';
import Presets from './components/Presets';
import type { PanelPickerContextProps, PanelPresetsContextProps } from './context';
import { PanelPickerContext, PanelPresetsContext } from './context';
import type { ColorPickerPanelClassName, ColorPickerProps } from './interface';

export interface ColorPickerPanelProps
  extends Omit<PanelPickerContextProps, 'className'>,
    Omit<PanelPresetsContextProps, 'onChange'> {
  className?: ColorPickerPanelClassName;
  onClear?: () => void;
  panelRender?: ColorPickerProps['panelRender'];
}

const ColorPickerPanel: FC<ColorPickerPanelProps> = (props) => {
  const {
    prefixCls,
    className,
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

  const semanticCls = useSemanticCls(className);

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
      semanticCls,
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
      semanticCls,
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

  const rootCls = clsx(`${prefixCls}-panel`, 'flex w-60 flex-col', semanticCls.root);

  // ====================== Render ======================
  const innerPanel = (
    <div className={rootCls}>
      <Picker />
      {Array.isArray(presets) && <Divider className="mb-2 mt-3" />}
      <Presets />
    </div>
  );

  return (
    <PanelPickerContext.Provider value={panelContext}>
      <PanelPresetsContext.Provider value={presetContext}>
        {typeof panelRender === 'function'
          ? panelRender(innerPanel, {
              components: {
                Picker: Picker,
                Presets: Presets,
              },
            })
          : innerPanel}
      </PanelPresetsContext.Provider>
    </PanelPickerContext.Provider>
  );
};

if (process.env.NODE_ENV !== 'production') {
  ColorPickerPanel.displayName = 'ColorPickerPanel';
}

export default ColorPickerPanel;
