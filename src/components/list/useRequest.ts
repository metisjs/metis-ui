import { useContext, useMemo, useRef, useState } from 'react';
import { useEvent } from '@rc-component/util';
import type { RequestConfig } from '@util/type';
import { useRequest } from 'ahooks';
import type { Options, Service } from 'ahooks/lib/useRequest/src/types';
import type { LazyLoadType } from '.';
import { ConfigContext } from '../config-provider';
import type { VirtualListRef } from '../virtual-list';

const PAGE_SIZE = 20;

export default function <TData>(
  request?: RequestConfig<TData, any, any[]>,
  lazyLoad?: LazyLoadType,
  virtualListRef?: React.RefObject<VirtualListRef | null>,
) {
  const { request: contextRequestOptions } = useContext(ConfigContext);

  const { pageSize, direction } =
    typeof lazyLoad !== 'boolean'
      ? { pageSize: lazyLoad?.pageSize ?? PAGE_SIZE, direction: lazyLoad?.direction ?? 'bottom' }
      : { pageSize: PAGE_SIZE, direction: 'bottom' };

  const current = useRef(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [finalData, setFinalData] = useState<{ data: TData[]; total?: number }>();
  const [firstItemIndex, setFirstItemIndex] = useState(0);

  const totalOffset = useRef(0);

  const resetScrollPosition = () => {
    requestAnimationFrame(() => {
      if (direction === 'bottom') {
        virtualListRef?.current?.scrollTo({ top: 0 });
      } else if (direction === 'top') {
        virtualListRef?.current?.scrollTo({
          top: virtualListRef.current.getScrollValues().scrollHeight,
        });
      }
    });
  };

  let requestService: Service<{ data: TData[]; total?: number }, any[]> | undefined = undefined;
  let requestOptions: Options<{ data: TData[]; total?: number }, any[]> | undefined = undefined;
  if (typeof request === 'function') {
    requestService = request;
  } else if (request) {
    requestService = request.service;
    requestOptions = request.options;
  }
  const {
    refreshDeps = [],
    onFinally,
    onSuccess,
    ready,
    ...restOptions
  } = { ...contextRequestOptions, ...requestOptions };

  const { loading, runAsync, params, cancel, refreshAsync } = useRequest(
    async (...defaultParams: any[]) => {
      let firstParam: Record<string, any> | undefined = undefined;

      if (lazyLoad) {
        firstParam = {
          current: current.current,
          pageSize: pageSize,
        };
      }
      const params = firstParam ? [firstParam, ...defaultParams] : defaultParams;
      return await requestService!(...params);
    },
    {
      ready: !!requestService && ready,
      refreshDeps: [JSON.stringify(lazyLoad), ...refreshDeps],
      refreshDepsAction: async () => {
        cancel();
        current.current = 1;
        await runAsync(...params);
        resetScrollPosition();
      },
      onSuccess: (d, params) => {
        if (current.current === 1) {
          totalOffset.current = 0;
          if (direction === 'top') {
            setFirstItemIndex(d.total - d.data.length);
          }
          setFinalData(d);
        } else {
          if (direction === 'top') {
            setFirstItemIndex(
              d.total - d.data.length - (finalData?.data.length ?? 0) + totalOffset.current,
            );
          }

          setFinalData((prev) => {
            if (prev) {
              return {
                ...prev,
                data:
                  direction === 'bottom' ? [...prev.data, ...d.data] : [...d.data, ...prev.data],
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
  const { data: dataSource = [], total = 0 } = finalData || {};

  const noMore = useMemo(() => dataSource.length >= total, [dataSource, total]);

  const loadMore = useEvent((c: number) => {
    setLoadingMore(true);

    let toCurrent = c <= 0 ? 1 : c;
    const tempTotalPage = Math.ceil(total / pageSize);
    if (toCurrent > tempTotalPage) {
      toCurrent = Math.max(1, tempTotalPage);
    }

    current.current = toCurrent;
    runAsync(...params);
  });

  const handleLoadMore = useEvent(() => {
    if (lazyLoad && !noMore && !loadingMore) {
      loadMore(current.current + 1);
    }
  });

  const reload = useEvent(async () => {
    if (!request) return;

    cancel();
    current.current = 1;

    await refreshAsync();

    resetScrollPosition();
  });

  const setDataSource = useEvent(async (arg: any) => {
    if (!request) return;

    if (typeof arg === 'function') {
      const newData = await arg(dataSource);
      totalOffset.current += newData.length - dataSource.length;
      const newTotal = total + (newData.length - dataSource.length);
      setFinalData({ data: newData, total: newTotal });
    } else {
      totalOffset.current += arg.length - dataSource.length;
      const newTotal = total + (arg.length - dataSource.length);
      setFinalData({ data: arg, total: newTotal });
    }
  });

  return {
    dataSource,
    loading: !loadingMore && loading,
    loadMore: handleLoadMore,
    loadingMore,
    noMore,
    firstItemIndex,
    reload,
    setDataSource,
  };
}
