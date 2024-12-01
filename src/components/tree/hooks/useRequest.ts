import type { Key } from 'react';
import { useContext, useState } from 'react';
import type { RequestConfig } from '@util/type';
import { useRequest } from 'ahooks';
import type { Options, Service } from 'ahooks/lib/useRequest/src/types';
import { upperFirst } from 'lodash';
import { useMergedState } from 'rc-util';
import { ConfigContext } from '../../config-provider';
import type { RawValueType } from '../../select/interface';
import type { BasicDataNode, DataNode, FilledFieldNames } from '../interface';
import { arrAdd, arrDel } from '../utils/miscUtil';

export default function <TreeDataType extends BasicDataNode = DataNode>(
  fieldNames: FilledFieldNames,
  customizeLoadedKeys?: Key[],
  request?: RequestConfig<TreeDataType, any[]>,
  lazyLoad?: boolean | string,
) {
  const { request: contextRequestOptions } = useContext(ConfigContext);

  const parentField =
    typeof lazyLoad === 'string' ? lazyLoad : `parent${upperFirst(fieldNames.key)}`;

  const [treeData, setTreeData] = useState<TreeDataType[]>([]);
  const [loadingKeys, setLoadingKeys] = useState<Key[]>([]);
  const [loadedKeys, setLoadedKeys] = useMergedState([], {
    value: customizeLoadedKeys,
  });

  let requestService: Service<{ data: TreeDataType[] }, any[]> | undefined = undefined;
  let requestOptions: Options<{ data: TreeDataType[] }, any[]> | undefined = undefined;
  if (typeof request === 'function') {
    requestService = request;
  } else if (request) {
    requestService = request.service;
    requestOptions = request.options;
  }
  const {
    refreshDeps = [],
    onFinally,
    onSuccess,
    onBefore,
    onError,
    ready,
    defaultParams = [],
    ...restOptions
  } = { ...contextRequestOptions, ...requestOptions };

  const { loading, run, params, cancel } = useRequest(
    (parentKey: RawValueType | undefined, ...defaultParams: any[]) => {
      let firstParam: Record<string, any> | undefined = undefined;
      if (lazyLoad) {
        firstParam = {
          [parentField]: parentKey,
        };
      }
      return requestService!(...[firstParam, ...defaultParams].filter(Boolean));
    },
    {
      ready: !!requestService && ready,
      defaultParams: [undefined, ...defaultParams],
      refreshDeps: [lazyLoad, ...refreshDeps],
      refreshDepsAction: () => {
        cancel();
        run(...params);
      },
      onBefore: (params) => {
        const [, ...defaultParams] = params;
        return onBefore?.(defaultParams);
      },
      onSuccess: (d, params) => {
        const [parentValue, ...defaultParams] = params;
        if (!lazyLoad || !parentValue) {
          setTreeData(d.data);
        }
        onSuccess?.(d, defaultParams);
      },
      onError: (e, params) => {
        const [, ...defaultParams] = params;
        onError?.(e, defaultParams);
      },
      onFinally: ([key, ...defaultParams], data) => {
        onFinally?.(defaultParams, data);
        setLoadingKeys((keys) => arrDel(keys, key));
      },
      ...restOptions,
    },
  );

  const loadData = async (data: TreeDataType) => {
    const key = data[fieldNames.key];

    if (loadedKeys.indexOf(key) !== -1 || loadingKeys.indexOf(key) !== -1) {
      return null;
    }

    setLoadingKeys((keys) => arrAdd(keys, key));

    // params 第一个参数为parent占位
    const [, ...defaultParams] = params;
    try {
      onBefore?.(defaultParams);

      const result = await requestService!(
        {
          [parentField]: key,
        },
        ...defaultParams,
      );

      onSuccess?.(result, defaultParams);

      const { data: children } = result;
      // @ts-ignore
      data[fieldNames.children] = children;

      setTreeData((oriData) => [...oriData]);

      setLoadedKeys((keys) => arrAdd(keys, key));
      setLoadingKeys((keys) => arrDel(keys, key));

      onFinally?.(defaultParams, result);
    } catch (error) {
      setLoadingKeys((keys) => arrDel(keys, key));
      onFinally?.(defaultParams);
      onError?.(error, defaultParams);
      throw error;
    }
  };

  return {
    loading,
    treeData,
    loadingKeys,
    loadedKeys,
    loadData: request && lazyLoad ? loadData : undefined,
  };
}
