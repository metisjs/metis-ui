import type { CSSProperties, FC, ReactNode } from 'react';
import type { SemanticClassName } from '../_util/classNameUtils';
import type { SizeType } from '../config-provider/SizeContext';
import type { InputProps } from '../input';
import type { InputNumberProps } from '../input-number';
import type { PopoverProps } from '../popover';
import type { SegmentedProps } from '../segmented';
import type { BaseSelectProps } from '../select';
import type { SliderSingleProps } from '../slider';
import type { TooltipPlacement } from '../tooltip';
import type { AggregationColor, Color } from './color';
import type { InternalPresetsProps } from './components/Presets';

export interface HSB {
  h: number | string;
  s: number | string;
  b: number | string;
}

export interface RGB {
  r: number | string;
  g: number | string;
  b: number | string;
}

export interface HSBA extends HSB {
  a: number;
}

export interface RGBA extends RGB {
  a: number;
}

export type ColorGenInput<T = Color> = string | number | RGB | RGBA | HSB | HSBA | T;

export type HSBAColorType = 'hue' | 'alpha';

export type TransformOffset = {
  x: number;
  y: number;
};

export type Colors<T> = {
  color: ColorGenInput<T>;
  percent: number;
}[];

export enum ColorFormat {
  hex = 'hex',
  rgb = 'rgb',
  hsb = 'hsb',
}

export type ColorFormatType = keyof typeof ColorFormat;

export interface PresetsItem {
  label: ReactNode;
  colors: (string | AggregationColor)[];
  defaultOpen?: boolean;
}

export type TriggerType = 'click' | 'hover';

export type TriggerPlacement = TooltipPlacement; // Alias, to prevent breaking changes.

export type ColorValueType =
  | AggregationColor
  | string
  | null
  | {
      color: AggregationColor | string;
      percent: number;
    }[];

export type ModeType = 'single' | 'gradient';

export type ColorPickerPanelClassName = SemanticClassName<{
  mode?: SegmentedProps['className'];
  clear?: string;
  palette?: string;
  paletteHandle?: string;
  slider?: SliderSingleProps['className'];
  block?: string;
  formatSelect?: BaseSelectProps['className'];
  alphaInput?: InputNumberProps['className'];
  hexInput?: InputProps['className'];
  rgbInput?: InputNumberProps['className'];
  hsbInput?: InputNumberProps['className'];
  presets?: InternalPresetsProps['className'];
}>;

export interface ColorPickerProps
  extends Pick<PopoverProps, 'getPopupContainer' | 'autoAdjustOverflow' | 'destroyTooltipOnHide'> {
  prefixCls?: string;
  className?: SemanticClassName<
    { popup?: string; block?: string; text?: string; panel: ColorPickerPanelClassName },
    { open?: boolean; disabled?: boolean }
  >;
  style?: CSSProperties;
  mode?: ModeType | ModeType[];
  value?: ColorValueType;
  defaultValue?: ColorValueType;
  children?: React.ReactNode;
  open?: boolean;
  disabled?: boolean;
  placement?: TriggerPlacement;
  trigger?: TriggerType;
  format?: ColorFormatType;
  defaultFormat?: ColorFormatType;
  allowClear?: boolean;
  presets?: PresetsItem[];
  arrow?: boolean | { pointAtCenter: boolean };
  panelRender?: (
    panel: React.ReactNode,
    extra: { components: { Picker: FC; Presets: FC } },
  ) => React.ReactNode;
  showText?: boolean | ((color: AggregationColor) => React.ReactNode);
  size?: SizeType;
  disabledAlpha?: boolean;
  [key: `data-${string}`]: string;
  onOpenChange?: (open: boolean) => void;
  onFormatChange?: (format?: ColorFormatType) => void;
  onChange?: (value: AggregationColor, hex: string) => void;
  onClear?: () => void;
  onChangeComplete?: (value: AggregationColor) => void;
}
