import * as React from 'react';
import type { BaseOptionType, FieldNames, RawValueType } from '../interface';
import { getFieldValue } from '../utils/valueUtil';

export default function useOptions<OptionType extends BaseOptionType = BaseOptionType>(
  options: OptionType[] | undefined,
  fieldNames: FieldNames<OptionType>,
  optionFilterProp?: string,
  optionLabelProp?: string,
) {
  return React.useMemo(() => {
    const valueOptions = new Map<RawValueType, OptionType>();
    const labelOptions = new Map<React.ReactNode, OptionType>();

    const setLabelOptions = (
      labelOptionsMap: Map<React.ReactNode, OptionType>,
      option: OptionType,
      key?: string,
    ) => {
      if (key && typeof key === 'string') {
        labelOptionsMap.set(option[key], option);
      }
    };

    function dig(optionList: OptionType[], isChildren = false) {
      // for loop to speed up collection speed
      for (let i = 0; i < optionList.length; i += 1) {
        const option = optionList[i];
        if (!option[fieldNames.options!] || isChildren) {
          valueOptions.set(getFieldValue(option, fieldNames.value), option);
          labelOptions.set(getFieldValue(option, fieldNames.label), option);
          setLabelOptions(labelOptions, option, optionFilterProp);
          setLabelOptions(labelOptions, option, optionLabelProp);
        } else {
          dig(option[fieldNames.options!], true);
        }
      }
    }
    dig(options!);

    return {
      options: options!,
      valueOptions,
      labelOptions,
    };
  }, [options, fieldNames, optionFilterProp, optionLabelProp]);
}
