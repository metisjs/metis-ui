import type * as React from 'react';
import type { SemanticClassName } from '@util/classNameUtils';
import type { GetRequestType } from '@util/type';
import type { BaseSelectPropsWithoutPrivate, RenderNode } from './BaseSelect';
import type { SelectPlacements } from './Select';

export type SelectCommonPlacement = (typeof SelectPlacements)[number];

export type OnActiveValue = (
  active: RawValueType | null,
  index: number,
  info?: { source?: 'keyboard' | 'mouse' },
) => void;

export type OnInternalSelect = (value: RawValueType, info: { selected: boolean }) => void;

export type RawValueType = string | number;
export type LabeledValueType = {
  label: React.ReactNode;
  value: RawValueType;
  key: React.Key;
  disabled: boolean | undefined;
  title: string;
  option?: BaseOptionType;
};

export type DraftValueType =
  | RawValueType
  | BaseOptionType
  | LabeledValueType
  | (RawValueType | BaseOptionType | LabeledValueType)[];

export type GetValueType<
  OptionType extends BaseOptionType,
  ModeType extends 'multiple' | 'tags' | 'default' = 'default',
> = ModeType extends 'default' ? RawValueType | OptionType : RawValueType[] | OptionType[];

export type FilterFunc<OptionType> = (inputValue: string, option?: OptionType) => boolean;

export interface FieldNames<OptionType extends BaseOptionType> {
  value?: keyof OptionType;
  label?: keyof OptionType;
  groupLabel?: keyof OptionType;
  options?: keyof OptionType;
  disabled?: keyof OptionType;
}

export interface FlattenOptionData<OptionType> {
  label?: React.ReactNode;
  data: OptionType;
  key: React.Key;
  value?: RawValueType;
  groupOption?: boolean;
  group?: boolean;
  disabled?: boolean;
}

export interface BaseOptionType {
  [name: string]: any;
  className?: SemanticClassName<
    { label?: string; state?: string },
    { group?: boolean; selected?: boolean; grouped?: boolean; active?: boolean; disabled?: boolean }
  >;
}

export type SelectHandler<ValueType, OptionType extends BaseOptionType> = (
  value: ValueType,
  option: OptionType,
) => void;
type ArrayElementType<T> = T extends (infer E)[] ? E : T;

export interface SelectProps<
  ValueType extends RawValueType = RawValueType,
  OptionType extends BaseOptionType = BaseOptionType,
  ModeType extends 'multiple' | 'tags' | 'default' = 'default',
  ShowSearchType extends boolean = false,
  LazyLoadType extends boolean = false,
  InternalValueType = ModeType extends 'default' ? ValueType : ValueType[],
  ParamsType extends any[] = any[],
> extends Omit<BaseSelectPropsWithoutPrivate, 'mode' | 'placement' | 'showSearch'> {
  prefixCls?: string;
  id?: string;
  displayRender?: (selectedOption: OptionType) => React.ReactNode;

  disabled?: boolean;

  // >>> Field Names
  fieldNames?: FieldNames<OptionType>;

  // >>> Search
  showSearch?: ShowSearchType;
  searchValue?: string;
  onSearch?: (value: string) => void;
  autoClearSearchValue?: boolean;

  // >>> Select
  onSelect?: SelectHandler<ArrayElementType<InternalValueType>, OptionType>;
  onDeselect?: SelectHandler<ArrayElementType<InternalValueType>, OptionType>;

  // >>> Options
  filterOption?: boolean | FilterFunc<OptionType>;
  filterSort?: (optionA: OptionType, optionB: OptionType) => number;
  optionFilterProp?: string;
  options?: OptionType[];
  optionRender?: (
    option: FlattenOptionData<OptionType>,
    info: {
      index: number;
    },
  ) => React.ReactNode;
  defaultActiveFirstOption?: boolean;
  virtual?: boolean;
  listHeight?: number;
  listItemHeight?: number;

  // >>> Icon
  menuItemSelectedIcon?: RenderNode;
  suffixIcon?: React.ReactNode;

  mode?: ModeType;
  /** @private Internal usage. Do not use in your production. */
  combobox?: boolean;

  value?: GetValueType<OptionType, ModeType>;
  defaultValue?: GetValueType<OptionType, ModeType>;
  onChange?: (
    value: InternalValueType,
    option: ModeType extends 'default' ? OptionType : OptionType[],
  ) => void;

  placement?: SelectCommonPlacement;

  // >>> Request
  request?: GetRequestType<OptionType, ShowSearchType, LazyLoadType, ParamsType>;
  lazyLoad?: LazyLoadType;
}
