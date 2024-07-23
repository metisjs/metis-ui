import {
  Options as RequestOptions,
  Service as RequestService,
} from 'ahooks/lib/useRequest/src/types';
import * as React from 'react';
import { SemanticClassName } from '../_util/classNameUtils';
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

export type GetValueType<
  ModeType extends 'multiple' | 'tags' | 'default' = 'default',
  OptionInValueType extends boolean = false,
> = false extends OptionInValueType
  ? ModeType extends 'default'
    ? RawValueType
    : RawValueType[]
  : ModeType extends 'default'
  ? OptionInValueType
  : OptionInValueType[];

export type GetRequestType<
  OptionType extends BaseOptionType,
  ShowSearchType extends boolean = false,
  PaginationType extends boolean = false,
> = ShowSearchType extends true
  ? PaginationType extends true
    ? RequestConfig<
        OptionType,
        [
          {
            current: number;
            pageSize: number;
            filters: { [key: string]: string };
          },
          ...any[],
        ]
      >
    : RequestConfig<
        OptionType,
        [
          {
            filters: { [key: string]: string };
          },
          ...any[],
        ]
      >
  : PaginationType extends true
  ? RequestConfig<
      OptionType,
      [
        {
          current: number;
          pageSize: number;
        },
        ...any[],
      ]
    >
  : RequestConfig<OptionType, any[]>;

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
  ModeType extends 'multiple' | 'tags' | 'default' = 'default',
  OptionInValueType extends boolean = false,
  ShowSearchType extends boolean = false,
  PaginationType extends boolean = false,
  ValueType = GetValueType<ModeType, OptionInValueType>,
> extends Omit<BaseSelectPropsWithoutPrivate, 'mode' | 'placement' | 'className' | 'showSearch'> {
  prefixCls?: string;
  id?: string;
  className?: SemanticClassName<'popup' | 'selector'>;

  disabled?: boolean;

  // >>> Size
  size?: SizeType;

  // >>> Field Names
  fieldNames?: FieldNames<OptionType>;

  // >>> Search
  showSearch?: ShowSearchType;
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

  mode?: ModeType;
  /** @private Internal usage. Do not use in your production. */
  combobox?: boolean;

  optionInValue?: OptionInValueType;
  value?: ValueType;
  defaultValue?: ValueType;
  onChange?: (
    value: ValueType,
    option: ModeType extends 'default' ? OptionType : OptionType[],
  ) => void;

  placement?: SelectCommonPlacement;
  status?: InputStatus;

  // >>> Request
  request?: GetRequestType<OptionType, ShowSearchType, PaginationType>;
  pagination?: PaginationType;
}
