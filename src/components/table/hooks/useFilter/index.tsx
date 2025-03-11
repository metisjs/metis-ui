import * as React from 'react';
import type { AnyObject } from '../../../_util/type';
import { devUseWarning } from '../../../_util/warning';
import type {
  ColumnsType,
  ColumnTitleProps,
  ColumnType,
  FilterKey,
  FilterValue,
  GetPopupContainer,
  Key,
  TableLocale,
} from '../../interface';
import { isFilterable, isFilterableWithValueType } from '../../utils/filterUtil';
import { getColumnKey, getColumnPos, renderColumnTitle } from '../../utils/valueUtil';
import FilterDropdown from './FilterDropdown';

export interface FilterState<RecordType extends AnyObject = AnyObject> {
  column: ColumnType<RecordType>;
  key: Key;
  filteredKeys?: FilterKey;
  forceFiltered?: boolean;
}

const collectFilterStates = <RecordType extends AnyObject = AnyObject>(
  columns: ColumnsType<RecordType>,
  init: boolean,
  pos?: string,
): FilterState<RecordType>[] => {
  let filterStates: FilterState<RecordType>[] = [];

  (columns || []).forEach((column, index) => {
    const columnPos = getColumnPos(index, pos);
    const filter = !column.filter || column.filter === true ? {} : column.filter;

    if (isFilterable(column)) {
      if ('filteredValue' in filter) {
        // Controlled
        let filteredValues = filter.filteredValue;
        if (!('dropdown' in filter)) {
          filteredValues = filteredValues?.map(String) ?? filteredValues;
        }
        filterStates.push({
          column,
          key: getColumnKey(column, columnPos),
          filteredKeys: filteredValues as FilterKey,
          forceFiltered: filter.filtered,
        });
      } else {
        // Uncontrolled
        filterStates.push({
          column,
          key: getColumnKey(column, columnPos),
          filteredKeys: (init && filter.defaultFilteredValue
            ? filter.defaultFilteredValue!
            : undefined) as FilterKey,
          forceFiltered: filter.filtered,
        });
      }
    }

    if ('children' in column) {
      filterStates = [...filterStates, ...collectFilterStates(column.children, init, columnPos)];
    }
  });

  return filterStates;
};

function injectFilter<RecordType extends AnyObject = AnyObject>(
  prefixCls: string,
  dropdownPrefixCls: string,
  columns: ColumnsType<RecordType>,
  filterStates: FilterState<RecordType>[],
  locale: TableLocale,
  triggerFilter: (filterState: FilterState<RecordType>) => void,
  getPopupContainer?: GetPopupContainer,
  pos?: string,
  rootClassName?: string,
): ColumnsType<RecordType> {
  return columns.map((column, index) => {
    const columnPos = getColumnPos(index, pos);
    const {
      triggerOnClose = true,
      multiple = true,
      mode,
      search,
    } = !column.filter || column.filter === true ? {} : column.filter;

    let newColumn: ColumnsType<RecordType>[number] = column;

    if (isFilterable(column)) {
      const columnKey = getColumnKey(newColumn, columnPos);
      const filterState = filterStates.find(({ key }) => columnKey === key);

      newColumn = {
        ...newColumn,
        title: (renderProps: ColumnTitleProps<RecordType>) => (
          <FilterDropdown
            tablePrefixCls={prefixCls}
            prefixCls={`${prefixCls}-filter`}
            dropdownPrefixCls={dropdownPrefixCls}
            column={newColumn}
            columnKey={columnKey}
            filterState={filterState}
            filterOnClose={triggerOnClose}
            filterMultiple={multiple}
            filterMode={mode}
            filterSearch={search}
            triggerFilter={triggerFilter}
            locale={locale}
            getPopupContainer={getPopupContainer}
          >
            {renderColumnTitle<RecordType>(column.title, renderProps)}
          </FilterDropdown>
        ),
      };
    }

    if ('children' in newColumn) {
      newColumn = {
        ...newColumn,
        children: injectFilter(
          prefixCls,
          dropdownPrefixCls,
          newColumn.children,
          filterStates,
          locale,
          triggerFilter,
          getPopupContainer,
          columnPos,
          rootClassName,
        ),
      };
    }

    return newColumn;
  });
}

