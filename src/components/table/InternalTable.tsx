import * as React from 'react';
import { clsx, mergeSemanticCls } from '@util/classNameUtils';
import type { AnyObject } from '@util/type';
import { devUseWarning } from '@util/warning';
import classNames from 'classnames';
import type { SizeInfo } from 'rc-resize-observer';
import ResizeObserver from 'rc-resize-observer';
import { getDOM } from 'rc-util/lib/Dom/findDOMNode';
import isVisible from 'rc-util/lib/Dom/isVisible';
import useEvent from 'rc-util/lib/hooks/useEvent';
import pickAttrs from 'rc-util/lib/pickAttrs';
import getValue from 'rc-util/lib/utils/get';
import type { ConfigConsumerProps } from '../config-provider';
import { ConfigContext } from '../config-provider';
import DefaultRenderEmpty from '../config-provider/defaultRenderEmpty';
import defaultLocale from '../locale/en_US';
import Pagination from '../pagination';
import type { ScrollbarRef, ScrollValues } from '../scrollbar';
import Scrollbar from '../scrollbar';
import type { SpinProps } from '../spin';
import Spin from '../spin';
import Body from './Body';
import ColGroup from './ColGroup';
import type { TableContextProps } from './context/TableContext';
import TableContext, { makeImmutable } from './context/TableContext';
import type { FixedHolderProps } from './FixedHolder';
import FixedHolder from './FixedHolder';
import Footer from './Footer';
import type { SummaryProps } from './Footer/Summary';
import Summary from './Footer/Summary';
import Header from './Header/Header';
import useColumns from './hooks/useColumns';
import useExpand from './hooks/useExpand';
import type { FilterConfig } from './hooks/useFilter';
import useFilter, { getFilterData, type FilterState } from './hooks/useFilter';
import useFixedInfo from './hooks/useFixedInfo';
import { useTimeoutLock } from './hooks/useFrame';
import useHover from './hooks/useHover';
import useLazyKVMap from './hooks/useLazyKVMap';
import usePagination, { DEFAULT_PAGE_SIZE, getPaginationParam } from './hooks/usePagination';
import useRequest from './hooks/useRequest';
import useSelection from './hooks/useSelection';
import useSorter, { getSortData, type SortState } from './hooks/useSorter';
import useSticky from './hooks/useSticky';
import type {
  ColumnsType,
  ColumnTitleProps,
  ColumnType,
  CustomizeScrollBody,
  ExpandableConfig,
  ExpandableType,
  FilterValue,
  GetComponent,
  GetComponentProps,
  GetPopupContainer,
  GetRequestType,
  GetRowKey,
  Reference,
  RowClassName,
  ScrollOffset,
  SorterResult,
  SorterTooltipProps,
  SortOrder,
  TableAction,
  TableComponents,
  TableCurrentDataSource,
  TableLayout,
  TableLocale,
  TablePaginationConfig,
  TableRowSelection,
  TableSticky,
} from './interface';
import StickyScrollBar from './StickyScrollBar';
import { validateValue } from './utils/valueUtil';

// Used for conditions cache
const EMPTY_LIST = [] as const;

// Used for customize scroll
const EMPTY_SCROLL_TARGET = {};

interface ChangeEventInfo<RecordType extends AnyObject = AnyObject> {
  pagination: {
    current?: number;
    pageSize?: number;
    total?: number;
  };
  filters: Record<string, FilterValue | null>;
  sorter: SorterResult<RecordType> | SorterResult<RecordType>[];

  filterStates: FilterState<RecordType>[];
  sorterStates: SortState<RecordType>[];

  resetPagination: (current?: number, pageSize?: number) => void;
}

export interface TableProps<
  RecordType extends AnyObject = AnyObject,
  Pagination extends false | TablePaginationConfig = TablePaginationConfig,
