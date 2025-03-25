import type { UrlStateOptions } from '@util/hooks/useUrlState';
import useUrlState from '@util/hooks/useUrlState';
import extendsObject from '../../_util/extendsObject';
import type { PaginationProps } from '../../pagination';
import type { TablePaginationConfig } from '../interface';

export const DEFAULT_PAGE_SIZE = 10;

export function getPaginationParam(
  mergedPagination: TablePaginationConfig,
  pagination?: TablePaginationConfig | boolean,
) {
  const param: any = {
    current: mergedPagination.current,
    pageSize: mergedPagination.pageSize,
  };

  const paginationObj = pagination && typeof pagination === 'object' ? pagination : {};

  Object.keys(paginationObj).forEach((pageProp) => {
    const value = mergedPagination[pageProp as keyof typeof paginationObj];

    if (typeof value !== 'function') {
      param[pageProp] = value;
    }
  });

  return param;
}

function usePagination(
  onChange: (current: number, pageSize: number) => void,
  pagination?: TablePaginationConfig | false,
  syncToUrl?: UrlStateOptions,
): readonly [TablePaginationConfig, (current?: number, pageSize?: number) => void] {
  const paginationObj = pagination && typeof pagination === 'object' ? pagination : {};

  const [innerPagination, setInnerPagination] = useUrlState<{
    current?: number;
    pageSize?: number;
  }>(
    () => ({
      current: 'defaultCurrent' in paginationObj ? paginationObj.defaultCurrent : 1,
      pageSize:
        'defaultPageSize' in paginationObj ? paginationObj.defaultPageSize : DEFAULT_PAGE_SIZE,
    }),
    'pagination',
    { ...syncToUrl, parseOptions: { parseNumbers: true } },
  );

  // ============ Basic Pagination Config ============
  const mergedPagination = extendsObject<Partial<TablePaginationConfig>>(
    innerPagination,
    paginationObj,
  );

  const refreshPagination = (current?: number, pageSize?: number) => {
    setInnerPagination({
      current: current ?? 1,
      pageSize: pageSize || mergedPagination.pageSize,
    });
  };

  const onInternalChange: PaginationProps['onChange'] = (current, pageSize) => {
    if (pagination) {
      pagination.onChange?.(current, pageSize);
    }
    refreshPagination(current, pageSize);
    onChange(current, pageSize || mergedPagination!.pageSize!);
  };

  if (pagination === false) {
    return [{}, () => {}] as const;
  }

  return [
    {
      ...mergedPagination,
      onChange: onInternalChange,
    },
    refreshPagination,
  ] as const;
}

export default usePagination;
