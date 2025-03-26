import * as React from 'react';
import { CaretDownSolid, CaretUpSolid } from '@metisjs/icons';
import { clsx, mergeSemanticCls } from '@util/classNameUtils';
import type { UrlStateOptions } from '@util/hooks/useUrlState';
import useUrlState from '@util/hooks/useUrlState';
import { useEvent } from 'rc-util';
import type { AnyObject } from '../../_util/type';
import type { TooltipProps } from '../../tooltip';
import Tooltip from '../../tooltip';
import { getTitleFromCellRenderChildren } from '../Cell';
import type {
  ColumnSorter,
  ColumnTitleProps,
  CompareFn,
  InternalColumnsType,
  InternalColumnType,
  Key,
  SorterResult,
  SorterTooltipProps,
  SortOrder,
  TableLocale,
} from '../interface';
import { getFlattenColumns } from './useFilter';

const ASCEND = 'ascend';
const DESCEND = 'descend';

const getMultiplePriority = <RecordType extends AnyObject = AnyObject>(
  column: InternalColumnType<RecordType>,
): number | false => {
  if (typeof column.sorter === 'object' && typeof column.sorter.multiple === 'number') {
    return column.sorter.multiple;
  }
  return false;
};

const getSortFunction = <RecordType extends AnyObject = AnyObject>(
  sorter: InternalColumnType<RecordType>['sorter'],
): CompareFn<RecordType> | false => {
  if (sorter && typeof sorter === 'object' && sorter.compare) {
    return sorter.compare;
  }
  return false;
};

const nextSortDirection = (sortDirections: SortOrder[], current: SortOrder | null) => {
  if (!current) {
    return sortDirections[0];
  }
  return sortDirections[sortDirections.indexOf(current) + 1];
};

export interface SortState<RecordType extends AnyObject = AnyObject> {
  column: InternalColumnType<RecordType>;
  key: Key;
  sortOrder: SortOrder | null;
  multiplePriority: number | false;
}

const collectSortStates = <RecordType extends AnyObject = AnyObject>(
  columns: InternalColumnsType<RecordType>,
  init: boolean,
): SortState<RecordType>[] => {
  let sortStates: SortState<RecordType>[] = [];

  const pushState = (column: InternalColumnsType<RecordType>[number]) => {
    sortStates.push({
      column,
      key: column.key,
      multiplePriority: getMultiplePriority<RecordType>(column),
      sortOrder: (column.sorter as Exclude<ColumnSorter<RecordType>, boolean>).order!,
    });
  };

  (columns || []).forEach((column) => {
    if (column.sorter && typeof column.sorter === 'object') {
      if ('order' in column.sorter) {
        // Controlled
        pushState(column);
      } else if (init && column.sorter.defaultOrder) {
        // Default sorter
        sortStates.push({
          column,
          key: column.key,
          multiplePriority: getMultiplePriority<RecordType>(column),
          sortOrder: column.sorter.defaultOrder!,
        });
      }
    }
  });

  return sortStates;
};

