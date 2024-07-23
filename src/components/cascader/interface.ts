import { SemanticClassName } from '../_util/classNameUtils';
import { SizeType } from '../config-provider/SizeContext';
import { BaseSelectPropsWithoutPrivate } from '../select';
import { GetRequestType } from '../select/interface';
import { SHOW_CHILD, SHOW_PARENT } from './utils/commonUtil';

export interface BaseOptionType {
  disabled?: boolean;
  label?: React.ReactNode;
  value?: string | number | null;
  children?: DefaultOptionType[];
}

export type DefaultOptionType = BaseOptionType & Record<string, any>;

export type RawValueType = string | number;

export type GetValueType<
  MultipleType extends boolean = false,
  OptionInValueType extends boolean = false,
> = false extends OptionInValueType
  ? false extends MultipleType
    ? RawValueType[]
    : RawValueType[][]
  : false extends MultipleType
  ? OptionInValueType[]
  : OptionInValueType[][];

export interface FieldNames<OptionType extends DefaultOptionType = DefaultOptionType> {
  value?: keyof OptionType | ((option: OptionType) => RawValueType);
  label?: keyof OptionType | ((option: OptionType) => React.ReactNode);
  disabled?: keyof OptionType | ((option: OptionType) => boolean);
  children?: keyof OptionType;
}

export type ShowCheckedStrategy = typeof SHOW_PARENT | typeof SHOW_CHILD;

export interface CascaderProps<
  OptionType extends DefaultOptionType = DefaultOptionType,
  MultipleType extends boolean = false,
  OptionInValueType extends boolean = false,
  ShowSearchType extends boolean = false,
  PaginationType extends boolean = false,
  ValueType = GetValueType<MultipleType, OptionInValueType>,
> extends Omit<
    BaseSelectPropsWithoutPrivate,
    'tokenSeparators' | 'mode' | 'showSearch' | 'className'
  > {
  // >>> MISC
  prefixCls?: string;
  id?: string;
  className?: SemanticClassName<'popup' | 'selector'>;

  // >>> Size
  size?: SizeType;

  // >>> Field Names
  fieldNames?: FieldNames<OptionType>;

  // >>> Search
  showSearch?: ShowSearchType;
  searchValue?: string;
  onSearch?: (value: string) => void;
  autoClearSearchValue?: boolean;

  // >>> Value
  value?: ValueType;
  defaultValue?: ValueType;
  changeOnSelect?: boolean;
  displayRender?: (label: string[], selectedOptions?: OptionType[]) => React.ReactNode;
  multiple?: MultipleType;
  showCheckedStrategy?: ShowCheckedStrategy;

  // >>> Request
  request?: GetRequestType<OptionType, ShowSearchType, PaginationType>;
  pagination?: PaginationType;
}
