import { useMergedState } from 'rc-util';
import * as React from 'react';
import { RawValueType } from '../../select/interface';
import { DataEntity } from '../../tree/interface';
import { conductCheck } from '../../tree/utils/conductUtil';
import { InternalFieldNames, InternalValueType } from '../Cascader';
import { DraftValueType, LabeledValueType, MultiValueType } from '../interface';
import { isRawValue, toMultipleValue, toPathKeys } from '../utils/commonUtil';
import type { GetMissValues } from './useMissingValues';

export default function useValues(
  multiple: boolean,
  defaultValue: InternalValueType | undefined,
  value: InternalValueType | undefined,
  fieldNames: InternalFieldNames,
  getPathKeyEntities: () => Record<string, DataEntity>,
  getValueByKeyPath: (pathKeys: React.Key[]) => MultiValueType,
  getMissingValues: GetMissValues,
): [
  checkedValues: MultiValueType,
  halfCheckedValues: MultiValueType,
  missingCheckedValues: MultiValueType,
] {
  const convert2LabelValues = React.useCallback(
    (draftValues: DraftValueType): LabeledValueType[][] => {
      const valueList = toMultipleValue(draftValues);

      return valueList.map((values) => {
        const labeledValue: LabeledValueType[] = [];

        for (let i = 0; i < values.length; i++) {
          const val = values[i];
          let rawValue: RawValueType;
          let rawLabel: React.ReactNode;
          let rawKey: React.Key | undefined;
          let rawDisabled: boolean | undefined;
          let rawTitle: string = '';

          // Fill label & value
          if (isRawValue(val)) {
            rawValue = val;
          } else {
            rawKey = val.key;
            rawValue = val[mergedFieldNames.value] ?? val.value;
            rawLabel = val[mergedFieldNames.label] ?? val.label;
          }

          const option = valueOptions.get(rawValue);
          if (option) {
            if (rawLabel === undefined) rawLabel = option[mergedFieldNames.label];
            if (rawKey === undefined) rawKey = option?.key ?? rawValue;
            rawDisabled = option[mergedFieldNames.disabled];
            rawTitle = option?.title;
          }

          labeledValue[i] = {
            label: rawLabel,
            value: rawValue,
            key: rawKey ?? '',
            disabled: rawDisabled,
            title: rawTitle,
            option,
          };
        }

        return labeledValue;
      });
    },
    [fieldNames],
  );

  const [labeledValues, setLabeledValues] = useMergedState<
    DraftValueType | undefined,
    LabeledValueType[][]
  >(defaultValue, { value, postState: convert2LabelValues });

  // Fill `rawValues` with checked conduction values
  return React.useMemo(() => {
    const [existValues, missingValues] = getMissingValues(rawValues);

    if (!multiple || !rawValues.length) {
      return [existValues, [], missingValues];
    }

    const keyPathValues = toPathKeys(existValues);
    const keyPathEntities = getPathKeyEntities();

    const { checkedKeys, halfCheckedKeys } = conductCheck(keyPathValues, true, keyPathEntities);

    // Convert key back to value cells
    return [getValueByKeyPath(checkedKeys), getValueByKeyPath(halfCheckedKeys), missingValues];
  }, [multiple, rawValues, getPathKeyEntities, getValueByKeyPath, getMissingValues]);
}
