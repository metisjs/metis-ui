import * as React from 'react';
import type { DataEntity, DataNode } from '../../tree/interface';
import { convertDataToEntities } from '../../tree/utils/treeUtil';
import type { InternalFieldNames } from '../Cascader';
import type { DefaultOptionType } from '../interface';
import { VALUE_SPLIT } from '../utils/commonUtil';

export interface OptionsInfo {
  keyEntities: Record<string, DataEntity>;
  pathKeyEntities: Record<string, DataEntity>;
}

export type GetEntities = () => OptionsInfo['pathKeyEntities'];

/** Lazy parse options data into conduct-able info to avoid perf issue in single mode */
export default (options: DefaultOptionType[], fieldNames: InternalFieldNames) => {
  const cacheRef = React.useRef<{
    options: DefaultOptionType[];
    info: OptionsInfo;
  }>({
    options: [],
    info: { keyEntities: {}, pathKeyEntities: {} },
  });

  const getEntities: GetEntities = React.useCallback(() => {
    if (cacheRef.current.options !== options) {
      cacheRef.current.options = options;
      cacheRef.current.info = convertDataToEntities(options as DataNode[], {
        fieldNames: fieldNames as any,
        initWrapper: (wrapper) => ({
          ...wrapper,
          pathKeyEntities: {},
        }),
        processEntity: (entity, wrapper) => {
          const pathKey = (entity.nodes as DefaultOptionType[])
            .map((node) => node[fieldNames.value])
            .join(VALUE_SPLIT);

          (wrapper as unknown as OptionsInfo).pathKeyEntities[pathKey] = entity;

          // Overwrite origin key.
          // this is very hack but we need let conduct logic work with connect path
          entity.key = pathKey;
        },
      }) as any;
    }

    return cacheRef.current.info.pathKeyEntities;
  }, [fieldNames, options]);

  return getEntities;
};
