import type { AnyObject } from '@util/type';
import { EXPAND_COLUMN, INTERNAL_COL_KEY_PREFIX, SELECTION_COLUMN } from '../constant';
import type {
  ColumnsType,
  ColumnTitle,
  ColumnTitleProps,
  InternalColumnsType,
  InternalColumnType,
  Key,
} from '../interface';

export const fillColumnsKey = <RecordType extends AnyObject = AnyObject>(
  columns?: ColumnsType<RecordType>,
  keyPrefix: Key = INTERNAL_COL_KEY_PREFIX,
  existKeys: Set<Key> = new Set(),
): InternalColumnsType<RecordType> => {
  const finalColumns = columns?.map((column, index) => {
    if (column === EXPAND_COLUMN || column === SELECTION_COLUMN) {
      return column;
    }

    let mergedKey = column.key;
    if (!mergedKey && 'dataIndex' in column && column.dataIndex) {
      mergedKey = Array.isArray(column.dataIndex)
        ? column.dataIndex.join('.')
        : (column.dataIndex as Key);
    }

    if (!mergedKey) {
      mergedKey = `${keyPrefix}_${index}`;
    }

    while (existKeys.has(mergedKey)) {
      mergedKey = `${mergedKey}_next`;
    }

    existKeys.add(mergedKey);

    const cloneColumn: InternalColumnsType<RecordType> | InternalColumnType<RecordType> = {
      ...column,
      key: mergedKey,
    };
    if ('children' in cloneColumn) {
      cloneColumn.children = fillColumnsKey<RecordType>(
        cloneColumn.children as ColumnsType<RecordType>,
        mergedKey,
        existKeys,
      );
    }
    return cloneColumn;
  });
  return finalColumns as InternalColumnsType<RecordType>;
};

export function getColumnsKey<RecordType extends AnyObject = AnyObject>(
  columns: InternalColumnsType<RecordType>,
) {
  return columns.map(({ key }) => key);
}

export const renderColumnTitle = <RecordType extends AnyObject = AnyObject>(
  title: ColumnTitle<RecordType>,
  props: ColumnTitleProps<RecordType>,
) => {
  if (typeof title === 'function') {
    return title(props);
  }
  return title;
};

export function validateValue<T>(val: T) {
  return val !== null && val !== undefined;
}

export function validNumberValue(value: any) {
  return typeof value === 'number' && !Number.isNaN(value);
}
