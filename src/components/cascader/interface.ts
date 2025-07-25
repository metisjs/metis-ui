import type { SemanticClassName } from '@util/classNameUtils';
import type { InputStatus } from '@util/statusUtils';
import type { RequestConfig } from '@util/type';
import type { Variant } from '../config-provider';
import type { SizeType } from '../config-provider/SizeContext';
import type { BaseSelectPropsWithoutPrivate } from '../select';
import type { RawValueType, SelectCommonPlacement } from '../select/interface';
import type { InnerSelectorProps } from '../select/Selector';
import type { SHOW_CHILD, SHOW_PARENT } from './utils/commonUtil';

export interface BaseOptionType {
  disabled?: boolean;
  label?: React.ReactNode;
  value?: string | number;
  children?: DefaultOptionType[];
  className?: SemanticClassName<
    { label?: string; icon?: string; checkbox?: string },
    { expand?: boolean; active?: boolean; disabled?: boolean }
  >;
}

export type DefaultOptionType = BaseOptionType & Record<string, any>;

export type SingleValueType = RawValueType[];
export type MultiValueType = SingleValueType[];

export type LabeledValueType = {
  label: React.ReactNode;
  value: RawValueType;
  key: React.Key;
  disabled?: boolean;
  option: DefaultOptionType;
  /** 是否在options中不存在 */
  missing?: boolean;
}[];

export type DraftValueType =
  | SingleValueType
  | MultiValueType
  | DefaultOptionType[]
  | DefaultOptionType[][]
  | LabeledValueType
  | LabeledValueType[];

export type GetValueType<
  OptionType extends DefaultOptionType = DefaultOptionType,
  MultipleType extends boolean = false,
> = false extends MultipleType ? SingleValueType | OptionType[] : MultiValueType | OptionType[][];

export type GetRequestType<
  OptionType extends BaseOptionType,
  ShowSearchType extends boolean = false,
  LazyLoadType extends boolean = false,
  ParamsType extends any[] = any[],
> = ShowSearchType extends true
  ? LazyLoadType extends true
    ? RequestConfig<
        OptionType,
        {
          filters: { [key: string]: string };
        } & { [parentValue: string]: RawValueType },
        ParamsType
      >
    : RequestConfig<
        OptionType,
        {
          filters: { [key: string]: string };
        },
        ParamsType
      >
  : LazyLoadType extends true
    ? RequestConfig<
        OptionType,
        {
          [parentValue: string]: RawValueType;
        },
        ParamsType
      >
    : RequestConfig<
        OptionType,
        ParamsType extends [infer First, ...any] ? First : any,
        ParamsType extends [any, ...infer Rest] ? Rest : any
      >;

export interface FieldNames<OptionType extends DefaultOptionType = DefaultOptionType> {
  value?: keyof OptionType;
  label?: keyof OptionType;
  disabled?: keyof OptionType;
  children?: keyof OptionType;
  leaf?: keyof OptionType;
}

export type ShowCheckedStrategy = typeof SHOW_PARENT | typeof SHOW_CHILD;

export interface CascaderProps<
  OptionType extends DefaultOptionType = DefaultOptionType,
  MultipleType extends boolean = false,
  ShowSearchType extends boolean = false,
  LazyLoadType extends boolean = false,
  ParamsType extends any[] = any[],
> extends Omit<
    BaseSelectPropsWithoutPrivate,
    'tokenSeparators' | 'mode' | 'showSearch' | 'className' | 'popupMatchSelectWidth'
  > {
  // >>> MISC
  prefixCls?: string;
  id?: string;
  className?: SemanticClassName<
    {
      popup?: string;
      arrow?: string;
      clear?: string;
      column?: string;
      option?: BaseOptionType['className'];
      selector?: InnerSelectorProps['className'];
    },
    { open: boolean; disabled?: boolean }
  >;
  placement?: SelectCommonPlacement;
  status?: InputStatus;
  displayRender?: (labels: React.ReactNode[], selectedOptions?: OptionType[]) => React.ReactNode;

  // >>> Variant
  variant?: Variant;

  // >>> Size
  size?: SizeType;

  // >>> Field Names
  fieldNames?: FieldNames<OptionType>;

  // >>> Search
  showSearch?: ShowSearchType;
  searchValue?: string;
  onSearch?: (value: string) => void;
  autoClearSearchValue?: boolean;

  // Trigger
  expandTrigger?: 'hover' | 'click';

  // >>> Options
  options?: OptionType[];
  optionFilterProp?: string;
  filterOption?: (inputValue: string, options: OptionType[]) => boolean;
  filterRender?: (inputValue: string, path: OptionType[]) => React.ReactNode;
  filterSort?: (optionA: OptionType[], optionB: OptionType[]) => number;
  optionRender?: (option: OptionType) => React.ReactNode;

  // >>> Value
  value?: GetValueType<OptionType, MultipleType>;
  defaultValue?: GetValueType<OptionType, MultipleType>;
  changeOnSelect?: boolean;
  multiple?: MultipleType;
  showCheckedStrategy?: ShowCheckedStrategy;
  onChange?: (
    value: MultipleType extends false ? SingleValueType : MultiValueType,
    options: MultipleType extends false ? OptionType[] : OptionType[][],
  ) => void;

  // >>> Icon
  suffixIcon?: React.ReactNode;
  expandIcon?: React.ReactNode;
  loadingIcon?: React.ReactNode;

  // >>> Request
  lazyLoad?: LazyLoadType;
  request?: GetRequestType<OptionType, ShowSearchType, LazyLoadType, ParamsType>;
}
