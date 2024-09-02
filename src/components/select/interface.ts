import type * as React from 'react';
import type {
  Options as RequestOptions,
  Service as RequestService,
} from 'ahooks/lib/useRequest/src/types';
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

export type GetRequestType<
  OptionType extends BaseOptionType,
  ShowSearchType extends boolean = false,
  LazyLoadType extends boolean = false,
> = ShowSearchType extends true
  ? LazyLoadType extends true
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
    : RequestConfig<OptionType, any[]>
  : RequestConfig<OptionType, any[]>;

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
  ValueType extends RawValueType = RawValueType,
  OptionType extends BaseOptionType = BaseOptionType,
  ModeType extends 'multiple' | 'tags' | 'default' = 'default',
  ShowSearchType extends boolean = false,
  LazyLoadType extends boolean = false,
  InternalValueType = ModeType extends 'default' ? ValueType : ValueType[],
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
  filterOption?: FilterFunc<OptionType>;
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
  request?: GetRequestType<OptionType, ShowSearchType, LazyLoadType>;
  lazyLoad?: LazyLoadType;
}
