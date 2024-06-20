import * as React from 'react';
import type { BaseOptionType, FieldNames, SelectProps } from '../interface';
import { toArray } from '../utils/commonUtil';
import { getFieldValue } from '../utils/valueUtil';

function includes(test: React.ReactNode, search: string) {
  return toArray(test).join('').toUpperCase().includes(search);
}

export default (
  options: BaseOptionType[] = [],
  fieldNames: Required<FieldNames<BaseOptionType>>,
  searchValue?: string,
  filterOption?: SelectProps['filterOption'],
  optionFilterProp?: string,
  useRequest?: boolean,
) =>
  React.useMemo(() => {
    if (!searchValue || filterOption === false || useRequest) {
      return options;
    }

    const { options: fieldOptions, value: fieldValue, groupLabel: fieldGrpLabel } = fieldNames;
    const filteredOptions: BaseOptionType[] = [];

    const customizeFilter = typeof filterOption === 'function';

    const upperSearch = searchValue.toUpperCase();
    const filterFunc = customizeFilter
      ? filterOption
      : (_: string, option: BaseOptionType) => {
          // Use provided `optionFilterProp`
          if (optionFilterProp) {
            return includes(option[optionFilterProp], upperSearch);
          }

          // Auto select `label` or `value` by option type
          if (option[fieldOptions]) {
            // hack `fieldLabel` since `OptionGroup` children is not `label`
            return includes(getFieldValue(option, fieldGrpLabel), upperSearch);
          }

          return includes(getFieldValue(option, fieldValue), upperSearch);
        };

    options.forEach((item) => {
      // Group should check child options
      const itemOptions = item[fieldOptions];
      if (itemOptions) {
        // Check group first
        const matchGroup = filterFunc(searchValue, item);
        if (matchGroup) {
          filteredOptions.push(item);
        } else {
          // Check option
          const subOptions = itemOptions.filter((subItem: BaseOptionType) =>
            filterFunc(searchValue, subItem),
          );
          if (subOptions.length) {
            filteredOptions.push({
              ...item,
              [fieldOptions]: subOptions,
            });
          }
        }

        return;
      }

      if (filterFunc(searchValue, item)) {
        filteredOptions.push(item);
      }
    });

    return filteredOptions;
  }, [options, filterOption, optionFilterProp, searchValue, fieldNames]);
