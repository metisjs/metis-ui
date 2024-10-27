import { useContext, useMemo, useRef, useState } from 'react';
import { useRequest } from 'ahooks';
import type { Options, Service } from 'ahooks/lib/useRequest/src/types';
import { useEvent } from 'rc-util';
import type { LazyLoadType } from '.';
import type { RequestConfig } from '../_util/type';
import { ConfigContext } from '../config-provider';
import type { ScrollValues } from '../scrollbar';

const PAGE_SIZE = 20;
const SCROLL_THRESHOLD = 100;

export default function <TData>(
  request?: RequestConfig<TData, any[]>,
  lazyLoad?: LazyLoadType,
  onScroll?: (values: ScrollValues, ev: React.UIEvent<HTMLElement>) => void,
) {
  const { request: contextRequestOptions } = useContext(ConfigContext);

  const pageSize = typeof lazyLoad !== 'boolean' ? (lazyLoad?.pageSize ?? PAGE_SIZE) : PAGE_SIZE;

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
  const {
    refreshDeps = [],
    onFinally,
    onSuccess,
    ready,
    ...restOptions
  } = { ...contextRequestOptions, ...requestOptions };

  const { loading, run, params, cancel } = useRequest(
    async (...defaultParams: any[]) => {
      let firstParam: Record<string, any> | undefined = undefined;

      if (lazyLoad) {
        firstParam = {
          current: current.current,
          pageSize: pageSize,
        };
      }
      return await requestService!(...[firstParam, ...defaultParams].filter(Boolean));
    },
    {
      ready: !!requestService && ready,
      refreshDeps: [JSON.stringify(lazyLoad), ...refreshDeps],
      refreshDepsAction: () => {
        cancel();
        current.current = 1;
        target.current?.scrollTo({ top: 0 });
        run(...params);
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
    run(...params);
  });

  const onInternalScroll = useEvent((values: ScrollValues, ev: React.UIEvent<HTMLElement>) => {
    target.current = ev.target as HTMLDivElement;
    const { scrollTop, scrollHeight, clientHeight } = values;
    if (lazyLoad && !noMore && !loadingMore) {
      if (scrollHeight - scrollTop <= clientHeight + SCROLL_THRESHOLD) {
        loadMore(current.current + 1);
      }
    }
    onScroll?.(values, ev);
  });

  return {
    dataSource,
    loading: !loadingMore && loading,
    onScroll: onInternalScroll,
    loadingMore,
    noMore,
  };
}
