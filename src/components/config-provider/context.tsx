import * as React from 'react';
import type { Options as RequestOptions } from 'ahooks/lib/useRequest/src/types';
import type { ProgressProps } from 'rc-progress';
import type { AffixProps } from '../affix';
import type { AlertProps } from '../alert';
import type { AnchorProps } from '../anchor';
import type { AvatarProps } from '../avatar';
import type { BadgeProps } from '../badge';
import type { BreadcrumbProps } from '../breadcrumb';
import type { ButtonProps } from '../button';
import type { CalendarProps } from '../calendar';
import type { CardProps } from '../card';
import type { CarouselProps } from '../carousel/interface';
import type { CascaderProps } from '../cascader';
import type { CheckboxProps } from '../checkbox';
import type { CollapseProps } from '../collapse';
import type { ColorPickerProps } from '../color-picker';
import type { DatePickerProps, RangePickerProps } from '../date-picker';
import type { DescriptionsProps } from '../descriptions';
import type { DividerProps } from '../divider';
import type { DrawerProps } from '../drawer';
import type { DropdownProps } from '../dropdown';
import type { EmptyProps } from '../empty';
import type { FloatButtonProps } from '../float-button/interface';
import type { FormProps } from '../form';
import type { ImageProps } from '../image';
import type { InputProps, TextAreaProps } from '../input';
import type { InputNumberProps } from '../input-number';
import type { ListProps } from '../list';
import type { Locale } from '../locale';
import type { MentionsProps } from '../mentions';
import type { MenuProps } from '../menu';
import type { ArgsProps as MessageArgsProps } from '../message';
import type { ModalProps } from '../modal';
import type { ArgsProps as NotificationArgsProps } from '../notification';
import type { PaginationProps } from '../pagination';
import type { PopconfirmProps } from '../popconfirm';
import type { PopoverProps } from '../popover';
import type { QRCodeProps } from '../qr-code/interface';
import type { RadioProps } from '../radio';
import type { RateProps } from '../rate';
import type { ResultProps } from '../result';
import type { ScrollbarProps } from '../scrollbar';
import type { SegmentedProps } from '../segmented';
import type { SelectProps } from '../select';
import type { SkeletonProps } from '../skeleton';
import type { SliderBaseProps } from '../slider';
import type { SpaceProps } from '../space';
import type { SpinProps } from '../spin';
import type { SplitterProps } from '../splitter';
import type { StatisticProps } from '../statistic';
import type { StepsProps } from '../steps';
import type { SwitchProps } from '../switch';
import type { TableProps } from '../table';
import type { TabsProps } from '../tabs';
import type { TagProps } from '../tag';
import type { TimelineProps } from '../timeline';
import type { TooltipProps } from '../tooltip';
import type { TourProps } from '../tour';
import type { TransferProps } from '../transfer';
import type { TreeProps } from '../tree';
import type { UploadProps } from '../upload';
import type { RenderEmptyHandler } from './defaultRenderEmpty';

export type PopupOverflow = 'viewport' | 'scroll';

export const Variants = ['outlined', 'borderless', 'filled'] as const;
export type Variant = (typeof Variants)[number];

export type AffixConfig = Pick<AffixProps, 'className'>;

export type AlertConfig = Pick<AlertProps, 'className'>;

export type AnchorConfig = Pick<AnchorProps, 'className'>;

export type AvatarConfig = Pick<AvatarProps, 'className'>;

export type BadgeConfig = Pick<BadgeProps, 'className'>;

export type BreadcrumbConfig = Pick<BreadcrumbProps, 'className'>;

export type ButtonConfig = Pick<ButtonProps, 'className' | 'autoInsertSpace'>;

export type CalendarConfig = Pick<CalendarProps<any>, 'className'>;

export type CardConfig = Pick<CardProps, 'className'>;

export type CarouselConfig = Pick<CarouselProps, 'className'>;

export type CascaderConfig = Pick<CascaderProps, 'className'>;

export type CheckboxConfig = Pick<CheckboxProps, 'className'>;

export type CollapseConfig = Pick<CollapseProps, 'className'>;

export type ColorPickerConfig = Pick<ColorPickerProps, 'className'>;

export type DatePickerConfig = Pick<DatePickerProps, 'className'>;

export type DescriptionsConfig = Pick<DescriptionsProps, 'className'>;

export type DividerConfig = Pick<DividerProps, 'className'>;

export type DrawerConfig = Pick<DrawerProps, 'className'>;

export type DropdownConfig = Pick<DropdownProps, 'className'>;

export type EmptyConfig = Pick<EmptyProps, 'className'>;

export type FloatButtonConfig = Pick<FloatButtonProps, 'className'>;

export type FormConfig = Pick<
  FormProps,
  'requiredMark' | 'colon' | 'scrollToFirstError' | 'validateMessages' | 'variant' | 'className'
>;

export type ImageConfig = Pick<ImageProps, 'className'>;

export type InputConfig = Pick<InputProps, 'autoComplete' | 'className'>;

export type InputNumberConfig = Pick<InputNumberProps, 'className'>;

export type ListConfig = Pick<ListProps<any>, 'className'>;

export type MentionsConfig = Pick<MentionsProps, 'className'>;

export type MenuConfig = Pick<MenuProps, 'className'>;

export type MessageConfig = Pick<MessageArgsProps, 'className'>;

export type ModalConfig = Pick<ModalProps, 'className'>;

export type NotificationConfig = Pick<NotificationArgsProps, 'className'>;

export type PaginationConfig = Pick<PaginationProps, 'showSizeChanger' | 'className'>;

export type PopoverConfig = Pick<PopoverProps, 'className'>;

