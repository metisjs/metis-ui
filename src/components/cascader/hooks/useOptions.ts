import * as React from 'react';
import type { SafeKey } from '@util/type';
import type { DefaultOptionType } from '..';
import type { InternalFieldNames } from '../Cascader';
import type { MultiValueType, SingleValueType } from '../interface';
import { toPathOptions } from '../utils/treeUtil';
import type { GetEntities } from './useEntities';
import useEntities from './useEntities';

export default function useOptions(
  fieldNames: InternalFieldNames,
  options?: DefaultOptionType[],
): [
  mergedOptions: DefaultOptionType[],
  getPathKeyEntities: GetEntities,
  getValueByKeyPath: (pathKeys: React.Key[]) => MultiValueType,
  getPathOptions: (valueCells: SingleValueType) => ReturnType<typeof toPathOptions>,
] {
  const mergedOptions = React.useMemo(() => options || [], [options]);

  // Only used in multiple mode, this fn will not call in single mode
  const getPathKeyEntities = useEntities(mergedOptions, fieldNames);

  /** Convert path key back to value format */
  const getValueByKeyPath = React.useCallback(
    (pathKeys: SafeKey[]): MultiValueType => {
      const keyPathEntities = getPathKeyEntities();

      return pathKeys.map((pathKey) => {
        const { nodes } = keyPathEntities[pathKey];

        return nodes.map((node) => (node as Record<string, any>)[fieldNames.value]);
      });
    },
    [getPathKeyEntities, fieldNames],
  );

  const getPathOptions = React.useCallback(
    (valueCells: SingleValueType) => toPathOptions(valueCells, mergedOptions, fieldNames),
    [mergedOptions, fieldNames],
  );

  return [mergedOptions, getPathKeyEntities, getValueByKeyPath, getPathOptions];
}
