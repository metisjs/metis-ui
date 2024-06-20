import { useMemoizedFn, useRequest } from 'ahooks';
import type { Options, Service } from 'ahooks/lib/useRequest/src/types';
import { getClientHeight, getScrollHeight, getScrollTop } from 'metis-ui/es/_util/rect';
import { useMemo, useRef, useState } from 'react';
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
  const current = useRef(1);
  const target = useRef<HTMLDivElement>();
  const [loadingMore, setLoadingMore] = useState(false);
  const [finalData, setFinalData] = useState<{ data: TData[]; total?: number }>();

  let requestService: Service<{ data: TData[]; total?: number }, any[]> | undefined = undefined;
  let requestOptions: Options<{ data: TData[]; total?: number }, any[]> | undefined = undefined;
  if (typeof request === 'function') {
    requestService = request;
  } else if (request) {
    requestService = request.service;
    requestOptions = request.options;
  }
  const { refreshDeps = [], onFinally, onSuccess, ready, ...restOptions } = requestOptions ?? {};

  const { loading, run, params, cancel } = useRequest(
    async (defaultParams: any[] = []) => {
      let firstParam: Record<string, any> | undefined = undefined;
      if (showSearch) {
        firstParam = {
          filters: { [optionFilterProp ?? 'keyword']: searchValue?.trim() || undefined },
        };
      }

      if (pagination) {
        firstParam = {
          ...firstParam,
          current: current.current,
          pageSize: PAGE_SIZE,
        };
      }
      return await requestService!(...[firstParam, ...defaultParams].filter(Boolean));
    },
    {
      ready: !!requestService && ready,
      refreshDeps: [showSearch, searchValue, pagination, optionFilterProp, ...refreshDeps],
      refreshDepsAction: () => {
        cancel();
        current.current = 1;
        target.current?.scrollTo({ top: 0 });
        run(params);
      },
      onSuccess: (d, params) => {
        if (current.current === 1) {
          setFinalData(d);
        } else {
          setFinalData((prev) => {
            if (prev) {
              return {
                ...prev,
                data: [...prev.data, ...d.data],
              };
            }
            return d;
          });
        }
        onSuccess?.(d, params);
      },
      onFinally: (...params) => {
        setLoadingMore(false);
        onFinally?.(...params);
      },
      ...restOptions,
    },
  );
  const { data: options = [], total = 0 } = finalData || {};

  const noMore = useMemo(() => options.length >= total, [options, total]);

  const loadMore = useMemoizedFn((c: number) => {
    setLoadingMore(true);

    let toCurrent = c <= 0 ? 1 : c;
    const tempTotalPage = Math.ceil(total / PAGE_SIZE);
    if (toCurrent > tempTotalPage) {
      toCurrent = Math.max(1, tempTotalPage);
    }

    current.current = toCurrent;
    run(params);
  });

  const onInternalScroll: React.UIEventHandler<HTMLDivElement> = useMemoizedFn((e) => {
    target.current = e.target as HTMLDivElement;
    if (pagination && !noMore && !loadingMore) {
      const scrollTop = getScrollTop(target.current);
      const scrollHeight = getScrollHeight(target.current);
      const clientHeight = getClientHeight(target.current);

      if (scrollHeight - scrollTop <= clientHeight + THRESHOLD) {
        loadMore(current.current + 1);
      }
    }
    onScroll?.(e);
  });

  const mergedOptions = useMemo(() => {
    if (pagination && !noMore && loadingMore) {
      return [...options, { __loading__: true }];
    }
    return options;
  }, [options, loadingMore, noMore, pagination]);

  return {
    options: mergedOptions,
    loading: !loadingMore && loading,
    onScroll: onInternalScroll,
    loadingMore,
  };
}
