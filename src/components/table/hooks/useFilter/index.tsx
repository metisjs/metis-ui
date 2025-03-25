import * as React from 'react';
import toArray from '@util/toArray';
import { useEvent } from 'rc-util';
import type { AnyObject } from '../../../_util/type';
import { devUseWarning } from '../../../_util/warning';
import type { FieldValueType } from '../../../form/interface';
import type {
  FilterKey,
  FilterValue,
  GetPopupContainer,
  InternalColumnsType,
  InternalColumnType,
  Key,
  TableLocale,
} from '../../interface';
import { fillFilterProps, isFilterable, isFilterableWithValueType } from '../../utils/filterUtil';
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
): FilterState<RecordType>[] => {
  let filterStates: FilterState<RecordType>[] = [];

  (columns || []).forEach((column) => {
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
          key: column.key,
          filteredKeys: filteredValues as FilterKey,
          forceFiltered: filter.filtered,
        });
      } else {
        // Uncontrolled
        filterStates.push({
          column,
          key: column.key,
          filteredKeys: (init && filter.defaultFilteredValue
            ? toArray(filter.defaultFilteredValue!)
            : undefined) as FilterKey,
          forceFiltered: filter.filtered,
        });
      }
    }

    if ('children' in column) {
      filterStates = [...filterStates, ...collectFilterStates(column.children, init)];
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
  rootClassName?: string,
): InternalColumnsType<RecordType> {
  return columns.map((column) => {
    const { triggerOnClose = true, multiple = true, mode, search } = fillFilterProps(column.filter);

    let newColumn: InternalColumnsType<RecordType>[number] = column;

    if (isFilterable(column)) {
      const columnKey = newColumn.key;
      const filterState = filterStates.find(({ key }) => columnKey === key);

      const title = (
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
          {column.rawTitle}
        </FilterDropdown>
      );

      newColumn = {
        ...newColumn,
        title,
        rawTitle: title,
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
        let valueTypeStr: FieldValueType =
          (typeof column.valueType === 'object'
            ? column.valueType.type
            : (column.valueType as FieldValueType)) ?? 'text';
        valueTypeStr = valueTypeStr === 'text' && !!column.valueEnum ? 'select' : valueTypeStr;
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

export const getFlattenColumns = <RecordType extends AnyObject = AnyObject>(
  columns: InternalColumnsType<RecordType>,
): InternalColumnsType<RecordType> =>
  columns.flatMap((column) => {
    if ('children' in column) {
      return [column, ...getFlattenColumns<RecordType>(column.children || [])];
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

  const mergedColumns = React.useMemo(
    () => getFlattenColumns<RecordType>(columns || []),
    [columns],
  );

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
      const keyList = (mergedColumns || []).map((column) => column.key);
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

  const transformColumns = useEvent((innerColumns: InternalColumnsType<RecordType>) =>
    injectFilter(
      prefixCls,
      dropdownPrefixCls,
      innerColumns,
      mergedFilterStates,
      tableLocale,
      triggerFilter,
      getPopupContainer,
      rootClassName,
    ),
  );

  return [transformColumns, mergedFilterStates, filters] as const;
};

export default useFilter;