> {
  prefixCls?: string;
  dropdownPrefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  dataSource?: readonly RecordType[];
  columns?: ColumnsType<RecordType>;
  rowKey?: string | keyof RecordType | GetRowKey<RecordType>;
  tableLayout?: TableLayout;

  // Fixed Columns
  scroll?: { x?: number | true | string; y?: number | string; scrollToFirstRowOnChange?: boolean };

  // Expandable
  /** Config expand rows */
  expandable?: ExpandableConfig<RecordType>;
  rowClassName?: string | RowClassName<RecordType>;

  // Selection
  rowSelection?: TableRowSelection<RecordType>;

  // Editable
  editable?: boolean;

  // Additional Part
  summary?: (data: readonly RecordType[]) => React.ReactNode;

  // Customize
  id?: string;
  showHeader?: boolean;
  components?: TableComponents<RecordType>;
  onRow?: GetComponentProps<RecordType>;
  onHeaderRow?: GetComponentProps<readonly ColumnType<RecordType>[]>;

  sticky?: boolean | TableSticky;

  rowHoverable?: boolean;

  pagination?: Pagination;

  request?: GetRequestType<RecordType, Pagination>;

  loading?: boolean | SpinProps;
  size?: 'default' | 'middle' | 'small';
  verticalLine?: boolean;
  locale?: TableLocale;

  onChange?: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<RecordType> | SorterResult<RecordType>[],
    extra: TableCurrentDataSource<RecordType>,
  ) => void;

  getPopupContainer?: GetPopupContainer;

  sortDirections?: SortOrder[];
  showSorterTooltip?: boolean | SorterTooltipProps;
  virtual?: boolean;

  // Events
  onScroll?: React.UIEventHandler<HTMLDivElement>;
}

export interface InternalTableProps<RecordType extends AnyObject = AnyObject>
  extends Omit<TableProps<RecordType>, 'pagination'> {
  _renderTimes: number;
  pagination?: false | TablePaginationConfig;
}

