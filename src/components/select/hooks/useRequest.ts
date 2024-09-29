import { useMemo, useRef, useState } from 'react';
import { useMemoizedFn, useRequest } from 'ahooks';
import type { Options, Service } from 'ahooks/lib/useRequest/src/types';
import type { RequestConfig } from '../../_util/type';
import type { BaseOptionType, FieldNames, SelectProps } from '../interface';

const PAGE_SIZE = 30;
const SCROLL_THRESHOLD = 100;
const REQUEST_DEBOUNCE = 200;

export default function <TData extends BaseOptionType>(
  fieldNames: Required<FieldNames<BaseOptionType>>,
  request?: RequestConfig<TData, any[]>,
  showSearch?: boolean,
  searchValue?: string,
  optionFilterProp?: string,
  lazyLoad?: boolean,
  onScroll?: SelectProps['onPopupScroll'],
  combobox?: boolean,
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
  const {
    refreshDeps = [],
    onFinally,
    onSuccess,
    ready,
    debounceWait = REQUEST_DEBOUNCE,
    ...restOptions
  } = requestOptions ?? {};

  const { loading, run, params, cancel } = useRequest(
    async (...defaultParams: any[]) => {
      // combobox 模式下只在搜索时触发请求
      if (combobox && !searchValue?.trim()) {
        return { data: [], total: 0 };
      }
      let firstParam: Record<string, any> | undefined = undefined;
      if (showSearch || combobox) {
        firstParam = {
          filters: { [optionFilterProp ?? fieldNames.label]: searchValue?.trim() || undefined },
        };
      }

      if (lazyLoad) {
        firstParam = {
          ...firstParam,
          current: current.current,
          pageSize: PAGE_SIZE,
        };
      }
      return await requestService!(...[firstParam, ...defaultParams].filter(Boolean));
    },
    {
      debounceWait,
      ready: !!requestService && ready,
      refreshDeps: [showSearch, searchValue, lazyLoad, optionFilterProp, ...refreshDeps],
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
    run(...params);
  });

  const onInternalScroll: SelectProps['onPopupScroll'] = useMemoizedFn((values, ev) => {
    target.current = ev.target as HTMLDivElement;
    const { scrollTop, scrollHeight, clientHeight } = values;
    if (lazyLoad && !noMore && !loadingMore) {
      if (scrollHeight - scrollTop <= clientHeight + SCROLL_THRESHOLD) {
        loadMore(current.current + 1);
      }
    }
    onScroll?.(values, ev);
  });

  const mergedOptions = useMemo(() => {
    if (lazyLoad && !noMore && loadingMore) {
      return [...options, { __loading__: true }];
    }
    return options;
  }, [options, loadingMore, noMore, lazyLoad]);

  return {
    options: mergedOptions,
    loading: !loadingMore && loading,
    onScroll: onInternalScroll,
    loadingMore,
  };
}
