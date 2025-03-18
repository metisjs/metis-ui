import type { AnyObject } from '@util/type';
import { INTERNAL_COL_KEY_PREFIX } from '../constant';
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
): InternalColumnsType<RecordType> => {
  const finalColumns = columns?.map((column, index) => {
    let mergedKey = column.key;
    if ('dataIndex' in column && column.dataIndex) {
      mergedKey = Array.isArray(column.dataIndex)
        ? column.dataIndex.join('-')
        : (column.dataIndex as Key);
    }

    if (!mergedKey) {
      mergedKey = `${keyPrefix}_${index}`;
    }

    const cloneColumn: InternalColumnsType<RecordType> | InternalColumnType<RecordType> = {
      ...column,
      key: mergedKey,
    };
    if ('children' in cloneColumn) {
      cloneColumn.children = fillColumnsKey<RecordType>(
        cloneColumn.children as ColumnsType<RecordType>,
        mergedKey,
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
