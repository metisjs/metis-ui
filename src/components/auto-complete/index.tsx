import toArray from 'rc-util/lib/Children/toArray';
import * as React from 'react';
import { mergeSemanticCls } from '../_util/classNameUtils';
import type { ConfigConsumerProps } from '../config-provider';
import { ConfigContext } from '../config-provider';
import type { RefSelectProps, SelectProps } from '../select';
import Select from '../select';
import { BaseSelectRef } from '../select/BaseSelect';
import { BaseOptionType, PaginationParamsType, RequestConfig } from '../select/interface';

export interface AutoCompleteProps<
  OptionType extends BaseOptionType = BaseOptionType,
  ValueType = any,
  ParamsType extends any[] = any[],
> extends Omit<
    SelectProps<OptionType, ValueType, ParamsType>,
    'loading' | 'mode' | 'optionLabelProp' | 'labelInValue' | 'showSearch'
  > {
  children?: React.ReactNode;
}

const AutoComplete = React.forwardRef(
  (props: AutoCompleteProps, ref: React.Ref<RefSelectProps>) => {
    const { prefixCls: customizePrefixCls, className, children } = props;
    const childNodes: React.ReactElement[] = toArray(children);

    // ============================= Input =============================
    let customizeInput: React.ReactElement | undefined;

    if (childNodes.length === 1 && React.isValidElement(childNodes[0])) {
      [customizeInput] = childNodes;
    }

    const getInputElement = customizeInput ? (): React.ReactElement => customizeInput! : undefined;

    const { getPrefixCls } = React.useContext<ConfigConsumerProps>(ConfigContext);
    const prefixCls = getPrefixCls('select', customizePrefixCls);

    return (
      // @ts-ignore
      <Select
        ref={ref}
        suffixIcon={null}
        {...props}
        prefixCls={prefixCls}
        className={mergeSemanticCls(`${prefixCls}-auto-complete`, className)}
        combobox
        getInputElement={getInputElement}
      ></Select>
    );
  },
);

export interface AutoCompletePropsWithOptions<
  OptionType extends BaseOptionType = BaseOptionType,
  ValueType = any,
> extends Omit<
    SelectProps<OptionType, ValueType>,
    | 'request'
    | 'pagination'
    | 'loading'
    | 'mode'
    | 'optionLabelProp'
    | 'labelInValue'
    | 'showSearch'
  > {
  options: OptionType[];
  children?: React.ReactNode;
}

export interface AutoCompletePropsWithRequest<
  OptionType extends BaseOptionType = BaseOptionType,
  ValueType = any,
  ParamsType extends any[] = any[],
> extends Omit<
    SelectProps<OptionType, ValueType, ParamsType>,
    | 'options'
    | 'filterOption'
    | 'filterSort'
    | 'loading'
    | 'mode'
    | 'optionLabelProp'
    | 'labelInValue'
    | 'showSearch'
  > {
  request: RequestConfig<OptionType, ParamsType>;
  pagination?: false;
  children?: React.ReactNode;
}

export interface AutoCompletePropsWithRequestPagination<
  OptionType extends BaseOptionType = BaseOptionType,
  ValueType = any,
  ParamsType extends PaginationParamsType = PaginationParamsType,
> extends Omit<
    SelectProps<OptionType, ValueType, ParamsType>,
    | 'options'
    | 'filterOption'
    | 'filterSort'
    | 'loading'
    | 'mode'
    | 'optionLabelProp'
    | 'labelInValue'
    | 'showSearch'
  > {
  request: RequestConfig<OptionType, ParamsType>;
  pagination?: true;
  children?: React.ReactNode;
}

interface TypedAutoCompleteComponent {
  // >>> With options
  <OptionType extends BaseOptionType = BaseOptionType, ValueType = any>(
    props: AutoCompletePropsWithOptions<OptionType, ValueType> & {
      ref?: React.Ref<BaseSelectRef>;
    },
  ): React.ReactElement;

  // >>> With request
  <
    OptionType extends BaseOptionType = BaseOptionType,
    ValueType = any,
    ParamsType extends any[] = any[],
  >(
    props: AutoCompletePropsWithRequest<OptionType, ValueType, ParamsType> & {
      ref?: React.Ref<BaseSelectRef>;
    },
  ): React.ReactElement;

  // >>> With request and pagination
  <
    OptionType extends BaseOptionType = BaseOptionType,
    ValueType = any,
    ParamsType extends PaginationParamsType = PaginationParamsType,
  >(
    props: AutoCompletePropsWithRequestPagination<OptionType, ValueType, ParamsType> & {
      ref?: React.Ref<BaseSelectRef>;
    },
  ): React.ReactElement;
}

if (process.env.NODE_ENV !== 'production') {
  AutoComplete.displayName = 'AutoComplete';
}

const TypedAutoComplete: TypedAutoCompleteComponent = (props: any) => {
  return <AutoComplete {...props} />;
};

export default TypedAutoComplete;
