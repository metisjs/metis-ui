import toArray from 'rc-util/lib/Children/toArray';
import * as React from 'react';
import { mergeSemanticCls } from '../_util/classNameUtils';
import type { ConfigConsumerProps } from '../config-provider';
import { ConfigContext } from '../config-provider';
import type { RefSelectProps, SelectProps } from '../select';
import Select from '../select';
import { BaseOptionType } from '../select/interface';

export interface AutoCompleteProps<
  OptionType extends BaseOptionType = BaseOptionType,
  OptionInValueType extends boolean = false,
  PaginationType extends boolean = false,
> extends Omit<
    SelectProps<OptionType, 'default', OptionInValueType, true, PaginationType>,
    'loading' | 'mode' | 'displayRender' | 'optionInValue' | 'showSearch'
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

if (process.env.NODE_ENV !== 'production') {
  AutoComplete.displayName = 'AutoComplete';
}

export default AutoComplete;
