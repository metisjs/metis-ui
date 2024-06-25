import {
  Options as RequestOptions,
  Service as RequestService,
} from 'ahooks/lib/useRequest/src/types';
import * as React from 'react';
import { SemanticClassName } from '../_util/classNameUtils';
import { InputStatus } from '../_util/statusUtils';
import { SizeType } from '../config-provider/SizeContext';
import type {
  BaseSelectPropsWithoutPrivate,
  BaseSelectRef,
  DisplayValueType,
  RenderNode,
} from './BaseSelect';
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
  disabled?: boolean;
}

export interface BaseOptionType {
  [name: string]: any;
}

export type SelectHandler<ValueType, OptionType extends BaseOptionType> = (
  value: ValueType,
  option: OptionType,
) => void;
type ArrayElementType<T> = T extends (infer E)[] ? E : T;

export type RequestConfig<TData, ParamsType extends any[]> =
  | RequestService<{ data: TData[]; total?: number }, ParamsType>
  | {
      service: RequestService<{ data: TData[]; total?: number }, ParamsType>;
      options?: Omit<
        RequestOptions<{ data: TData[]; total?: number }, ParamsType>,
        'manual' | 'refreshDepsAction'
      >;
    };

export interface SelectProps<
  OptionType extends BaseOptionType = BaseOptionType,
  ValueType = any,
  ParamsType extends any[] = any[],
> extends Omit<
    BaseSelectPropsWithoutPrivate,
    'mode' | 'getInputElement' | 'getRawInputElement' | 'backfill' | 'placement' | 'className'
  > {
  prefixCls?: string;
  id?: string;
  className?: SemanticClassName<'popup' | 'selector'>;

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

  optionInValue?: boolean;
  value?: ValueType | null;
  defaultValue?: ValueType | null;
  onChange?: (value: ValueType, option: OptionType | OptionType[]) => void;

  placement?: SelectCommonPlacement;
  status?: InputStatus;

  // >>> Request
  request?: RequestConfig<OptionType, ParamsType>;
  pagination?: boolean;
}

export interface SelectPropsWithOptions<
  OptionType extends BaseOptionType = BaseOptionType,
  ValueType = any,
> extends Omit<SelectProps<OptionType, ValueType>, 'request' | 'pagination'> {
  options: OptionType[];
}

export interface SelectPropsWithRequest<
  OptionType extends BaseOptionType = BaseOptionType,
  ValueType = any,
  ParamsType extends any[] = any[],
> extends Omit<
    SelectProps<OptionType, ValueType, ParamsType>,
    'options' | 'filterOption' | 'filterSort'
  > {
  request: RequestConfig<OptionType, ParamsType>;
  showSearch?: false;
  pagination?: false;
}

type SearchParamsType = [
  {
    filters: { [key: string]: string };
  },
  ...any[],
];

export interface SelectPropsWithRequestSearch<
  OptionType extends BaseOptionType = BaseOptionType,
  ValueType = any,
  ParamsType extends SearchParamsType = SearchParamsType,
> extends Omit<
    SelectProps<OptionType, ValueType, ParamsType>,
    'options' | 'filterOption' | 'filterSort'
  > {
  request: RequestConfig<OptionType, ParamsType>;
  showSearch: true;
  pagination?: false;
}

type PaginationParamsType = [
  {
    current: number;
    pageSize: number;
  },
  ...any[],
];

export interface SelectPropsWithRequestPagination<
  OptionType extends BaseOptionType = BaseOptionType,
  ValueType = any,
  ParamsType extends PaginationParamsType = PaginationParamsType,
> extends Omit<
    SelectProps<OptionType, ValueType, ParamsType>,
    'options' | 'filterOption' | 'filterSort'
  > {
  request: RequestConfig<OptionType, ParamsType>;
  showSearch: false;
  pagination?: true;
}

type SearchAndPaginationParamsType = [
  {
    current: number;
    pageSize: number;
    filters: { [key: string]: string };
  },
  ...any[],
];

export interface SelectPropsWithRequestSearchPagination<
  OptionType extends BaseOptionType = BaseOptionType,
  ValueType = any,
  ParamsType extends SearchAndPaginationParamsType = SearchAndPaginationParamsType,
> extends Omit<
    SelectProps<OptionType, ValueType, ParamsType>,
    'options' | 'filterOption' | 'filterSort'
  > {
  request: RequestConfig<OptionType, ParamsType>;
  showSearch: true;
  pagination?: true;
}

export interface TypedSelectComponent {
  // >>> With options
  <OptionType extends BaseOptionType = BaseOptionType, ValueType = any>(
    props: SelectPropsWithOptions<OptionType, ValueType> & {
      ref?: React.Ref<BaseSelectRef>;
    },
  ): React.ReactElement;

  // >>> With request
  <
    OptionType extends BaseOptionType = BaseOptionType,
    ValueType = any,
    ParamsType extends any[] = any[],
  >(
    props: SelectPropsWithRequest<OptionType, ValueType, ParamsType> & {
      ref?: React.Ref<BaseSelectRef>;
    },
  ): React.ReactElement;

  // >>> With request and search
  <
    OptionType extends BaseOptionType = BaseOptionType,
    ValueType = any,
    ParamsType extends SearchParamsType = SearchParamsType,
  >(
    props: SelectPropsWithRequestSearch<OptionType, ValueType, ParamsType> & {
      ref?: React.Ref<BaseSelectRef>;
    },
  ): React.ReactElement;

  // >>> With request and pagination
  <
    OptionType extends BaseOptionType = BaseOptionType,
    ValueType = any,
    ParamsType extends PaginationParamsType = PaginationParamsType,
  >(
    props: SelectPropsWithRequestPagination<OptionType, ValueType, ParamsType> & {
      ref?: React.Ref<BaseSelectRef>;
    },
  ): React.ReactElement;

  // >>> With request and search and pagination
  <
    OptionType extends BaseOptionType = BaseOptionType,
    ValueType = any,
    ParamsType extends SearchAndPaginationParamsType = SearchAndPaginationParamsType,
  >(
    props: SelectPropsWithRequestSearchPagination<OptionType, ValueType, ParamsType> & {
      ref?: React.Ref<BaseSelectRef>;
    },
  ): React.ReactElement;
}
