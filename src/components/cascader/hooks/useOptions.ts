import * as React from 'react';
import type { DefaultOptionType } from '..';
import type { InternalFieldNames } from '../Cascader';
import { MultiValueType } from '../interface';
import useEntities, { type GetEntities } from './useEntities';

export default function useOptions(
  mergedFieldNames: InternalFieldNames,
  options?: DefaultOptionType[],
): [
  mergedOptions: DefaultOptionType[],
  getPathKeyEntities: GetEntities,
  getValueByKeyPath: (pathKeys: React.Key[]) => MultiValueType,
] {
  const mergedOptions = React.useMemo(() => options || [], [options]);

  // Only used in multiple mode, this fn will not call in single mode
  const getPathKeyEntities = useEntities(mergedOptions, mergedFieldNames);

  /** Convert path key back to value format */
  const getValueByKeyPath = React.useCallback(
    (pathKeys: React.Key[]): MultiValueType => {
      const keyPathEntities = getPathKeyEntities();

      return pathKeys.map((pathKey) => {
        const { nodes } = keyPathEntities[pathKey];

        return nodes.map((node) => (node as Record<string, any>)[mergedFieldNames.value]);
      });
    },
    [getPathKeyEntities, mergedFieldNames],
  );

  return [mergedOptions, getPathKeyEntities, getValueByKeyPath];
}