const generateFilterInfo = <RecordType extends AnyObject = AnyObject>(
  filterStates: FilterState<RecordType>[],
): Record<Key, FilterValue | string | undefined> =>
  filterStates
    .filter(({ filteredKeys }) => filteredKeys && filteredKeys.length)
    .reduce(
      (prev, { key, filteredKeys, column }) => {
        if (isFilterableWithValueType(column)) {
        }
        return { ...prev, [key]: filteredKeys };
      },
      {} as Record<Key, FilterValue | string | undefined>,
    );

export interface FilterConfig<RecordType extends AnyObject = AnyObject> {
  prefixCls: string;
  dropdownPrefixCls: string;
  columns?: ColumnsType<RecordType>;
  locale: TableLocale;
  onFilterChange: (
    filters: Record<string, FilterValue | undefined>,
    filterStates: FilterState<RecordType>[],
  ) => void;
  getPopupContainer?: GetPopupContainer;
  rootClassName?: string;
}

const getMergedColumns = <RecordType extends AnyObject = AnyObject>(
  rawMergedColumns: ColumnsType<RecordType>,
): ColumnsType<RecordType> =>
  rawMergedColumns.flatMap((column) => {
    if ('children' in column) {
      return [column, ...getMergedColumns<RecordType>(column.children || [])];
    }
    return [column];
  });

const useFilter = <RecordType extends AnyObject = AnyObject>(
  props: FilterConfig<RecordType>,
): [
  (columns: ColumnsType<RecordType>) => ColumnsType<RecordType>,
  FilterState<RecordType>[],
  Record<string, FilterValue | null>,
] => {
  const {
    prefixCls,
    dropdownPrefixCls,
    columns,
    onFilterChange,
    getPopupContainer,
    locale: tableLocale,
    rootClassName,
  } = props;
  const warning = devUseWarning('Table');

  const mergedColumns = React.useMemo(() => getMergedColumns<RecordType>(columns || []), [columns]);

  const [filterStates, setFilterStates] = React.useState<FilterState<RecordType>[]>(() =>
    collectFilterStates(mergedColumns, true),
  );

  const mergedFilterStates = React.useMemo(() => {
    const collectedStates = collectFilterStates(mergedColumns, false);
    if (collectedStates.length === 0) {
      return collectedStates;
    }
    let filteredKeysIsAllNotControlled = true;
    let filteredKeysIsAllControlled = true;
    collectedStates.forEach(({ filteredKeys }) => {
      if (filteredKeys !== undefined) {
        filteredKeysIsAllNotControlled = false;
      } else {
        filteredKeysIsAllControlled = false;
      }
    });

    // Return if not controlled
    if (filteredKeysIsAllNotControlled) {
      // Filter column may have been removed
      const keyList = (mergedColumns || []).map((column, index) =>
        getColumnKey(column, getColumnPos(index)),
      );
      return filterStates
        .filter(({ key }) => keyList.includes(key))
        .map((item) => {
          const col = mergedColumns[keyList.findIndex((key) => key === item.key)];
          return {
            ...item,
            column: {
              ...item.column,
              ...col,
            },
            forceFiltered: col.filter?.filtered,
          };
        });
    }

    warning(
      filteredKeysIsAllControlled,
      'usage',
      'Columns should all contain `filteredValue` or not contain `filteredValue`.',
    );

    return collectedStates;
  }, [mergedColumns, filterStates]);

  const filters = React.useMemo(
    () => generateFilterInfo<RecordType>(mergedFilterStates),
    [mergedFilterStates],
  );

  const triggerFilter = (filterState: FilterState<RecordType>) => {
    const newFilterStates = mergedFilterStates.filter(({ key }) => key !== filterState.key);
    newFilterStates.push(filterState);
    setFilterStates(newFilterStates);
    onFilterChange(generateFilterInfo<RecordType>(newFilterStates), newFilterStates);
  };

  const transformColumns = (innerColumns: ColumnsType<RecordType>) =>
    injectFilter(
      prefixCls,
      dropdownPrefixCls,
      innerColumns,
      mergedFilterStates,
      tableLocale,
      triggerFilter,
      getPopupContainer,
      undefined,
      rootClassName,
    );

  return [transformColumns, mergedFilterStates, filters] as const;
};

export default useFilter;
