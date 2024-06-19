import { useRequest, useUpdateEffect } from 'ahooks';
import { BaseOptionType, RequestConfig } from '../interface';

export default function <TData extends BaseOptionType>(
  request?: RequestConfig<TData, any[]>,
  showSearch?: boolean,
  searchValue?: string,
  optionFilterProp?: string,
  // pagination?: boolean,
): [TData[], boolean] {
  let requestService: any = () => {};
  let requestOptions = undefined;
  if (typeof request === 'function') {
    requestService = request;
  } else if (request) {
    requestService = request.service;
    requestOptions = request.options;
  }

  const { defaultParams: rawDefaultParams = [], ...restOptions } = requestOptions ?? {};
  let defaultParams = [...rawDefaultParams];
  if (showSearch) {
    defaultParams.unshift({
      filters: { [optionFilterProp ?? 'keyword']: searchValue?.trim() || undefined },
    });
  }

  const { data, loading, runAsync } = useRequest(requestService, {
    defaultParams,
    ...restOptions,
  });
  const { data: options = [] } = data || {};

  useUpdateEffect(() => {
    runAsync(...defaultParams);
  }, [searchValue]);

  return [options, loading];
}
