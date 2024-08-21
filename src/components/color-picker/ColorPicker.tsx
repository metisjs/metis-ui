import React, { useContext, useMemo } from 'react';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import { clsx, getSemanticCls } from '../_util/classNameUtils';
import ContextIsolator from '../_util/ContextIsolator';
import { getStatusClassNames } from '../_util/statusUtils';
import { devUseWarning } from '../_util/warning';
import type { ConfigConsumerProps } from '../config-provider/context';
import { ConfigContext } from '../config-provider/context';
import DisabledContext from '../config-provider/DisabledContext';
import useSize from '../config-provider/hooks/useSize';
import { FormItemInputContext } from '../form/context';
import type { PopoverProps } from '../popover';
import Popover from '../popover';
import { useCompactItemContext } from '../space/Compact';
import { AggregationColor } from './color';
import type { ColorPickerPanelProps } from './ColorPickerPanel';
import ColorPickerPanel from './ColorPickerPanel';
import ColorTrigger from './components/ColorTrigger';
import useMode from './hooks/useMode';
import type { ColorPickerProps, ModeType } from './interface';
import { genAlphaColor, generateColor, getColorAlpha } from './util';

const ColorPicker: React.FC<ColorPickerProps> = (props) => {
  const {
    mode,
    value,
    defaultValue,
    format,
    defaultFormat,
    allowClear = false,
    presets,
    children,
    trigger = 'click',
    open,
    disabled,
    placement = 'bottomLeft',
    arrow = true,
    panelRender,
    showText,
    style,
    className,
    size: customizeSize,
    prefixCls: customizePrefixCls,
    disabledAlpha = false,
    onFormatChange,
    onChange,
    onClear,
    onOpenChange,
    onChangeComplete,
    getPopupContainer,
    autoAdjustOverflow = true,
    destroyTooltipOnHide,
    ...rest
  } = props;

  const { getPrefixCls } = useContext<ConfigConsumerProps>(ConfigContext);
  const prefixCls = getPrefixCls('color-picker', customizePrefixCls);
  const semanticCls = getSemanticCls(className);

  const contextDisabled = useContext(DisabledContext);
  const mergedDisabled = disabled ?? contextDisabled;

  const [popupOpen, setPopupOpen] = useMergedState(false, {
    value: open,
    postState: (openData) => !mergedDisabled && openData,
    onChange: onOpenChange,
  });
  const [formatValue, setFormatValue] = useMergedState(format, {
    value: format,
    defaultValue: defaultFormat,
    onChange: onFormatChange,
  });

  // ================== Value & Mode =================
  const [mergedColor, setColor, modeState, setModeState, modeOptions] = useMode(
    defaultValue,
    value,
    mode,
  );

  const isAlphaColor = useMemo(() => getColorAlpha(mergedColor) < 100, [mergedColor]);

  // ==================== Change =====================
  // To enhance user experience, we cache the gradient color when switch from gradient to single
  // If user not modify single color, we will use the cached gradient color.
  const [cachedGradientColor, setCachedGradientColor] = React.useState<AggregationColor | null>(
    null,
  );

  const onInternalChangeComplete: ColorPickerProps['onChangeComplete'] = (color) => {
    if (onChangeComplete) {
      let changeColor = generateColor(color);

      // ignore alpha color
      if (disabledAlpha && isAlphaColor) {
        changeColor = genAlphaColor(color);
      }
      onChangeComplete(changeColor);
    }
  };

  const onInternalChange: ColorPickerPanelProps['onChange'] = (data, pickColor) => {
    let color: AggregationColor = generateColor(data as AggregationColor);

    // ignore alpha color
    if (disabledAlpha && isAlphaColor) {
      color = genAlphaColor(color);
    }

    setColor(color);
    setCachedGradientColor(null);

    // Trigger change event
    if (onChange) {
      onChange(color, color.toCssString());
    }

    // Only for drag-and-drop color picking
    if (!pickColor) {
      onInternalChangeComplete(color);
    }
  };

  // =================== Gradient ====================
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [gradientDragging, setGradientDragging] = React.useState(false);

  // Mode change should also trigger color change
  const onInternalModeChange = (newMode: ModeType) => {
    setModeState(newMode);

    if (newMode === 'single' && mergedColor.isGradient()) {
      setActiveIndex(0);
      onInternalChange(new AggregationColor(mergedColor.getColors()[0].color));

      // Should after `onInternalChange` since it will clear the cached color
      setCachedGradientColor(mergedColor);
    } else if (newMode === 'gradient' && !mergedColor.isGradient()) {
      const baseColor = isAlphaColor ? genAlphaColor(mergedColor) : mergedColor;

      onInternalChange(
        new AggregationColor(
          cachedGradientColor || [
            {
              percent: 0,
              color: baseColor,
            },
            {
              percent: 100,
              color: baseColor,
            },
          ],
        ),
      );
    }
  };

  // ================== Form Status ==================
  const { status: contextStatus } = React.useContext(FormItemInputContext);

  // ==================== Compact ====================
  const { compactSize, compactItemClassnames } = useCompactItemContext(prefixCls);

  // ==================== Size ====================
  const mergedSize = useSize((ctx) => customizeSize ?? compactSize ?? ctx);

  // ================== Style =================
  const triggerCls = clsx(
    {
      [`${prefixCls}-sm`]: mergedSize === 'small',
      [`${prefixCls}-lg`]: mergedSize === 'large',
    },
    getStatusClassNames(contextStatus, undefined, popupOpen),
    compactItemClassnames,
    semanticCls.root,
  );
  const triggerTextCls = clsx({
    'text-base': mergedSize === 'large',
  });
  const triggerColorBlockCls = clsx({
    'w-6 h-6': mergedSize === 'small',
    'w-8 h-8': mergedSize === 'large',
  });
  const popupCls = clsx(prefixCls, semanticCls.popup);

  // ===================== Warning ======================
  if (process.env.NODE_ENV !== 'production') {
    const warning = devUseWarning('ColorPicker');

    warning(
      !(disabledAlpha && isAlphaColor),
      'usage',
      '`disabledAlpha` will make the alpha to be 100% when use alpha color.',
    );
  }

  const popoverProps: PopoverProps = {
    open: popupOpen,
    trigger,
    placement,
    arrow,
    className: { popup: popupCls, overlay: semanticCls.overlay },
    getPopupContainer,
    autoAdjustOverflow,
    destroyTooltipOnHide,
  };

  return (
    <Popover
      onOpenChange={(visible) => {
        if (!visible || !mergedDisabled) {
          setPopupOpen(visible);
        }
      }}
      content={
        <ContextIsolator form>
          <ColorPickerPanel
            mode={modeState}
            onModeChange={onInternalModeChange}
            modeOptions={modeOptions}
            prefixCls={prefixCls}
            value={mergedColor}
            allowClear={allowClear}
            disabled={mergedDisabled}
            disabledAlpha={disabledAlpha}
            presets={presets}
            panelRender={panelRender}
            format={formatValue}
            onFormatChange={setFormatValue}
            onChange={onInternalChange}
            onChangeComplete={onInternalChangeComplete}
            onClear={onClear}
            activeIndex={activeIndex}
            onActive={setActiveIndex}
            gradientDragging={gradientDragging}
            onGradientDragging={setGradientDragging}
          />
        </ContextIsolator>
      }
      {...popoverProps}
    >
      {children || (
        <ColorTrigger
          activeIndex={popupOpen ? activeIndex : -1}
          open={popupOpen}
          className={{ root: triggerCls, text: triggerTextCls, colorBlock: triggerColorBlockCls }}
          style={style}
          prefixCls={prefixCls}
          disabled={mergedDisabled}
          showText={showText}
          format={formatValue}
          {...rest}
          color={mergedColor}
        />
      )}
    </Popover>
  );
};

if (process.env.NODE_ENV !== 'production') {
  ColorPicker.displayName = 'ColorPicker';
}

export default ColorPicker;