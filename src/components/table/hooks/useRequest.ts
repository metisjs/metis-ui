import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { AnyObject, RequestConfig } from '@util/type';
import { devUseWarning } from '@util/warning';
import { useRequest } from 'ahooks';
import type { Options, Service } from 'ahooks/lib/useRequest/src/types';
import { useEvent } from 'rc-util';
import { ConfigContext } from '../../config-provider';
import { useLocale } from '../../locale';
import type { FilterValue, SorterResult, TablePaginationConfig } from '../interface';
import { getFilterData } from '../utils/filterUtil';
import type { FilterState } from './useFilter';
import { DEFAULT_PAGE_SIZE } from './usePagination';
import { getSortData, type SortState } from './useSorter';

type RequestProps<RecordType extends AnyObject> = {
  dataSource: readonly RecordType[];
  filters: Record<string, FilterValue | undefined>;
  filterStates: FilterState<RecordType>[];
  sorter: SorterResult<RecordType> | SorterResult<RecordType>[];
  sortStates: SortState<RecordType>[];
  childrenColumnName: keyof RecordType;
  pagination: TablePaginationConfig;
  request?: RequestConfig<RecordType, any[]>;
  resetPagination: () => void;
};

export default function <RecordType extends AnyObject>({
  request,
  dataSource,
  filters,
  filterStates,
  sorter,
  sortStates,
  childrenColumnName,
  pagination,
  resetPagination,
}: RequestProps<RecordType>) {
  const warning = devUseWarning('Table');

  const [datePickerLocale] = useLocale('DatePicker');
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

  const { loading, refresh, cancel } = useRequest(
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
  }, [JSON.stringify(dataSource)]);

  const [mergedDataSource, pageData, mergedTotal] = useMemo<
    [RecordType[], RecordType[], number]
  >(() => {
    if (!!request && isPaginationActive) {
      return [finalData, finalData, total];
    }

    const sortedData = getSortData(finalData, sortStates, childrenColumnName);
    const mergedData = getFilterData(
      sortedData,
      filterStates,
      childrenColumnName,
      datePickerLocale,
    );
    const mergedTotal = mergedData.length;

    if (!isPaginationActive) {
      return [mergedData, mergedData, mergedTotal];
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
        return [
          mergedData,
          mergedData.slice((current - 1) * pageSize, current * pageSize),
          mergedTotal,
        ];
      }
      return [mergedData, mergedData, mergedTotal];
    }

    return [
      mergedData,
      mergedData.slice((current - 1) * pageSize, current * pageSize),
      mergedTotal,
    ];
  }, [
    !!request,
    finalData,
    total,
    pagination.current,
    pagination.pageSize,
    sortStates,
    filterStates,
    childrenColumnName,
    isPaginationActive,
    getSortData,
    getFilterData,
  ]);

  const reload = useEvent((resetPageIndex?: boolean) => {
    if (!request) return;

    cancel();

    if (resetPageIndex) {
      resetPagination();
      return;
    }

    refresh();
  });

  return [loading, mergedDataSource, pageData, mergedTotal, setFinalData, reload] as const;
}
