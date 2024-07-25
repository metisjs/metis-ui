import { conductCheck } from 'metis-ui/es/tree/utils/conductUtil';
import * as React from 'react';
import { DataEntity } from '../../tree/interface';
import { MultiValueType } from '../interface';
import { toPathKeys } from '../utils/commonUtil';
import type { GetMissValues } from './useMissingValues';

export default function useValues(
  multiple: boolean,
  rawValues: MultiValueType,
  getPathKeyEntities: () => Record<string, DataEntity>,
  getValueByKeyPath: (pathKeys: React.Key[]) => MultiValueType,
  getMissingValues: GetMissValues,
): [
  checkedValues: MultiValueType,
  halfCheckedValues: MultiValueType,
  missingCheckedValues: MultiValueType,
] {
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
