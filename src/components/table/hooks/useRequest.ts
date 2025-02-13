import { useContext, useState } from 'react';
import type { AnyObject, RequestConfig } from '@util/type';
import { useRequest } from 'ahooks';
import type { Options, Service } from 'ahooks/lib/useRequest/src/types';
import { ConfigContext } from '../../config-provider';
import type { FilterValue, SorterResult, TablePaginationConfig } from '../interface';
import type { FilterState } from './useFilter';
import type { SortState } from './useSorter';

export default function <RecordType extends AnyObject>(
  filters: Record<string, FilterValue | null>,
  filterStates: FilterState<RecordType>[],
  sorter: SorterResult<RecordType> | SorterResult<RecordType>[],
  sortStates: SortState<RecordType>[],
  getSortData: (
    data: readonly RecordType[],
    sortStates: SortState<RecordType>[],
    childrenColumnName: keyof RecordType,
  ) => RecordType[],
  getFilterData: (
    data: RecordType[],
    filterStates: FilterState<RecordType>[],
    childrenColumnName: keyof RecordType,
  ) => RecordType[],
  childrenColumnName: keyof RecordType,
  pagination: TablePaginationConfig,
  request?: RequestConfig<RecordType, any[]>,
): [boolean, RecordType[], number] {
  const { request: contextRequestOptions } = useContext(ConfigContext);

  const [finalData, setFinalData] = useState<{ data: RecordType[]; total: number }>({
    data: [],
    total: -1,
  });

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
    onSuccess,
    ready,
    ...restOptions
  } = { ...contextRequestOptions, ...requestOptions };

  const isPaginationActive = Object.keys(pagination).length > 0;

  const { loading } = useRequest(
    async (...defaultParams: any[]) => {
      let firstParam: Record<string, any> | undefined = undefined;

      if (isPaginationActive) {
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
        pagination.current,
        pagination.pageSize,
        filterStates,
        sortStates,
        ...refreshDeps,
      ],
      onSuccess: (d, params) => {
        if (isPaginationActive) {
          setFinalData(d);
        } else {
          const sortedData = getSortData(d.data, sortStates, childrenColumnName);
          const mergedData = getFilterData(sortedData, filterStates, childrenColumnName);
          setFinalData({ data: mergedData, total: d.length });
        }
        onSuccess?.(d, params);
      },
      ...restOptions,
    },
  );

  return [loading, finalData.data, finalData.total];
}
