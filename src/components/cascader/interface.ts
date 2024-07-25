import { SemanticClassName } from '../_util/classNameUtils';
import { InputStatus } from '../_util/statusUtils';
import { Variant } from '../config-provider';
import { SizeType } from '../config-provider/SizeContext';
import { BaseSelectPropsWithoutPrivate } from '../select';
import { GetRequestType, SelectCommonPlacement } from '../select/interface';
import { SHOW_CHILD, SHOW_PARENT } from './utils/commonUtil';

export interface BaseOptionType {
  disabled?: boolean;
  label?: React.ReactNode;
  value?: string | number | null;
  children?: DefaultOptionType[];
}

export type DefaultOptionType = BaseOptionType & Record<string, any>;

export type SingleValueType = (string | number)[];
export type MultiValueType = SingleValueType[];

export type GetValueType<
  MultipleType extends boolean = false,
  OptionInValueType extends boolean = false,
> = false extends OptionInValueType
  ? false extends MultipleType
    ? SingleValueType
    : MultiValueType
  : false extends MultipleType
  ? OptionInValueType[]
  : OptionInValueType[][];

export interface FieldNames<OptionType extends DefaultOptionType = DefaultOptionType> {
  value?: keyof OptionType;
  label?: keyof OptionType;
  disabled?: keyof OptionType;
  children?: keyof OptionType;
}

export type ShowCheckedStrategy = typeof SHOW_PARENT | typeof SHOW_CHILD;

export interface CascaderProps<
  OptionType extends DefaultOptionType = DefaultOptionType,
  MultipleType extends boolean = false,
  OptionInValueType extends boolean = false,
  ShowSearchType extends boolean = false,
  ValueType = GetValueType<MultipleType, OptionInValueType>,
> extends Omit<
    BaseSelectPropsWithoutPrivate,
    'tokenSeparators' | 'mode' | 'showSearch' | 'className' | 'popupMatchSelectWidth'
  > {
  // >>> MISC
  prefixCls?: string;
  id?: string;
  className?: SemanticClassName<'popup' | 'selector'>;
  placement?: SelectCommonPlacement;
  status?: InputStatus;
  displayRender?: (label: string[], selectedOptions?: OptionType[]) => React.ReactNode;

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
  value?: ValueType;
  defaultValue?: ValueType;
  changeOnSelect?: boolean;
  multiple?: MultipleType;
  showCheckedStrategy?: ShowCheckedStrategy;
  optionInValue?: OptionInValueType;
  onChange?: (
    value: ValueType,
    options: MultipleType extends false ? OptionType[] : OptionType[][],
  ) => void;

  // >>> Icon
  suffixIcon?: React.ReactNode;
  expandIcon?: React.ReactNode;
  loadingIcon?: React.ReactNode;

  // >>> Request
  request?: GetRequestType<OptionType, ShowSearchType, false>;
  lazyLoad?: boolean;
}
