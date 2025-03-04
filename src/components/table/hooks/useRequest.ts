import { useContext, useEffect, useMemo, useState } from 'react';
import type { AnyObject, RequestConfig } from '@util/type';
import { devUseWarning } from '@util/warning';
import { useRequest } from 'ahooks';
import type { Options, Service } from 'ahooks/lib/useRequest/src/types';
import { ConfigContext } from '../../config-provider';
import type { FilterValue, SorterResult, TablePaginationConfig } from '../interface';
import type { FilterState } from './useFilter';
import { DEFAULT_PAGE_SIZE } from './usePagination';
import type { SortState } from './useSorter';

type RequestProps<RecordType extends AnyObject> = {
  dataSource: readonly RecordType[];
  filters: Record<string, FilterValue | null>;
  filterStates: FilterState<RecordType>[];
  sorter: SorterResult<RecordType> | SorterResult<RecordType>[];
  sortStates: SortState<RecordType>[];
  getSortData: (
    data: readonly RecordType[],
    sortStates: SortState<RecordType>[],
    childrenColumnName: keyof RecordType,
  ) => RecordType[];
  getFilterData: (
    data: RecordType[],
    filterStates: FilterState<RecordType>[],
    childrenColumnName: keyof RecordType,
  ) => RecordType[];
  childrenColumnName: keyof RecordType;
  pagination: TablePaginationConfig;
  request?: RequestConfig<RecordType, any[]>;
};

export default function <RecordType extends AnyObject>({
  request,
  dataSource,
  filters,
  filterStates,
  sorter,
  sortStates,
  getSortData,
  getFilterData,
  childrenColumnName,
  pagination,
}: RequestProps<RecordType>) {
  const warning = devUseWarning('Table');

  const { request: contextRequestOptions } = useContext(ConfigContext);

  const [finalData, setFinalData] = useState<RecordType[]>(dataSource as RecordType[]);
  const [total, setTotal] = useState(() => (request ? -1 : dataSource.length));

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
        setFinalData(d.data);
        setTotal(d.total ?? d.data.length);
        onSuccess?.(d, params);
      },
      ...restOptions,
    },
  );

  useEffect(() => {
    if (!request) {
      setFinalData(dataSource as RecordType[]);
      setTotal(dataSource.length);
    }
  }, [dataSource]);

  const [mergedDataSource, mergedTotal] = useMemo<[RecordType[], number]>(() => {
    if (!!request && isPaginationActive) {
      return [finalData, total];
    }

    const sortedData = getSortData(finalData, sortStates, childrenColumnName);
    const mergedData = getFilterData(sortedData, filterStates, childrenColumnName);
    const mergedTotal = mergedData.length;

    if (!isPaginationActive) {
      return [mergedData, mergedTotal];
    }

    const { current = 1, pageSize = DEFAULT_PAGE_SIZE } = pagination;
    warning(current > 0, 'usage', '`current` should be positive number.');

    // Dynamic table data
    if (mergedData.length < mergedTotal) {
      if (mergedData.length > pageSize) {
        warning(
          false,
          'usage',
          '`dataSource` length is less than `pagination.total` but large than `pagination.pageSize`. Please make sure your config correct data with async mode.',
        );
        return [mergedData.slice((current - 1) * pageSize, current * pageSize), mergedTotal];
      }
      return [mergedData, mergedTotal];
    }

    return [mergedData.slice((current - 1) * pageSize, current * pageSize), mergedTotal];
  }, [
    !!request,
    finalData,
    total,
    pagination,
    sortStates,
    filterStates,
    childrenColumnName,
    isPaginationActive,
    getSortData,
    getFilterData,
  ]);

  return [loading, mergedDataSource, mergedTotal, setFinalData] as const;
}
