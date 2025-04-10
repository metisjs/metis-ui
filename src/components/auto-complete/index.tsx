import * as React from 'react';
import toArray from '@rc-component/util/es/Children/toArray';
import { mergeSemanticCls } from '@util/classNameUtils';
import type { ConfigConsumerProps } from '../config-provider';
import { ConfigContext } from '../config-provider';
import type { SelectProps, SelectRef } from '../select';
import Select from '../select';
import type { BaseOptionType, RawValueType } from '../select/interface';

export interface AutoCompleteProps<
  ValueType extends RawValueType = RawValueType,
  OptionType extends BaseOptionType = BaseOptionType,
  LazyLoadType extends boolean = false,
> extends Omit<
    SelectProps<ValueType, OptionType, 'default', true, LazyLoadType>,
    'loading' | 'mode' | 'displayRender' | 'showSearch'
  > {
  children?: React.ReactNode;
}

const AutoComplete = React.forwardRef((props: AutoCompleteProps, ref: React.Ref<SelectRef>) => {
  const { prefixCls: customizePrefixCls, children, className } = props;
  const childNodes: React.ReactElement[] = toArray(children);

  // ============================= Input =============================
  let customizeInput: React.ReactElement | undefined;

  if (childNodes.length === 1 && React.isValidElement(childNodes[0])) {
    [customizeInput] = childNodes;
  }

  const getInputElement = customizeInput ? (): React.ReactElement => customizeInput! : undefined;

  const { getPrefixCls } = React.useContext<ConfigConsumerProps>(ConfigContext);
  const prefixCls = getPrefixCls('select-auto-complete', customizePrefixCls);

  return (
    // @ts-ignore
    <Select
      ref={ref}
      suffixIcon={null}
      {...props}
      prefixCls={prefixCls}
      combobox
      getInputElement={getInputElement}
      className={mergeSemanticCls({ option: 'pr-3' }, className)}
    ></Select>
  );
}) as unknown as (<
  ValueType extends RawValueType = RawValueType,
  OptionType extends BaseOptionType = BaseOptionType,
  LazyLoadType extends boolean = false,
>(
  props: AutoCompleteProps<ValueType, OptionType, LazyLoadType> & {
    ref?: React.Ref<SelectRef>;
  },
) => React.ReactElement) & {
  displayName?: string;
};

if (process.env.NODE_ENV !== 'production') {
  AutoComplete.displayName = 'AutoComplete';
}

export default AutoComplete;
