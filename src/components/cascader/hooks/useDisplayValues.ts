import * as React from 'react';
import type { InternalFieldNames } from '../Cascader';
import type { CascaderProps, LabeledValueType } from '../interface';
import { toPathKey, toRawValueCell } from '../utils/commonUtil';

export default (
  values: LabeledValueType[],
  fieldNames: InternalFieldNames,
  multiple: boolean,
  displayRender: CascaderProps['displayRender'],
) => {
  return React.useMemo(() => {
    const mergedDisplayRender =
      displayRender ||
      // Default displayRender
      ((labels) => {
        const mergedLabels: React.ReactNode[] = multiple ? labels.slice(-1) : labels;
        const SPLIT = ' / ';

        if (mergedLabels.every((label) => ['string', 'number'].includes(typeof label))) {
          return mergedLabels.join(SPLIT);
        }

        // If exist non-string value, use ReactNode instead
        return mergedLabels.reduce((list: React.ReactNode[], label, index) => {
          const keyedLabel = React.isValidElement(label)
            ? React.cloneElement(label, { key: index })
            : label;

          if (index === 0) {
            return [keyedLabel];
          }
          return [...list, SPLIT, keyedLabel];
        }, []);
      });

    return values.map((item) => {
      const label = mergedDisplayRender(
        item.map(({ label }) => label),
        item.map(({ option }) => option),
      );

      const valueCells = toRawValueCell(item);
      const value = toPathKey(valueCells);

      return {
        label,
        value,
        key: value,
        valueCells,
        disabled: item[item.length - 1]?.disabled,
      };
    });
  }, [values, fieldNames, displayRender, multiple]);
};
