import * as React from 'react';
import { toPathOptions } from '../utils/treeUtil';
import { DefaultOptionType, MultiValueType } from '../interface';
import { InternalFieldNames } from '../Cascader';

export type GetMissValues = ReturnType<typeof useMissingValues>;

export default function useMissingValues(
  options: DefaultOptionType[],
  fieldNames: InternalFieldNames,
) {
  return React.useCallback(
    (rawValues: MultiValueType): [MultiValueType, MultiValueType] => {
      const missingValues: MultiValueType = [];
      const existsValues: MultiValueType = [];

      rawValues.forEach((valueCell) => {
        const pathOptions = toPathOptions(valueCell, options, fieldNames);
        if (pathOptions.every((opt) => opt.option)) {
          existsValues.push(valueCell);
        } else {
          missingValues.push(valueCell);
        }
      });

      return [existsValues, missingValues];
    },
    [options, fieldNames],
  );
}
