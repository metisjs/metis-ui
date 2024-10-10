import { useCallback, useContext, useState } from 'react';
import { useRequest } from 'ahooks';
import type { Options, Service } from 'ahooks/lib/useRequest/src/types';
import { upperFirst } from 'lodash';
import type { RequestConfig } from '../../_util/type';
import { ConfigContext } from '../../config-provider';
import type { RawValueType } from '../../select/interface';
import type { InternalFieldNames } from '../Cascader';
import type { CascaderProps, DefaultOptionType } from '../interface';
import { doFilter } from './useFilterOptions';

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
  const { request: contextRequestOptions } = useContext(ConfigContext);

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
    onBefore,
    onError,
    ready,
    defaultParams = [],
    ...restOptions
  } = { ...contextRequestOptions, ...requestOptions };

  const { loading, run, params, cancel } = useRequest(
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
      ready: !!requestService && ready,
      defaultParams: [undefined, ...defaultParams],
      refreshDeps: [showSearch, searchValue, lazyLoad, optionFilterProp, ...refreshDeps],
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
      onError: (e, params) => {
        const [, ...defaultParams] = params;
        onError?.(e, defaultParams);
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

      try {
        onBefore?.(defaultParams);

        const parentValue = selectedOption[fieldNames.value];

        const result = await requestService!(
          {
            [parentField]: parentValue,
          },
          ...defaultParams,
        );
        onSuccess?.(result, defaultParams);

        const { data: children } = result;
        // @ts-ignore
        selectedOption[fieldNames.children] = children;

        setOptions((oriOptions) => [...oriOptions]);
        setLazyLoading(false);
      } catch (error) {
        setLazyLoading(false);
        onFinally?.(defaultParams);
        onError?.(error, defaultParams);
        throw error;
      }
    },
    [params, fieldNames, requestService, onFinally, onBefore, onError],
  );

  return {
    options,
    searchOptions,
    loading: loading && !lazyLoading,
    loadData,
  };
}
