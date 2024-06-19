import {
  Options as RequestOptions,
  Service as RequestService,
} from 'ahooks/lib/useRequest/src/types';
import * as React from 'react';
import { ComplexClassName } from '../_util/classNameUtils';
import { InputStatus } from '../_util/statusUtils';
import { SizeType } from '../config-provider/SizeContext';
import type { BaseSelectPropsWithoutPrivate, DisplayValueType, RenderNode } from './BaseSelect';
import { SelectPlacements } from './Select';

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
};
export type OptionInValueType = BaseOptionType;

export type DraftValueType =
  | RawValueType
  | OptionInValueType
  | DisplayValueType
  | (RawValueType | OptionInValueType | DisplayValueType)[];

export type FilterFunc<OptionType> = (inputValue: string, option?: OptionType) => boolean;

export interface FieldNames<OptionType> {
  value?: string | ((option: OptionType) => RawValueType);
  label?: string | ((option: OptionType) => React.ReactNode);
  groupLabel?: string | ((option: OptionType) => React.ReactNode);
  options?: string;
  disabled?: string | ((option: OptionType) => boolean);
}

export interface FlattenOptionData<OptionType> {
  label?: React.ReactNode;
  data: OptionType;
  key: React.Key;
  value?: RawValueType;
  groupOption?: boolean;
  group?: boolean;
}

export interface BaseOptionType {
  [name: string]: any;
}

export type SelectHandler<ValueType, OptionType extends BaseOptionType> = (
  value: ValueType,
  option: OptionType,
) => void;
type ArrayElementType<T> = T extends (infer E)[] ? E : T;

export interface SelectPropsWithOptions<
  ValueType = any,
  OptionType extends BaseOptionType = BaseOptionType,
> extends Omit<
    BaseSelectPropsWithoutPrivate,
    'mode' | 'getInputElement' | 'getRawInputElement' | 'backfill' | 'placement' | 'className'
  > {
  prefixCls?: string;
  id?: string;
  className?: ComplexClassName<'popup' | 'selector'>;

  bordered?: boolean;
  disabled?: boolean;

  // >>> Size
  size?: SizeType;

  // >>> Field Names
  fieldNames?: FieldNames<OptionType>;

  // >>> Search
  searchValue?: string;
  onSearch?: (value: string) => void;
  autoClearSearchValue?: boolean;

  // >>> Select
  onSelect?: SelectHandler<ArrayElementType<ValueType>, OptionType>;
  onDeselect?: SelectHandler<ArrayElementType<ValueType>, OptionType>;

  // >>> Options
  /**
   * In Select, `false` means do nothing.
   * In TreeSelect, `false` will highlight match item.
   * It's by design.
   */
  filterOption?: boolean | FilterFunc<OptionType>;
  filterSort?: (optionA: OptionType, optionB: OptionType) => number;
  optionFilterProp?: string;
  optionLabelProp?: string;
  options: OptionType[];
  defaultActiveFirstOption?: boolean;
  virtual?: boolean;
  listHeight?: number;
  listItemHeight?: number;

  // >>> Icon
  menuItemSelectedIcon?: RenderNode;
  suffixIcon?: React.ReactNode;

  mode?: 'multiple' | 'tags';
  /** @private Internal usage. Do not use in your production. */
  combobox?: boolean;

  optionInValue?: boolean;
  value?: ValueType | null;
  defaultValue?: ValueType | null;
  onChange?: (value: ValueType, option: OptionType | OptionType[]) => void;

  placement?: SelectCommonPlacement;
  status?: InputStatus;
}

export type RequestConfig<TData, TParams extends any[]> =
  | RequestService<{ data: TData[]; total?: number }, TParams>
  | {
      service: RequestService<{ data: TData[]; total?: number }, TParams>;
      options?: Omit<
        RequestOptions<{ data: TData[]; total?: number }, TParams>,
        'manual' | 'refreshDepsAction'
      >;
    };

export interface SelectPropsWithRequest<
  ValueType,
  TData extends BaseOptionType,
  TParams extends any[],
> extends Omit<
    SelectPropsWithOptions<ValueType, TData>,
    'showSearch' | 'options' | 'filterOption' | 'filterSort'
  > {
  request: RequestConfig<TData, TParams>;
  showSearch?: false;
  pagination?: false;
}

export interface SelectPropsWithRequestSearch<
  ValueType,
  TData extends BaseOptionType,
  TParams extends [
    {
      filters: { [key: string]: string };
    },
    ...any[],
  ],
> extends Omit<
    SelectPropsWithOptions<ValueType, TData>,
    'showSearch' | 'options' | 'filterOption' | 'filterSort'
  > {
  request: RequestConfig<TData, TParams>;
  showSearch: true;
  pagination?: false;
}

export interface SelectPropsWithRequestPagination<
  ValueType,
  TData extends BaseOptionType,
  TParams extends [
    {
      current: number;
      pageSize: number;
    },
    ...any[],
  ],
> extends Omit<
    SelectPropsWithOptions<ValueType, TData>,
    'showSearch' | 'options' | 'filterOption' | 'filterSort'
  > {
  request: RequestConfig<TData, TParams>;
  showSearch?: false;
  pagination: true;
}

export interface SelectPropsWithRequestSearchPagination<
  ValueType,
  TData extends BaseOptionType,
  TParams extends [
    {
      current: number;
      pageSize: number;
      filter: { keyword?: string };
    },
    ...any[],
  ],
> extends Omit<
    SelectPropsWithOptions<ValueType, TData>,
    'showSearch' | 'options' | 'filterOption' | 'filterSort'
  > {
  request: RequestConfig<TData, TParams>;
  showSearch: true;
  pagination: true;
}

export type SelectProps<
  ValueType = any,
  OptionType extends BaseOptionType = BaseOptionType,
  TParams extends any[] = any[],
> =
  | SelectPropsWithOptions<ValueType, BaseOptionType> &
      SelectPropsWithRequest<ValueType, OptionType, TParams>;