const injectSorter = <RecordType extends AnyObject = AnyObject>(
  prefixCls: string,
  columns: InternalColumnsType<RecordType>,
  sorterStates: SortState<RecordType>[],
  triggerSorter: (sorterSates: SortState<RecordType>) => void,
  defaultSortDirections: SortOrder[],
  tableLocale?: TableLocale,
  tableShowSorterTooltip?: boolean | SorterTooltipProps,
): InternalColumnsType<RecordType> => {
  const finalColumns = (columns || []).map((column) => {
    let newColumn: InternalColumnsType<RecordType>[number] = column;
    if (newColumn.sorter) {
      const sorter = typeof newColumn.sorter === 'object' ? newColumn.sorter : {};
      const sortDirections: SortOrder[] = sorter.directions || defaultSortDirections;
      const showSorterTooltip =
        sorter.showTooltip === undefined ? tableShowSorterTooltip : sorter.showTooltip;

      const columnKey = newColumn.key;
      const sorterState = sorterStates.find(({ key }) => key === columnKey);
      const sortOrder = sorterState ? sorterState.sortOrder : null;
      const nextSortOrder = nextSortDirection(sortDirections, sortOrder);

      let sorterNode: React.ReactNode;
      if (sorter.icon) {
        sorterNode = sorter.icon({ order: sortOrder });
      } else {
        const upNode: React.ReactNode = sortDirections.includes(ASCEND) && (
          <CaretUpSolid
            className={clsx(
              `${prefixCls}-column-sorter-up`,
              {
                active: sortOrder === ASCEND,
              },
              {
                'text-primary': sortOrder === ASCEND,
              },
            )}
          />
        );
        const downNode: React.ReactNode = sortDirections.includes(DESCEND) && (
          <CaretDownSolid
            className={clsx(
              `${prefixCls}-column-sorter-down`,
              {
                active: sortOrder === DESCEND,
              },
              {
                '-mt-[0.25rem]': upNode,
                'text-primary': sortOrder === DESCEND,
              },
            )}
          />
        );
        sorterNode = (
          <span
            className={clsx(
              `${prefixCls}-column-sorter`,
              {
                [`${prefixCls}-column-sorter-full`]: !!(upNode && downNode),
              },
              'ms-1 flex items-center text-xs text-text-tertiary transition-colors group-hover/sorter-header:text-text-secondary',
            )}
          >
            <span
              className={clsx(
                `${prefixCls}-column-sorter-inner`,
                'inline-flex flex-col items-center',
              )}
              aria-hidden="true"
            >
              {upNode}
              {downNode}
            </span>
          </span>
        );
      }

      const { sort } = tableLocale || {};
      let sortTip: string | undefined = sort?.cancel;
      if (nextSortOrder === DESCEND) {
        sortTip = sort?.triggerDesc;
      } else if (nextSortOrder === ASCEND) {
        sortTip = sort?.triggerAsc;
      }
      const tooltipProps: TooltipProps =
        typeof showSorterTooltip === 'object'
          ? {
              title: sortTip,
              ...showSorterTooltip,
            }
          : { title: sortTip };

      const columnSortersClass = clsx(
        `${prefixCls}-column-sorters`,
        'flex items-center justify-between after:absolute after:inset-0 after:h-full after:w-full',
      );
      const renderColumnTitleWrapper = (
        <span className={clsx(`${prefixCls}-column-title`, 'relative flex-1')}>
          {column.title as React.ReactNode}
        </span>
      );
      const renderSortTitle = (
        <div className={columnSortersClass}>
          {renderColumnTitleWrapper}
          {sorterNode}
        </div>
      );

      let mergedTitle = renderSortTitle;
      if (showSorterTooltip) {
        if (typeof showSorterTooltip !== 'boolean' && showSorterTooltip?.target === 'sorter-icon') {
          mergedTitle = (
            <div
              className={`${columnSortersClass} ${prefixCls}-column-sorters-tooltip-target-sorter`}
            >
              {renderColumnTitleWrapper}
              <Tooltip {...tooltipProps}>{sorterNode}</Tooltip>
            </div>
          );
        } else {
          mergedTitle = <Tooltip {...tooltipProps}>{renderSortTitle}</Tooltip>;
        }
      }

      newColumn = {
        ...newColumn,
        className: mergeSemanticCls(
          clsx({ [`${prefixCls}-column-sort`]: sortOrder }, { 'bg-fill-quinary': sortOrder }),
          newColumn.className,
        ),
        title: mergedTitle,
        onHeaderCell: (col) => {
          const cell: React.HTMLAttributes<HTMLElement> = column.onHeaderCell?.(col) || {};
          const originOnClick = cell.onClick;
          const originOKeyDown = cell.onKeyDown;
          cell.onClick = (event: React.MouseEvent<HTMLElement>) => {
            triggerSorter({
              column,
              key: columnKey,
              sortOrder: nextSortOrder,
              multiplePriority: getMultiplePriority<RecordType>(column),
            });
            originOnClick?.(event);
          };
          cell.onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
            if (event.key === 'Enter') {
              triggerSorter({
                column,
                key: columnKey,
                sortOrder: nextSortOrder,
                multiplePriority: getMultiplePriority<RecordType>(column),
              });
              originOKeyDown?.(event);
            }
          };

          const renderTitle = getTitleFromCellRenderChildren({
            ellipsis: column.ellipsis,
            rowType: 'header',
            children: typeof column.title === 'function' ? column.title({}) : column.title,
          });
          const displayTitle = renderTitle?.toString();

          // Inform the screen-reader so it can tell the visually impaired user which column is sorted
          if (sortOrder) {
            cell['aria-sort'] = sortOrder === 'ascend' ? 'ascending' : 'descending';
          } else {
            cell['aria-label'] = displayTitle || '';
          }
          cell.className = clsx(
            `${prefixCls}-column-has-sorters`,
            'group/sorter-header',
            'cursor-pointer hover:bg-fill-quinary',
            cell.className,
          );
          cell.tabIndex = 0;
          if (column.ellipsis) {
            cell.title = (renderTitle ?? '').toString();
          }
          return cell;
        },
      };
    }

    if ('children' in newColumn) {
      newColumn = {
        ...newColumn,
        children: injectSorter(
          prefixCls,
          newColumn.children,
          sorterStates,
          triggerSorter,
          defaultSortDirections,
          tableLocale,
          tableShowSorterTooltip,
        ),
      };
    }

    return newColumn;
  });
  return finalColumns;
};