export type PopconfirmConfig = Pick<PopconfirmProps, 'className'>;

export type ProgressConfig = Pick<ProgressProps, 'className'>;

export type QRCodeConfig = Pick<QRCodeProps, 'className'>;

export type RadioConfig = Pick<RadioProps, 'className'>;

export type RangePickerConfig = Pick<RangePickerProps, 'className'>;

export type RateConfig = Pick<RateProps, 'className'>;

export type ResultConfig = Pick<ResultProps, 'className'>;

export type SelectConfig = Pick<SelectProps, 'className'>;

export type SegmentedConfig = Pick<SegmentedProps, 'className'>;

export type ScrollbarConfig = Pick<
  ScrollbarProps,
  'className' | 'autoHide' | 'autoHideDuration' | 'autoHideTimeout' | 'thumbMinSize'
>;

export type SkeletonConfig = Pick<SkeletonProps, 'className'>;

export type SliderConfig = Pick<SliderBaseProps, 'className'>;

export type SpaceConfig = Pick<SpaceProps, 'size' | 'className'>;

export type SplitterConfig = Pick<SplitterProps, 'className'>;

export type SpinConfig = Pick<SpinProps, 'className'>;

export type StatisticConfig = Pick<StatisticProps, 'className'>;

export type StepsConfig = Pick<StepsProps, 'className'>;

export type SwitchConfig = Pick<SwitchProps, 'className'>;

export type TableConfig = Pick<TableProps, 'className' | 'size'>;

export type TabsConfig = Pick<TabsProps, 'className'>;

export type TagConfig = Pick<TagProps, 'className'>;

export type TextAreaConfig = Pick<TextAreaProps, 'autoComplete' | 'className'>;

export type TimelineConfig = Pick<TimelineProps, 'className'>;

export type TooltipConfig = Pick<TooltipProps, 'className'>;

export type TourConfig = Pick<TourProps, 'className'>;

export type TransferConfig = Pick<TransferProps, 'className'>;

export type TreeConfig = Pick<TreeProps, 'className'>;

export type UploadConfig = Pick<UploadProps, 'className'>;

export type RouteConfig = {
  history: 'browser' | 'hash';
  basename: string;
};
export type RequestConfig = Omit<RequestOptions<any, any>, 'manual' | 'refreshDepsAction'>;

export interface ConfigConsumerProps {
  getTargetContainer?: () => HTMLElement;
  getPopupContainer?: (triggerNode?: HTMLElement) => HTMLElement;
  getPrefixCls: (suffixCls?: string, customizePrefixCls?: string) => string;
  renderEmpty?: RenderEmptyHandler;
  theme?: string | 'auto';
  themeTarget?: React.RefObject<HTMLDivElement>;
  variant?: Variant;
  input?: InputConfig;
  textArea?: TextAreaConfig;
  inputNumber?: InputNumberConfig;
  pagination?: PaginationConfig;
  locale?: Locale;
  space?: SpaceConfig;
  splitter?: SplitterConfig;
  virtual?: boolean;
  popupMatchSelectWidth?: boolean;
  popupOverflow?: PopupOverflow;
  form?: FormConfig;
  select?: SelectConfig;
  affix?: AffixConfig;
  alert?: AlertConfig;
  anchor?: AnchorConfig;
  button?: ButtonConfig;
  divider?: DividerConfig;
  drawer?: DrawerConfig;
  calendar?: CalendarConfig;
  carousel?: CarouselConfig;
  cascader?: CascaderConfig;
  collapse?: CollapseConfig;
  skeleton?: SkeletonConfig;
  spin?: SpinConfig;
  segmented?: SegmentedConfig;
  steps?: StepsConfig;
  statistic?: StatisticConfig;
  image?: ImageConfig;
  list?: ListConfig;
  mentions?: MentionsConfig;
  modal?: ModalConfig;
  progress?: ProgressConfig;
  result?: ResultConfig;
  slider?: SliderConfig;
  breadcrumb?: BreadcrumbConfig;
  menu?: MenuConfig;
  checkbox?: CheckboxConfig;
  descriptions?: DescriptionsConfig;
  empty?: EmptyConfig;
  badge?: BadgeConfig;
  radio?: RadioConfig;
  rate?: RateConfig;
  switch?: SwitchConfig;
  transfer?: TransferConfig;
  avatar?: AvatarConfig;
  message?: MessageConfig;
  scrollbar?: ScrollbarConfig;
  tag?: TagConfig;
  table?: TableConfig;
  card?: CardConfig;
  tabs?: TabsConfig;
  timeline?: TimelineConfig;
  tour?: TourConfig;
  upload?: UploadConfig;
  notification?: NotificationConfig;
  tree?: TreeConfig;
  colorPicker?: ColorPickerConfig;
  datePicker?: DatePickerConfig;
  rangePicker?: RangePickerConfig;
  dropdown?: DropdownConfig;
  qrCode?: QRCodeConfig;
  popover?: PopoverConfig;
  popConfirm?: PopconfirmConfig;
  tooltip?: TooltipConfig;
  floatButton?: FloatButtonConfig;
  route?: RouteConfig;
  request?: RequestConfig;
}

const defaultGetPrefixCls = (suffixCls?: string, customizePrefixCls?: string) => {
  if (customizePrefixCls) {
    return customizePrefixCls;
  }
  return suffixCls ? `metis-${suffixCls}` : 'metis';
};

export const ConfigContext = React.createContext<ConfigConsumerProps>({
  getPrefixCls: defaultGetPrefixCls,
  route: { history: 'hash', basename: '/' },
  request: { debounceWait: 200 },
});

export const ConfigConsumer = ConfigContext.Consumer;
