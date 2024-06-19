import { useRequest, useUpdateEffect } from 'ahooks';
import { useMemo, useState } from 'react';
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

  const { defaultParams = [], ...restOptions } = requestOptions ?? {};

  const [current] = useState(1);

  const params = useMemo(() => {
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

    return [firstParam, ...defaultParams].filter(Boolean);
  }, [searchValue, current]);

  const { data, loading, runAsync } = useRequest(requestService, {
    defaultParams: params,
    ...restOptions,
  });
  const { data: options = [] } = data || {};

  useUpdateEffect(() => {
    runAsync(...params);
  }, [params]);

  return [options, loading];
}