const stateToInfo = <RecordType extends AnyObject = AnyObject>(
  sorterState: SortState<RecordType>,
): SorterResult => {
  const { column, sortOrder } = sorterState;
  return {
    order: sortOrder,
    field: column.dataIndex as SorterResult['field'],
    columnKey: column.key,
  };
};

const generateSorterInfo = <RecordType extends AnyObject = AnyObject>(
  sorterStates: SortState<RecordType>[],
  multiple?: boolean,
): SorterResult | SorterResult[] => {
  const activeSorters = sorterStates
    .filter(({ sortOrder }) => sortOrder)
    .sort((a, b) => (b.multiplePriority as number) - (a.multiplePriority as number))
    .map<SorterResult>(stateToInfo);

  if (!multiple) {
    return activeSorters[0] || {};
  }

  return activeSorters;
};

export const getSortData = <RecordType extends AnyObject = AnyObject>(
  data: readonly RecordType[],
  sortStates: SortState<RecordType>[],
  childrenColumnName: keyof RecordType,
): RecordType[] => {
  const innerSorterStates = sortStates
    .slice()
    .sort((a, b) => (b.multiplePriority as number) - (a.multiplePriority as number));

  const cloneData = data.slice();

  const runningSorters = innerSorterStates.filter(
    ({ column: { sorter }, sortOrder }) => getSortFunction<RecordType>(sorter) && sortOrder,
  );

  // Skip if no sorter needed
  if (!runningSorters.length) {
    return cloneData;
  }

  return cloneData
    .sort((record1, record2) => {
      for (let i = 0; i < runningSorters.length; i += 1) {
        const sorterState = runningSorters[i];
        const {
          column: { sorter },
          sortOrder,
        } = sorterState;

        const compareFn = getSortFunction<RecordType>(sorter);

        if (compareFn && sortOrder) {
          const compareResult = compareFn(record1, record2, sortOrder);

          if (compareResult !== 0) {
            return sortOrder === ASCEND ? compareResult : -compareResult;
          }
        }
      }

      return 0;
    })
    .map<RecordType>((record) => {
      const subRecords = record[childrenColumnName];
      if (subRecords) {
        return {
          ...record,
          [childrenColumnName]: getSortData<RecordType>(subRecords, sortStates, childrenColumnName),
        };
      }
      return record;
    });
};

interface SorterConfig<RecordType extends AnyObject = AnyObject> {
  prefixCls: string;
  columns?: InternalColumnsType<RecordType>;
  onSorterChange: (
    sorterResult: SorterResult | SorterResult[],
    sortStates: SortState<RecordType>[],
  ) => void;
  sortDirections: SortOrder[];
  tableLocale?: TableLocale;
  showSorterTooltip?: boolean | SorterTooltipProps;
  syncToUrl?: UrlStateOptions;
}

