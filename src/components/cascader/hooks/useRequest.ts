import { useCallback, useState } from 'react';
import { useRequest } from 'ahooks';
import type { Options, Service } from 'ahooks/lib/useRequest/src/types';
import { upperFirst } from 'lodash';
import type { RawValueType, RequestConfig } from '../../select/interface';
import type { InternalFieldNames } from '../Cascader';
import type { CascaderProps, DefaultOptionType } from '../interface';
import { doFilter } from './useFilterOptions';

export const REQUEST_DEBOUNCE = 200;

export default function <TData extends DefaultOptionType>(
  fieldNames: InternalFieldNames,
  request?: RequestConfig<TData, any[]>,
  showSearch?: boolean,
  searchValue?: string,
  optionFilterProp?: string,
  lazyLoad?: boolean | string,
  filterOption?: CascaderProps['filterOption'],
  filterRender?: CascaderProps['filterRender'],
  filterSort?: CascaderProps['filterSort'],
  changeOnSelect?: boolean,
) {
  const parentField =
    typeof lazyLoad === 'string' ? lazyLoad : `parent${upperFirst(fieldNames.value)}`;

  const [options, setOptions] = useState<TData[]>([]);
  const [searchOptions, setSearchOptions] = useState<TData[] | null>(null);
  const [lazyLoading, setLazyLoading] = useState(false);

  let requestService: Service<{ data: TData[] }, any[]> | undefined = undefined;
  let requestOptions: Options<{ data: TData[] }, any[]> | undefined = undefined;
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

  const { loading, run, runAsync, params, cancel } = useRequest(
    async (parentValue: RawValueType | undefined, ...defaultParams: any[]) => {
      let firstParam: Record<string, any> | undefined = undefined;
      if (showSearch) {
        firstParam = {
          filters: { [optionFilterProp ?? fieldNames.label]: searchValue?.trim() || undefined },
        };
      }

      if (lazyLoad) {
        firstParam = {
          ...firstParam,
          [parentField]: parentValue,
        };
      }
      return await requestService!(...[firstParam, ...defaultParams].filter(Boolean));
    },
    {
      debounceWait,
      ready: !!requestService && ready,
      defaultParams: [undefined, ...defaultParams],
      refreshDeps: [showSearch, searchValue, lazyLoad, optionFilterProp, ...refreshDeps],
      refreshDepsAction: () => {
        cancel();
        run(...params);
      },
      onSuccess: (d, params) => {
        const [parentValue, ...defaultParams] = params;
        if (!lazyLoad || !parentValue) {
          setOptions(d.data);
        }
        if (searchValue) {
          setSearchOptions(() =>
            doFilter<TData>(
              d.data,
              fieldNames,
              searchValue,
              filterOption,
              filterRender,
              filterSort,
              optionFilterProp,
              changeOnSelect,
            ),
          );
        } else {
          setSearchOptions(null);
        }
        onSuccess?.(d, defaultParams);
      },
      onFinally: ([, ...defaultParams], data) => {
        setLazyLoading(false);
        onFinally?.(defaultParams, data);
      },
      ...restOptions,
    },
  );

  const loadData = useCallback(
    async (selectedOption: TData) => {
      setLazyLoading(true);

      // params 第一个参数为parent占位
      const [, ...defaultParams] = params;
      const parentValue = selectedOption[fieldNames.value];
      const { data: children } = await runAsync(parentValue, ...defaultParams);
      // @ts-ignore
      selectedOption[fieldNames.children] = children;

      setOptions((oriOptions) => [...oriOptions]);
    },
    [run, params, fieldNames],
  );

  return {
    options,
    searchOptions,
    loading: loading && !lazyLoading,
    loadData,
  };
}
