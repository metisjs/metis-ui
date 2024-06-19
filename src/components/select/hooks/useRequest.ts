import { useRequest } from 'ahooks';
import { useState } from 'react';
import { BaseOptionType, RequestConfig } from '../interface';

const PAGE_SIZE = 30;

export default function <TData extends BaseOptionType>(
  request?: RequestConfig<TData, any[]>,
  showSearch?: boolean,
  searchValue?: string,
  optionFilterProp?: string,
  pagination?: boolean,
): [TData[], boolean] {
  let requestService: any = () => {};
  let requestOptions = undefined;
  if (typeof request === 'function') {
    requestService = request;
  } else if (request) {
    requestService = request.service;
    requestOptions = request.options;
  }
  const { refreshDeps = [], refreshDepsAction, ...restOptions } = requestOptions ?? {};

  const [current, setCurrent] = useState(1);

  const { data, loading } = useRequest(
    async (...params) => {
      let firstParam: Record<string, any> | undefined = undefined;
      if (showSearch) {
        firstParam = {
          filters: { [optionFilterProp ?? 'keyword']: searchValue?.trim() || undefined },
        };
      }

      if (pagination) {
        firstParam = {
          ...firstParam,
          current,
          pageSize: PAGE_SIZE,
        };
      }

      return await requestService(...[firstParam, ...params].filter(Boolean));
    },
    {
      refreshDeps: [searchValue, current, ...refreshDeps],
      refreshDepsAction: () => {
        refreshDepsAction?.();
        setCurrent(1);
      },
      ...restOptions,
    },
  );
  const { data: options = [] } = data || {};

  return [options, loading];
}