const useSorter = <RecordType extends AnyObject = AnyObject>(
  props: SorterConfig<RecordType>,
): [
  (columns: InternalColumnsType<RecordType>) => InternalColumnsType<RecordType>,
  SortState<RecordType>[],
  ColumnTitleProps<RecordType>,
  () => SorterResult | SorterResult[],
] => {
  const {
    prefixCls,
    columns = [],
    sortDirections,
    tableLocale,
    showSorterTooltip,
    syncToUrl,
    onSorterChange,
  } = props;

  const [flattenColumns, columnKeyMap] = React.useMemo(() => {
    const columnList = getFlattenColumns<RecordType>(columns || []);
    const columnKeyMap = columnList.reduce(
      (prev, curr) => ({ ...prev, [curr.key]: curr }),
      {} as Record<Key, InternalColumnType<RecordType>>,
    );

    return [columnList, columnKeyMap];
  }, [columns]);

  const [sortStates, setSortStates] = useUrlState<Record<Key, SortOrder>, SortState<RecordType>[]>(
    'sorter',
    () => collectSortStates<RecordType>(flattenColumns, true),
    {
      ...syncToUrl,
      transform: (state, type) => {
        if (type === 'get') {
          return Object.keys(state as Record<Key, SortOrder>).map(
            (key: keyof Record<Key, SortOrder>) => ({
              column: columnKeyMap[key],
              key,
              sortOrder: (state as Record<Key, SortOrder>)[key],
              multiplePriority: getMultiplePriority(columnKeyMap[key]),
            }),
          );
        }

        return (state as SortState<RecordType>[]).reduce(
          (prev, curr) => ({ ...prev, [curr.key]: curr.sortOrder }),
          {},
        );
      },
    },
  );

  const multiple = React.useMemo(
    () => flattenColumns.some((column) => getMultiplePriority(column) !== false),
    [flattenColumns],
  );

  const mergedSorterStates = React.useMemo<SortState<RecordType>[]>(() => {
    let validate = true;
    const collectedStates = collectSortStates<RecordType>(flattenColumns, false);

    // Return if not controlled
    if (!collectedStates.length) {
      const columnsKeys = flattenColumns.map(({ key }) => key);
      return sortStates.filter(({ key }) => columnsKeys.includes(key));
    }

    const validateStates: SortState<RecordType>[] = [];

    function patchStates(state: SortState<RecordType>) {
      if (validate) {
        validateStates.push(state);
      } else {
        validateStates.push({
          ...state,
          sortOrder: null,
        });
      }
    }

    let multipleMode: boolean | null = null;
    collectedStates.forEach((state) => {
      if (multipleMode === null) {
        patchStates(state);

        if (state.sortOrder) {
          if (state.multiplePriority === false) {
            validate = false;
          } else {
            multipleMode = true;
          }
        }
      } else if (multipleMode && state.multiplePriority !== false) {
        patchStates(state);
      } else {
        validate = false;
        patchStates(state);
      }
    });

    return validateStates;
  }, [flattenColumns, sortStates]);

  // Get render columns title required props
  const columnTitleSorterProps = React.useMemo<ColumnTitleProps<RecordType>>(() => {
    const sortColumns = mergedSorterStates.map(({ column, sortOrder }) => ({
      column,
      order: sortOrder,
    }));

    return {
      sortColumns,
    };
  }, [mergedSorterStates]);

  const triggerSorter = (sortState: SortState<RecordType>) => {
    let newSorterStates: SortState<RecordType>[];
    if (
      sortState.multiplePriority === false ||
      !mergedSorterStates.length ||
      mergedSorterStates[0].multiplePriority === false
    ) {
      newSorterStates = [sortState];
    } else {
      newSorterStates = [
        ...mergedSorterStates.filter(({ key }) => key !== sortState.key),
        sortState,
      ];
    }
    setSortStates(newSorterStates);
    onSorterChange(generateSorterInfo(newSorterStates, multiple), newSorterStates);
  };

  const transformColumns = useEvent((innerColumns: InternalColumnsType<RecordType>) =>
    injectSorter(
      prefixCls,
      innerColumns,
      mergedSorterStates,
      triggerSorter,
      sortDirections,
      tableLocale,
      showSorterTooltip,
    ),
  );

  const getSorters = () => generateSorterInfo(mergedSorterStates, multiple);

  return [transformColumns, mergedSorterStates, columnTitleSorterProps, getSorters] as const;
};

export default useSorter;
