import { useMemoizedFn, useRequest } from 'ahooks';
import type { Options, Service } from 'ahooks/lib/useRequest/src/types';
import { getClientHeight, getScrollHeight, getScrollTop } from 'metis-ui/es/_util/rect';
import { useMemo, useState } from 'react';
import { BaseOptionType, RequestConfig } from '../interface';

const PAGE_SIZE = 30;
const THRESHOLD = 100;

export default function <TData extends BaseOptionType>(
  request?: RequestConfig<TData, any[]>,
  showSearch?: boolean,
  searchValue?: string,
  optionFilterProp?: string,
  pagination?: boolean,
  onScroll?: React.UIEventHandler<HTMLDivElement>,
) {
  const [current, setCurrent] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  let requestService: Service<{ data: TData[]; total?: number }, any[]> | undefined = undefined;
  let requestOptions: Options<{ data: TData[]; total?: number }, any[]> | undefined = undefined;
  if (typeof request === 'function') {
    requestService = request;
  } else if (request) {
    requestService = request.service;
    requestOptions = request.options;
  }
  const { defaultParams = [], refreshDeps = [], onFinally, ...restOptions } = requestOptions ?? {};

  const { data, loading, run } = useRequest(
    async () => {
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
      return await requestService?.(...[firstParam, ...defaultParams].filter(Boolean));
    },
    {
      refreshDeps: [showSearch, searchValue, pagination, optionFilterProp, ...refreshDeps],
      refreshDepsAction: () => {
        setCurrent(1);
        run(...defaultParams);
      },
      onFinally: (...params) => {
        setLoadingMore(false);
        onFinally?.(...params);
      },
      ...restOptions,
    },
  );
  const { data: options = [], total = 0 } = data || {};

  const noMore = useMemo(() => options.length >= total, [options, total]);

  const onInternalScroll: React.UIEventHandler<HTMLDivElement> = useMemoizedFn((e) => {
    if (pagination && !noMore && !loadingMore) {
      const el = e.target as HTMLDivElement;
      const scrollTop = getScrollTop(el);
      const scrollHeight = getScrollHeight(el);
      const clientHeight = getClientHeight(el);

      if (scrollHeight - scrollTop <= clientHeight + THRESHOLD) {
        setLoadingMore(true);
        setCurrent((c) => c + 1);
        // run();
      }
    }
    onScroll?.(e);
  });

  return {
    options,
    loading: !loadingMore && loading,
    onScroll: onInternalScroll,
    loadingMore,
  };
}
