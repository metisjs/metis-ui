import { useContext } from 'react';
import type { AnyObject, RequestConfig } from '@util/type';
import { useRequest } from 'ahooks';
import type { Options, Service } from 'ahooks/lib/useRequest/src/types';
import { ConfigContext } from '../../config-provider';
import type { FilterValue, SorterResult, TablePaginationConfig } from '../interface';

export default function <RecordType extends AnyObject>(
  filters: Record<string, FilterValue | null>,
  sorter: SorterResult<RecordType> | SorterResult<RecordType>[],
  pagination: TablePaginationConfig | false,
  request?: RequestConfig<RecordType, any[]>,
) {
  const { request: contextRequestOptions } = useContext(ConfigContext);

  let requestService: Service<{ data: RecordType[]; total?: number }, any[]> | undefined =
    undefined;
  let requestOptions: Options<{ data: RecordType[]; total?: number }, any[]> | undefined =
    undefined;
  if (typeof request === 'function') {
    requestService = request;
  } else if (request) {
    requestService = request.service;
    requestOptions = request.options;
  }
  const {
    refreshDeps = [],
    ready,
    ...restOptions
  } = { ...contextRequestOptions, ...requestOptions };

  const { loading, data } = useRequest(
    async (...defaultParams: any[]) => {
      let firstParam: Record<string, any> | undefined = undefined;

      if (pagination) {
        firstParam = {
          filters,
          sorter,

          current: pagination.current,
          pageSize: pagination.pageSize,
        };
      }
      return await requestService!(...[firstParam, ...defaultParams].filter(Boolean));
    },
    {
      ready: !!requestService && ready,
      refreshDeps: [
        pagination === false ? -1 : pagination.current,
        pagination === false ? -1 : pagination.pageSize,
        ...refreshDeps,
      ],
      ...restOptions,
    },
  );

  return [loading, data.data, data.total ?? -1] as const;
}