function InternalTable<RecordType extends AnyObject>(
  props: InternalTableProps<RecordType>,
  ref: React.Ref<Reference>,
) {
  // ==================== Warning =====================
  const warning = devUseWarning('Table');

  const {
    prefixCls: customizePrefixCls,
    dropdownPrefixCls: customizeDropdownPrefixCls,
    className,
    rowClassName,
    style,
    size: customizeSize,
    verticalLine,
    dataSource,
    rowKey = 'key',
    scroll,
    tableLayout,
    columns,

    expandable,
    rowSelection,
    pagination,

    // Additional Part
    summary,

    // Customize
    id,
    showHeader,
    components,
    onRow,
    onHeaderRow,
    getPopupContainer,

    // Events
    onScroll,
    onChange,

    sticky,
    rowHoverable,
    locale,
    sortDirections,
    showSorterTooltip = { target: 'full-header' },
    loading,

    request,

    children,
  } = props;

  const {
    locale: contextLocale = defaultLocale,
    table,
    renderEmpty,
    getPrefixCls,
    getPopupContainer: getContextPopupContainer,
  } = React.useContext<ConfigConsumerProps>(ConfigContext);
  const prefixCls = getPrefixCls('table', customizePrefixCls);
  const dropdownPrefixCls = getPrefixCls('dropdown', customizeDropdownPrefixCls);

  const mergedSize = customizeSize ?? table?.size ?? 'default';
  const tableLocale: TableLocale = { ...contextLocale.Table, ...locale };

  const rawData = dataSource || EMPTY_LIST;

  const { childrenColumnName = 'children', expandedRowRender } = expandable ?? {};

  const emptyText =
    typeof locale?.emptyText !== 'undefined'
      ? locale.emptyText
      : renderEmpty?.('Table') || <DefaultRenderEmpty componentName="Table" />;

  // ======================= Refs =======================
  const fullTableRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollHeaderRef = React.useRef<HTMLDivElement>(null);
  const scrollBodyRef = React.useRef<ScrollbarRef>(null);
  const scrollSummaryRef = React.useRef<HTMLDivElement>(null);

  // ==================== Customize =====================
  const getComponent = React.useCallback<GetComponent>(
    (path, defaultComponent) => getValue(components, path) || defaultComponent,
    [components],
  );

  const getRowKey = React.useMemo<GetRowKey<RecordType>>(() => {
    if (typeof rowKey === 'function') {
      return rowKey;
    }
    return (record: RecordType) => {
      const key = record?.[rowKey];

      warning(
        key !== undefined,
        'usage',
        'Each record in table should have a unique `key` prop, or set `rowKey` to an unique primary key.',
      );

      return key;
    };
  }, [rowKey]);

  const customizeScrollBody = getComponent(['body']) as CustomizeScrollBody<RecordType>;

  // ====================== Hover =======================
  const [startRow, endRow, onHover] = useHover();

  // ============================ Events =============================
  const changeEventInfo: Partial<ChangeEventInfo<RecordType>> = {};

  const triggerOnChange = (
    info: Partial<ChangeEventInfo<RecordType>>,
    action: TableAction,
    reset = false,
  ) => {
    const changeInfo = {
      ...changeEventInfo,
      ...info,
    };

    if (reset) {
      changeEventInfo.resetPagination?.();

      // Reset event param
      if (changeInfo.pagination?.current) {
        changeInfo.pagination.current = 1;
      }

      // Trigger pagination events
      if (pagination) {
        pagination.onChange?.(1, changeInfo.pagination!.pageSize!);
      }
    }

    if (scroll && scroll.scrollToFirstRowOnChange !== false) {
      scrollBodyRef.current?.scrollTo({ top: 0 });
    }

    onChange?.(changeInfo.pagination!, changeInfo.filters!, changeInfo.sorter!, {
      currentDataSource: getFilterData(
        getSortData(rawData, changeInfo.sorterStates!, childrenColumnName),
        changeInfo.filterStates!,
        childrenColumnName,
      ),
      action,
    });
  };

  // ============================ Sorter =============================
  const onSorterChange = (
    sorter: SorterResult<RecordType> | SorterResult<RecordType>[],
    sorterStates: SortState<RecordType>[],
  ) => {
    triggerOnChange(
      {
        sorter,
        sorterStates,
      },
      'sort',
      false,
    );
  };
  const [transformSorterColumns, sortStates, sorterTitleProps, getSorters] = useSorter<RecordType>({
    prefixCls,
    columns,
    onSorterChange,
    sortDirections: sortDirections ?? ['ascend', 'descend'],
    tableLocale,
    showSorterTooltip,
  });
  const sortedData = React.useMemo(
    () => getSortData(rawData, sortStates, childrenColumnName),
    [rawData, sortStates],
  );

  changeEventInfo.sorter = getSorters();
  changeEventInfo.sorterStates = sortStates;

  // ============================ Filter ============================
  const onFilterChange: FilterConfig<RecordType>['onFilterChange'] = (filters, filterStates) => {
    triggerOnChange({ filters, filterStates }, 'filter', true);
  };

  const [transformFilterColumns, filterStates, filters] = useFilter<RecordType>({
    prefixCls,
    locale: tableLocale,
    dropdownPrefixCls,
    columns,
    onFilterChange,
    getPopupContainer: getPopupContainer || getContextPopupContainer,
  });
  const mergedData = getFilterData(sortedData, filterStates, childrenColumnName);

  changeEventInfo.filters = filters;
  changeEventInfo.filterStates = filterStates;

  // ========================== Pagination ==========================
  const onPaginationChange = (current: number, pageSize: number) => {
    triggerOnChange(
      {
        pagination: { ...changeEventInfo.pagination, current, pageSize },
      },
      'paginate',
    );
  };

  const [mergedPagination, resetPagination] = usePagination(onPaginationChange, pagination);

  changeEventInfo.pagination =
    pagination === false ? {} : getPaginationParam(mergedPagination, pagination);

  changeEventInfo.resetPagination = resetPagination;

  // ========================== Request ==========================
  const [requestLoading, requestData, total] = useRequest(
    changeEventInfo.filters!,
    filterStates,
    changeEventInfo.sorter!,
    sortStates,
    getSortData,
    getFilterData,
    childrenColumnName,
    changeEventInfo.pagination!,
    request,
  );

  mergedPagination.total = !!request ? total : mergedData.length;

  // Reset `current` if data length or pageSize changed
  const maxPage = Math.ceil(mergedPagination.total / mergedPagination.pageSize!);
  if (mergedPagination.current! > maxPage) {
    // Prevent a maximum page count of 0
    mergedPagination.current = maxPage || 1;
  }

  const finalData = React.useMemo<RecordType[]>(() => {
    if (!!request) {
      return requestData;
    }

    if (pagination === false) {
      return mergedData;
    }

    const { current = 1, total, pageSize = DEFAULT_PAGE_SIZE } = mergedPagination;
    warning(current > 0, 'usage', '`current` should be positive number.');

    // Dynamic table data
    if (mergedData.length < total!) {
      if (mergedData.length > pageSize) {
        warning(
          false,
          'usage',
          '`dataSource` length is less than `pagination.total` but large than `pagination.pageSize`. Please make sure your config correct data with async mode.',
        );
        return mergedData.slice((current - 1) * pageSize, current * pageSize);
      }
      return mergedData;
    }

    return mergedData.slice((current - 1) * pageSize, current * pageSize);
  }, [
    !!request,
    requestData,
    !!pagination,
    mergedData,
    mergedPagination?.current,
    mergedPagination?.pageSize,
    mergedPagination?.total,
  ]);

  const [getRecordByKey] = useLazyKVMap(
    request ? requestData : rawData,
    childrenColumnName,
    getRowKey,
  );

  const expandableType = React.useMemo<ExpandableType>(() => {
    if ((request ? requestData : rawData).some((item) => item?.[childrenColumnName])) {
      return 'nest';
    }

    if (expandedRowRender) {
      return 'row';
    }

    return false;
  }, [rawData, requestData, childrenColumnName, !!expandedRowRender]);

  // ====================== Selection ======================
  const [transformSelectionColumns, selectedKeySet] = useSelection(
    {
      prefixCls,
      data: mergedData,
      pageData: finalData,
      getRowKey,
      getRecordByKey,
      expandableType,
      childrenColumnName,
      locale: tableLocale,
      verticalLine,
      size: mergedSize,
      getPopupContainer: getPopupContainer || getContextPopupContainer,
    },
    rowSelection,
  );

  // ====================== Expand ======================
  const defaultExpandIconColumnIndex = React.useMemo(() => {
    if (expandableType === 'nest' && expandable?.expandIconColumnIndex === undefined) {
      return rowSelection ? 1 : 0;
    }
    if (expandable && expandable.expandIconColumnIndex! > 0 && rowSelection) {
      return expandable.expandIconColumnIndex! - 1;
    }
    return undefined;
  }, [expandableType, !!rowSelection]);
  const [transformExpandableColumns, expandableConfig, expandedKeys, expandIcon, onTriggerExpand] =
    useExpand(
      prefixCls,
      expandable,
      finalData,
      getRowKey,
      defaultExpandIconColumnIndex,
      verticalLine,
      mergedSize,
    );

  // ====================== Column ======================
  const scrollX = scroll?.x;
  const [componentWidth, setComponentWidth] = React.useState(0);

  const columnTitleProps = React.useMemo<ColumnTitleProps<RecordType>>(() => {
    const mergedFilters: Record<string, FilterValue> = {};
    Object.keys(filters).forEach((filterKey) => {
      if (filters[filterKey] !== null) {
        mergedFilters[filterKey] = filters[filterKey]!;
      }
    });
    return {
      ...sorterTitleProps,
      filters: mergedFilters,
    };
  }, [sorterTitleProps, filters]);

  const transformColumns = React.useCallback(
    (innerColumns: ColumnsType<RecordType>): ColumnsType<RecordType> =>
      transformSelectionColumns(
        transformFilterColumns(transformSorterColumns(transformExpandableColumns(innerColumns))),
      ),
    [transformSorterColumns, transformFilterColumns, transformSelectionColumns],
  );

  const [
    mergedColumns,
    flattenColumns,
    flattenScrollX,
    colWidths,
    updateColsWidths,
    stickyOffsets,
    columnsPos,
    columnsKey,
  ] = useColumns(
    {
      columns,
      scrollWidth: typeof scrollX === 'number' ? scrollX : undefined,
      clientWidth: componentWidth,
      children,
      columnTitleProps,
    },
    transformColumns,
  );

  const mergedScrollX = flattenScrollX ?? scrollX;

  const columnContext = React.useMemo(
    () => ({
      columns: mergedColumns,
      flattenColumns,
    }),
    [mergedColumns, flattenColumns],
  );

  React.useImperativeHandle(ref, () => {
    return {
      nativeElement: fullTableRef.current!,
      scrollTo: (config) => {},
    };
  });

  // ====================== Scroll ======================
  const [scrollOffset, setScrollOffset] = React.useState<ScrollOffset>({ left: 0, right: 0 });

  const fixHeader = !!scroll && validateValue(scroll.y);
  const horizonScroll = (scroll && validateValue(mergedScrollX)) || Boolean(expandableConfig.fixed);
  const fixColumn = horizonScroll && flattenColumns.some(({ fixed }) => fixed);
  const fixedInfoList = useFixedInfo(flattenColumns, stickyOffsets, scrollOffset, columnsPos);

  // Sticky
  const stickyRef = React.useRef<{
    setScrollLeft: (left: number) => void;
    checkScrollBarVisible: () => void;
  }>();
  const { isSticky, offsetHeader, offsetSummary, offsetScroll, stickyClassName, container } =
    useSticky(sticky, prefixCls);

  // Footer (Fix footer must fixed header)
  const summaryNode = React.useMemo(() => summary?.(finalData), [summary, finalData]);
  const fixFooter =
    (fixHeader || isSticky) &&
    React.isValidElement(summaryNode) &&
    summaryNode.type === Summary &&
    (summaryNode.props as SummaryProps).fixed;

  // Scroll
  let scrollTableStyle: React.CSSProperties = {};

  if (horizonScroll) {
    scrollTableStyle = {
      width: mergedScrollX === true ? 'auto' : mergedScrollX,
      minWidth: '100%',
    };
  }

  const onColumnResize = React.useCallback((columnKey: React.Key, width: number) => {
    if (fullTableRef.current && isVisible(fullTableRef.current)) {
      updateColsWidths((widths) => {
        if (widths.get(columnKey) !== width) {
          const newWidths = new Map(widths);
          newWidths.set(columnKey, width);
          return newWidths;
        }
        return widths;
      });
    }
  }, []);

  const [setScrollTarget, getScrollTarget] = useTimeoutLock<HTMLElement>();

  function forceScroll(
    scrollLeft: number,
    target: HTMLDivElement | null | ((left: number) => void),
  ) {
    if (!target) {
      return;
    }
    if (typeof target === 'function') {
      target(scrollLeft);
    } else if (target.scrollLeft !== scrollLeft) {
      target.scrollLeft = scrollLeft;

      if (target.scrollLeft !== scrollLeft) {
        setTimeout(() => {
          target.scrollLeft = scrollLeft;
        }, 0);
      }
    }
  }

  const onInternalScroll = useEvent(
    ({ scrollLeft }: { scrollLeft: number }, { currentTarget }: { currentTarget: HTMLElement }) => {
      const compareTarget = currentTarget || EMPTY_SCROLL_TARGET;
      if (!getScrollTarget() || getScrollTarget() === compareTarget) {
        setScrollTarget(compareTarget);

        forceScroll(scrollLeft, scrollHeaderRef.current);
        forceScroll(scrollLeft, (left) => scrollBodyRef.current?.scrollTo({ left }));
        forceScroll(scrollLeft, scrollSummaryRef.current);
        forceScroll(scrollLeft, (left) => stickyRef.current?.setScrollLeft(left));
      }

      const measureTarget = currentTarget || scrollHeaderRef.current;
      if (measureTarget) {
        const scrollWidth =
          typeof mergedScrollX === 'number' ? mergedScrollX : measureTarget.scrollWidth;
        const clientWidth = measureTarget.clientWidth;
        // There is no space to scroll
        if (scrollWidth === clientWidth) {
          setScrollOffset({
            left: 0,
            right: 0,
          });
          return;
        }
        setScrollOffset({
          left: scrollLeft,
          right: Math.floor(scrollWidth - clientWidth - scrollLeft),
        });
      }
    },
  );

  const onBodyScroll = useEvent((values: ScrollValues, e: React.UIEvent<HTMLDivElement>) => {
    onInternalScroll(values, e);
    onScroll?.(e);
  });

  const triggerOnScroll = () => {
    if (horizonScroll && scrollBodyRef.current) {
      onInternalScroll(scrollBodyRef.current.getValues(), {
        currentTarget: getDOM(scrollBodyRef.current.view),
      } as React.UIEvent<HTMLDivElement>);
    } else {
      setScrollOffset({
        left: 0,
        right: 0,
      });
    }
  };

  const onFullTableResize = ({ width }: SizeInfo) => {
    stickyRef.current?.checkScrollBarVisible();
    let mergedWidth = fullTableRef.current ? fullTableRef.current.offsetWidth : width;
    if (containerRef.current) {
      // Ignore border width
      const style = getComputedStyle(containerRef.current);
      const borderLeft = parseInt(style.borderLeftWidth, 10);
      const borderRight = parseInt(style.borderRightWidth, 10);
      mergedWidth = mergedWidth - borderLeft - borderRight;
    }

    if (mergedWidth !== componentWidth) {
      triggerOnScroll();
      setComponentWidth(mergedWidth);
    }
  };

  // Sync scroll bar when init or `horizonScroll`, `columns.length` changed
  const mounted = React.useRef(false);
  React.useEffect(() => {
    // onFullTableResize will be trigger once when ResizeObserver is mounted
    // This will reduce one duplicated triggerOnScroll time
    if (mounted.current) {
      triggerOnScroll();
    }
  }, [horizonScroll, mergedColumns.length]);
  React.useEffect(() => {
    mounted.current = true;
  }, []);

  // ====================== Style ======================
  const hasPingLeft = fixedInfoList.some((item) => item.lastPingLeft);
  const hasPingRight = fixedInfoList.some((item) => item.firstPingRight);

  const rootCls = clsx(
    prefixCls,
    {
      [`${prefixCls}-layout-fixed`]: tableLayout === 'fixed',
      [`${prefixCls}-fixed-header`]: fixHeader,
      [`${prefixCls}-fixed-column`]: fixColumn,
      [`${prefixCls}-scroll-horizontal`]: horizonScroll,
      [`${prefixCls}-has-ping-left`]: hasPingLeft,
      [`${prefixCls}-has-ping-right`]: hasPingRight,
    },
    'max-w-full bg-container text-sm text-text',
    className,
  );

  const containerCls = clsx(
    `${prefixCls}-container`,
    'relative',
    'before:pointer-events-none before:absolute before:bottom-0 before:left-0 before:top-0 before:z-[3] before:w-7 before:transition-shadow',
    'after:pointer-events-none after:absolute after:bottom-0 after:right-0 after:top-0 after:z-[3] after:w-7 after:transition-shadow',
    {
      'before:shadow-[inset_10px_0_8px_-8px_rgba(0,_0,_0,_0.08)]':
        !hasPingLeft && scrollOffset.left > 0,
      'after:shadow-[inset_-10px_0_8px_-8px_rgba(0,_0,_0,_0.08)]':
        !hasPingRight && scrollOffset.right > 0,
    },
  );

  const tableCls = clsx('w-full border-separate border-spacing-0 text-start');

  // ========================================================================
  // ==                               Render                               ==
  // ========================================================================
  // =================== Render: Pagination ===================
  let topPaginationNode: React.ReactNode;
  let bottomPaginationNode: React.ReactNode;
  if (pagination !== false && mergedPagination?.total) {
    let paginationSize: TablePaginationConfig['size'];
    if (mergedPagination.size) {
      paginationSize = mergedPagination.size;
    } else {
      paginationSize = mergedSize === 'small' || mergedSize === 'middle' ? 'small' : undefined;
    }

    const renderPagination = (position: string) => (
      <Pagination
        {...mergedPagination}
        className={mergeSemanticCls(
          clsx(
            `${prefixCls}-pagination`,
            `${prefixCls}-pagination-${position}`,
            'flex flex-wrap gap-y-2 py-4',
            {
              'justify-center': position === 'center',
              'justify-end': position === 'right',
            },
          ),
          mergedPagination.className,
        )}
        size={paginationSize}
      />
    );
    const { position } = mergedPagination;
    if (position !== null && Array.isArray(position)) {
      const topPos = position.find((p) => p.includes('top'));
      const bottomPos = position.find((p) => p.includes('bottom'));
      const isDisable = position.every((p) => `${p}` === 'none');
      if (!topPos && !bottomPos && !isDisable) {
        bottomPaginationNode = renderPagination('right');
      }
      if (topPos) {
        topPaginationNode = renderPagination(topPos.toLowerCase().replace('top', ''));
      }
      if (bottomPos) {
        bottomPaginationNode = renderPagination(bottomPos.toLowerCase().replace('bottom', ''));
      }
    } else {
      bottomPaginationNode = renderPagination('right');
    }
  }

  // =================== Render: Func ===================
  const renderFixedHeaderTable = React.useCallback<FixedHolderProps<RecordType>['children']>(
    (fixedHeaderPassProps) => (
      <>
        <Header {...fixedHeaderPassProps} />
        {fixFooter === 'top' && <Footer {...fixedHeaderPassProps}>{summaryNode}</Footer>}
      </>
    ),
    [fixFooter, summaryNode],
  );

  const renderFixedFooterTable = React.useCallback<FixedHolderProps<RecordType>['children']>(
    (fixedHeaderPassProps) => <Footer {...fixedHeaderPassProps}>{summaryNode}</Footer>,
    [summaryNode],
  );

  // =================== Render: Node ===================
  const TableComponent = getComponent(['table'], 'table');

  // Table layout
  const mergedTableLayout = React.useMemo<TableLayout>(() => {
    if (tableLayout) {
      return tableLayout;
    }
    // When scroll.x is max-content, no need to fix table layout
    // it's width should stretch out to fit content
    if (fixColumn) {
      return mergedScrollX === 'max-content' ? 'auto' : 'fixed';
    }
    if (fixHeader || isSticky || flattenColumns.some(({ ellipsis }) => ellipsis)) {
      return 'fixed';
    }
    return 'auto';
  }, [fixHeader, fixColumn, flattenColumns, tableLayout, isSticky]);

  let groupTableNode: React.ReactNode;

  // Header props
  const headerProps = {
    colWidths,
    columnCount: flattenColumns.length,
    stickyOffsets,
    columnsPos,
    scrollOffset,
    onHeaderRow,
    fixHeader,
    scroll,
  };

  const hasData = !!finalData.length;
  // Empty
  const emptyNode: React.ReactNode = React.useMemo(() => {
    if (hasData) {
      return null;
    }

    if (typeof emptyText === 'function') {
      return emptyText();
    }
    return emptyText;
  }, [hasData, emptyText]);

  // Body
  const bodyTable = (
    <Body data={finalData} measureColumnWidth={fixHeader || horizonScroll || isSticky} />
  );

  const bodyColGroup = (
    <ColGroup colWidths={flattenColumns.map(({ width }) => width)} columns={flattenColumns} />
  );

  const dataProps = pickAttrs(props, { data: true });
  const ariaProps = pickAttrs(props, { aria: true });

  if (fixHeader || isSticky) {
    // >>>>>> Fixed Header
    let bodyContent: React.ReactNode;

    if (typeof customizeScrollBody === 'function') {
      bodyContent = customizeScrollBody(finalData, {
        ref: scrollBodyRef,
        onScroll: onInternalScroll,
      });

      headerProps.colWidths = flattenColumns.map(({ width }, index) => {
        const colWidth = index === flattenColumns.length - 1 ? (width as number) : width;
        if (typeof colWidth === 'number' && !Number.isNaN(colWidth)) {
          return colWidth;
        }

        warning(
          !(props.columns && props.columns.length),
          'usage',
          'When use `components.body` with render props. Each column should have a fixed `width` value.',
        );
        return 0;
      }) as number[];
    } else {
      bodyContent = (
        <Scrollbar
          autoHeight={fixHeader ? [0, scroll.y!] : false}
          onScroll={onBodyScroll}
          ref={scrollBodyRef}
          className={`${prefixCls}-body`}
        >
          <TableComponent
            className={tableCls}
            style={{
              ...scrollTableStyle,
              tableLayout: mergedTableLayout,
            }}
            {...ariaProps}
          >
            {bodyColGroup}
            {bodyTable}
            {!fixFooter && summaryNode && (
              <Footer
                stickyOffsets={stickyOffsets}
                columnsPos={columnsPos}
                scrollOffset={scrollOffset}
                flattenColumns={flattenColumns}
              >
                {summaryNode}
              </Footer>
            )}
          </TableComponent>
        </Scrollbar>
      );
    }

    // Fixed holder share the props
    const fixedHolderProps = {
      noData: !finalData.length,
      maxContentScroll: horizonScroll && mergedScrollX === 'max-content',
      ...headerProps,
      ...columnContext,
      stickyClassName,
      onScroll: onInternalScroll,
    };

    groupTableNode = (
      <>
        {/* Header Table */}
        {showHeader !== false && (
          <FixedHolder
            {...fixedHolderProps}
            stickyTopOffset={offsetHeader}
            className={`${prefixCls}-header`}
            ref={scrollHeaderRef}
          >
            {renderFixedHeaderTable}
          </FixedHolder>
        )}

        {/* Body Table */}
        {bodyContent}

        {/* Summary Table */}
        {fixFooter && fixFooter !== 'top' && (
          <FixedHolder
            {...fixedHolderProps}
            stickyBottomOffset={offsetSummary}
            className={`${prefixCls}-summary`}
            ref={scrollSummaryRef}
          >
            {renderFixedFooterTable}
          </FixedHolder>
        )}

        {isSticky && scrollBodyRef.current && (
          <StickyScrollBar
            ref={stickyRef}
            offsetScroll={offsetScroll}
            scrollBodyRef={scrollBodyRef}
            onScroll={onInternalScroll}
            container={container!}
          />
        )}
      </>
    );
  } else {
    // >>>>>> Unique table
    groupTableNode = (
      <Scrollbar
        className={classNames(`${prefixCls}-content`)}
        onScroll={onInternalScroll}
        ref={scrollBodyRef}
      >
        <TableComponent
          className={tableCls}
          style={{ ...scrollTableStyle, tableLayout: mergedTableLayout }}
          {...ariaProps}
        >
          {bodyColGroup}
          {showHeader !== false && <Header {...headerProps} {...columnContext} />}
          {bodyTable}
          {summaryNode && (
            <Footer
              stickyOffsets={stickyOffsets}
              scrollOffset={scrollOffset}
              columnsPos={columnsPos}
              flattenColumns={flattenColumns}
            >
              {summaryNode}
            </Footer>
          )}
        </TableComponent>
      </Scrollbar>
    );
  }

  let spinProps: SpinProps | undefined;
  if (typeof loading === 'boolean') {
    spinProps = {
      spinning: loading,
    };
  } else if (typeof loading === 'object') {
    spinProps = {
      spinning: true,
      ...loading,
    };
  }

  let fullTable = (
    <div className={rootCls} style={style} id={id} ref={fullTableRef} {...dataProps}>
      <Spin spinning={requestLoading} {...spinProps}>
        {topPaginationNode}
        <div ref={containerRef} className={containerCls}>
          {groupTableNode}
        </div>
        {bottomPaginationNode}
      </Spin>
    </div>
  );

  if (horizonScroll) {
    fullTable = <ResizeObserver onResize={onFullTableResize}>{fullTable}</ResizeObserver>;
  }

  const TableContextValue = React.useMemo<TableContextProps<RecordType>>(
    () => ({
      // Scroll
      scrollX: mergedScrollX,

      // Table
      prefixCls,
      getComponent,
      fixedInfoList,
      isSticky,
      selectedRowKeys: selectedKeySet,
      size: mergedSize,
      verticalLine,
      tableKey: columnsKey.join('@#@'),

      componentWidth,
      fixHeader,
      fixFooter,
      fixColumn,
      horizonScroll,

      // Body
      tableLayout: mergedTableLayout,
      rowClassName,
      expandedRowClassName: expandableConfig.expandedRowClassName,
      expandIcon: expandIcon,
      expandableType,
      expandRowByClick: !!expandableConfig.expandRowByClick,
      expandedRowRender: expandableConfig.expandedRowRender,
      onTriggerExpand,
      expandIconColumnIndex: expandableConfig.expandIconColumnIndex ?? 0,
      indentSize: expandableConfig.indentSize ?? 0,
      allColumnsFixedLeft: flattenColumns.every((col) => col.fixed === 'left'),
      emptyNode,

      // Column
      columns: mergedColumns,
      flattenColumns,
      onColumnResize,

      // Row
      hoverStartRow: startRow,
      hoverEndRow: endRow,
      onHover,
      rowExpandable: expandableConfig.rowExpandable,
      onRow,

      getRowKey,
      expandedKeys: expandedKeys,
      childrenColumnName: childrenColumnName,

      rowHoverable,
    }),
    [
      // Scroll
      mergedScrollX,

      // Table
      prefixCls,
      getComponent,
      fixedInfoList,
      isSticky,
      selectedKeySet,
      mergedSize,
      verticalLine,

      componentWidth,
      fixHeader,
      fixFooter,
      fixColumn,
      horizonScroll,

      // Body
      mergedTableLayout,
      rowClassName,
      expandableConfig.expandedRowClassName,
      expandIcon,
      expandableType,
      expandableConfig.expandRowByClick,
      expandableConfig.expandedRowRender,
      onTriggerExpand,
      expandableConfig.expandIconColumnIndex,
      expandableConfig.indentSize,
      emptyNode,

      // Column
      mergedColumns,
      flattenColumns,
      onColumnResize,
      columnsKey.join('_'),

      // Row
      startRow,
      endRow,
      onHover,
      expandableConfig.rowExpandable,
      onRow,

      getRowKey,
      expandedKeys,
      childrenColumnName,

      rowHoverable,
    ],
  );

  return <TableContext.Provider value={TableContextValue}>{fullTable}</TableContext.Provider>;
}

export type ForwardGenericTable = (<RecordType extends AnyObject = AnyObject>(
  props: InternalTableProps<RecordType> & React.RefAttributes<Reference>,
) => React.ReactElement) & { displayName?: string };

const ForwardTable = React.forwardRef(InternalTable) as ForwardGenericTable;

const ImmutableTable = makeImmutable(ForwardTable, (prev, next) => {
  const { _renderTimes: prevRenderTimes } = prev as Readonly<InternalTableProps<AnyObject>>;
  const { _renderTimes: nextRenderTimes } = next as Readonly<InternalTableProps<AnyObject>>;
  return prevRenderTimes !== nextRenderTimes;
});

export default ImmutableTable;
