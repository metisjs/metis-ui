import { useCallback } from 'react';
import { conductCheck } from '../../tree/utils/conductUtil';
import type { InternalFieldNames, InternalValueType } from '../Cascader';
import type {
  DefaultOptionType,
  DraftValueType,
  LabeledValueType,
  MultiValueType,
  ShowCheckedStrategy,
  SingleValueType,
} from '../interface';
import {
  isRawValues,
  toPathKey,
  toPathKeys,
  toRawValueCell,
  toRawValueCells,
} from '../utils/commonUtil';
import { formatStrategyValues } from '../utils/treeUtil';
import type { GetEntities } from './useEntities';

export default function useSelect(
  multiple: boolean,
  triggerChange: (nextValues: InternalValueType) => void,
  checkedValues: LabeledValueType[],
  halfCheckedValues: LabeledValueType[],
  missingCheckedValues: LabeledValueType[],
  fieldNames: InternalFieldNames,
  toLabeledValues: (draftValues: DraftValueType) => LabeledValueType[],
  getValueByKeyPath: (pathKeys: React.Key[]) => MultiValueType,
  getPathKeyEntities: GetEntities,
  showCheckedStrategy?: ShowCheckedStrategy,
) {
  const rawCheckedValues = toRawValueCells(checkedValues);
  const rawHalfCheckedValues = toRawValueCells(halfCheckedValues);
  const rawMissingCheckedValues = toRawValueCells(missingCheckedValues);

  const checkedPathKeys = toPathKeys(rawCheckedValues);
  const halfCheckedPathKeys = toPathKeys(rawHalfCheckedValues);
  const missingCheckedPathKeys = toPathKeys(rawMissingCheckedValues);

  const isCheckDisabled = useCallback(
    (node: DefaultOptionType) => !!node[fieldNames.disabled],
    [fieldNames],
  );

  return (value: SingleValueType | LabeledValueType) => {
    if (!multiple) {
      triggerChange(value);
    } else {
      const isRaw = isRawValues(value);
      const rawValueCell = isRaw ? value : toRawValueCell(value);

      const pathKey = toPathKey(rawValueCell);

      const existInChecked = checkedPathKeys.includes(pathKey);
      const existInMissing = missingCheckedPathKeys.includes(pathKey);

      // Do update
      let nextCheckedValues = checkedValues;
      let nextMissingValues = missingCheckedValues;

      if (existInMissing && !existInChecked) {
        // Missing value only do filter
        nextMissingValues = missingCheckedValues.filter(
          (valueCell) => toPathKey(toRawValueCell(valueCell)) !== pathKey,
        );
      } else {
        // Update checked key first
        const nextRawCheckedKeys = existInChecked
          ? checkedPathKeys.filter((key) => key !== pathKey)
          : [...checkedPathKeys, pathKey];

        const pathKeyEntities = getPathKeyEntities();

        // Conduction by selected or not
        let checkedKeys: React.Key[];
        if (existInChecked) {
          ({ checkedKeys } = conductCheck(
            nextRawCheckedKeys,
            { checked: false, halfCheckedKeys: halfCheckedPathKeys },
            pathKeyEntities,
            isCheckDisabled,
          ));
        } else {
          ({ checkedKeys } = conductCheck(
            nextRawCheckedKeys,
            true,
            pathKeyEntities,
            isCheckDisabled,
          ));
        }

        // Roll up to parent level keys
        nextCheckedValues = formatStrategyValues(
          toLabeledValues(getValueByKeyPath(checkedKeys)),
          getPathKeyEntities,
          showCheckedStrategy,
        );
      }

      triggerChange([...nextMissingValues, ...nextCheckedValues]);
    }
  };
}
