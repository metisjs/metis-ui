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
export interface LabelInValueType {
  label: React.ReactNode;
  value: RawValueType;
}

export type DraftValueType =
  | RawValueType
  | LabelInValueType
  | DisplayValueType
  | (RawValueType | LabelInValueType | DisplayValueType)[];

export type FilterFunc<OptionType> = (inputValue: string, option?: OptionType) => boolean;

export interface FieldNames<OptionType> {
  value?: string | ((option: OptionType) => RawValueType);
  label?: string | ((option: OptionType) => React.ReactNode);
  groupLabel?: string | ((option: OptionType) => React.ReactNode);
  options?: string | ((option: OptionType) => OptionType[]);
  disabled?: string | ((option: OptionType) => boolean);
}

export interface BaseOptionType {
  [name: string]: any;
}

export interface DefaultOptionType extends BaseOptionType {
  label: React.ReactNode;
  value?: string | number | null;
  children?: Omit<DefaultOptionType, 'children'>[];
}

export type SelectHandler<ValueType, OptionType extends BaseOptionType = DefaultOptionType> = (
  value: ValueType,
  option: OptionType,
) => void;
type ArrayElementType<T> = T extends (infer E)[] ? E : T;

export interface SelectPropsWithoutRequest<
  ValueType = any,
  OptionType extends BaseOptionType = DefaultOptionType,
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
  children?: React.ReactNode;
  options?: OptionType[];
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

  labelInValue?: boolean;
  value?: ValueType | null;
  defaultValue?: ValueType | null;
  onChange?: (value: ValueType, option: OptionType | OptionType[]) => void;

  placement?: SelectCommonPlacement;
  status?: InputStatus;
}

type RequestConfig<TData, TParams extends any[]> =
  | RequestService<TData, TParams>
  | {
      service: RequestService<TData, TParams>;
      options?: Omit<RequestOptions<TData, TParams>, 'manual'>;
    };

export interface SelectPropsWithRequest<TData extends BaseOptionType, TParams extends any[]>
  extends Omit<
    SelectPropsWithoutRequest<any, TData>,
    'showSearch' | 'options' | 'filterOption' | 'filterSort'
  > {
  request: RequestConfig<TData, TParams>;
  showSearch?: false;
  pagination?: false;
}

export interface SelectPropsWithRequestSearch<
  TData,
  TParams extends [
    {
      filter: { keyword?: string };
    },
    ...any[],
  ],
> extends Omit<
    SelectPropsWithoutRequest,
    'showSearch' | 'options' | 'filterOption' | 'filterSort'
  > {
  request: RequestConfig<TData, TParams>;
  showSearch: true;
  pagination?: false;
}

export interface SelectPropsWithRequestPagination<
  TData,
  TParams extends [
    {
      current: number;
      pageSize: number;
    },
    ...any[],
  ],
> extends Omit<
    SelectPropsWithoutRequest,
    'showSearch' | 'options' | 'filterOption' | 'filterSort'
  > {
  request: RequestConfig<TData, TParams>;
  showSearch?: false;
  pagination: true;
}

export interface SelectPropsWithRequestSearchPagination<
  TData,
  TParams extends [
    {
      current: number;
      pageSize: number;
      filter: { keyword?: string };
    },
    ...any[],
  ],
> extends Omit<
    SelectPropsWithoutRequest,
    'showSearch' | 'options' | 'filterOption' | 'filterSort'
  > {
  request: RequestConfig<TData, TParams>;
  showSearch: true;
  pagination: true;
}

export type SelectPropsType<TData extends BaseOptionType, TParams extends any[]> =
  | SelectPropsWithoutRequest<any, DefaultOptionType>
  | SelectPropsWithRequest<TData, TParams>;
// | SelectPropsWithRequestSearch<TData, TParams>
// | SelectPropsWithRequestPagination<TData, TParams>
// | SelectPropsWithRequestSearchPagination<TData, TParams>;
