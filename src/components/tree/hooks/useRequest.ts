import type { Key } from 'react';
import { useState } from 'react';
import { useRequest } from 'ahooks';
import type { Options, Service } from 'ahooks/lib/useRequest/src/types';
import { upperFirst } from 'lodash';
import { useMergedState } from 'rc-util';
import type { RequestConfig } from '../../_util/type';
import type { RawValueType } from '../../select/interface';
import type { BasicDataNode, DataNode, EventDataNode, FilledFieldNames } from '../interface';
import { arrAdd, arrDel } from '../utils/miscUtil';

export const REQUEST_DEBOUNCE = 200;

export default function <TreeDataType extends BasicDataNode = DataNode>(
  fieldNames: FilledFieldNames,
  customizeLoadedKeys?: Key[],
  request?: RequestConfig<TreeDataType, any[]>,
  lazyLoad?: boolean | string,
  onLoad?: (
    loadedKeys: Key[],
    info: {
      event: 'load';
      node: EventDataNode<TreeDataType>;
    },
  ) => void,
) {
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
    ready,
    defaultParams = [],
    debounceWait = REQUEST_DEBOUNCE,
    ...restOptions
  } = requestOptions ?? {};

  const { run, runAsync, params, cancel } = useRequest(
    async (parentKey: RawValueType | undefined, ...defaultParams: any[]) => {
      let firstParam: Record<string, any> | undefined = undefined;
      if (lazyLoad) {
        firstParam = {
          [parentField]: parentKey,
        };
      }
      return await requestService!(...[firstParam, ...defaultParams].filter(Boolean));
    },
    {
      debounceWait,
      ready: !!requestService && ready,
      defaultParams: [undefined, ...defaultParams],
      refreshDeps: [lazyLoad, ...refreshDeps],
      refreshDepsAction: () => {
        cancel();
        run(...params);
      },
      onSuccess: (d, params) => {
        const [parentValue, ...defaultParams] = params;
        if (!lazyLoad || !parentValue) {
          setTreeData(d.data);
        }
        onSuccess?.(d, defaultParams);
      },
      onFinally: ([key, ...defaultParams], data) => {
        onFinally?.(defaultParams, data);
        setLoadingKeys((keys) => arrDel(keys, key));
      },
      ...restOptions,
    },
  );

  const loadData = async (data: TreeDataType, treeNode: EventDataNode<TreeDataType>) => {
    const key = data[fieldNames.key];

    if (loadedKeys.indexOf(key) !== -1 || loadingKeys.indexOf(key) !== -1) {
      return null;
    }

    setLoadingKeys((keys) => arrAdd(keys, key));

    // params 第一个参数为parent占位
    const [, ...defaultParams] = params;
    const { data: children } = await runAsync(key, ...defaultParams);
    // @ts-ignore
    data[fieldNames.children] = children;

    setTreeData((oriData) => [...oriData]);

    const newLoadedKeys = arrAdd(loadedKeys, key);
    setLoadedKeys(newLoadedKeys);

    onLoad?.(newLoadedKeys, {
      event: 'load',
      node: treeNode,
    });
  };

  return {
    treeData,
    loadingKeys,
    loadedKeys,
    loadData: request && lazyLoad ? loadData : undefined,
  };
}
