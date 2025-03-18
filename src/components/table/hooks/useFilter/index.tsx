import * as React from 'react';
import toArray from '@util/toArray';
import type { AnyObject } from '../../../_util/type';
import { devUseWarning } from '../../../_util/warning';
import type { FieldValueType } from '../../../form/interface';
import type {
  ColumnTitleProps,
  FilterKey,
  FilterValue,
  GetPopupContainer,
  InternalColumnsType,
  InternalColumnType,
  Key,
  TableLocale,
} from '../../interface';
import { fillFilterProps, isFilterable, isFilterableWithValueType } from '../../utils/filterUtil';
import { getColumnKey, getColumnPos, renderColumnTitle } from '../../utils/valueUtil';
import FilterDropdown from './FilterDropdown';

export interface FilterState<RecordType extends AnyObject = AnyObject> {
  column: InternalColumnType<RecordType>;
  key: Key;
  filteredKeys?: FilterKey;
  forceFiltered?: boolean;
}

const collectFilterStates = <RecordType extends AnyObject = AnyObject>(
  columns: InternalColumnsType<RecordType>,
  init: boolean,
  pos?: string,
): FilterState<RecordType>[] => {
  let filterStates: FilterState<RecordType>[] = [];

  (columns || []).forEach((column, index) => {
    const columnPos = getColumnPos(index, pos);
    const filter = fillFilterProps(column.filter);

    if (isFilterable(column)) {
      if ('filteredValue' in filter) {
        // Controlled
        let filteredValues = toArray(filter.filteredValue);
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
            ? toArray(filter.defaultFilteredValue!)
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
  columns: InternalColumnsType<RecordType>,
  filterStates: FilterState<RecordType>[],
  locale: TableLocale,
  triggerFilter: (filterState: FilterState<RecordType>) => void,
  getPopupContainer?: GetPopupContainer,
  pos?: string,
  rootClassName?: string,
): InternalColumnsType<RecordType> {
  return columns.map((column, index) => {
    const columnPos = getColumnPos(index, pos);
    const { triggerOnClose = true, multiple = true, mode, search } = fillFilterProps(column.filter);

    let newColumn: InternalColumnsType<RecordType>[number] = column;

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
): Record<Key, FilterValue> =>
  filterStates
    .filter(({ filteredKeys }) => filteredKeys && filteredKeys.length)
    .reduce((prev, { key, filteredKeys, column }) => {
      if (isFilterableWithValueType(column)) {
        const valueTypeStr: FieldValueType =
          typeof column.valueType === 'object'
            ? column.valueType.type
            : (column.valueType as FieldValueType);
        if (['text', 'textarea'].includes(valueTypeStr ?? 'text')) {
          return { ...prev, [key]: filteredKeys![0] };
        }
      }
      return { ...prev, [key]: filteredKeys };
    }, {}) as Record<Key, FilterValue>;

export interface FilterConfig<RecordType extends AnyObject = AnyObject> {
  prefixCls: string;
  dropdownPrefixCls: string;
  columns?: InternalColumnsType<RecordType>;
  locale: TableLocale;
  onFilterChange: (
    filters: Record<string, FilterValue>,
    filterStates: FilterState<RecordType>[],
  ) => void;
  getPopupContainer?: GetPopupContainer;
  rootClassName?: string;
}

const getMergedColumns = <RecordType extends AnyObject = AnyObject>(
  rawMergedColumns: InternalColumnsType<RecordType>,
): InternalColumnsType<RecordType> =>
  rawMergedColumns.flatMap((column) => {
    if ('children' in column) {
      return [column, ...getMergedColumns<RecordType>(column.children || [])];
    }
    return [column];
  });

const useFilter = <RecordType extends AnyObject = AnyObject>(
  props: FilterConfig<RecordType>,
): [
  (columns: InternalColumnsType<RecordType>) => InternalColumnsType<RecordType>,
  FilterState<RecordType>[],
  Record<string, FilterValue>,
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

  const mergedFilterStates = React.useMemo<FilterState<RecordType>[]>(() => {
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
          const { filtered } = fillFilterProps(col.filter);
          return {
            ...item,
            column: {
              ...item.column,
              ...col,
            },
            forceFiltered: filtered,
          };
        }) as FilterState<RecordType>[];
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

  const transformColumns = (innerColumns: InternalColumnsType<RecordType>) =>
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
