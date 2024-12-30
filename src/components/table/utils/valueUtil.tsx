import toArray from '@util/toArray';
import type { AnyObject } from '@util/type';
import type { DataIndex, Key } from '../interface';

const INTERNAL_KEY_PREFIX = 'METIS_TABLE_KEY';

export interface GetColumnKeyColumn<T = any> {
  key?: Key;
  dataIndex?: DataIndex<T>;
}

export function getColumnsKey<T = any>(columns: readonly GetColumnKeyColumn<T>[]) {
  const columnKeys: React.Key[] = [];
  const keys: Record<PropertyKey, boolean> = {};

  columns.forEach((column) => {
    const { key, dataIndex } = column || {};

    let mergedKey = key || toArray(dataIndex).join('-') || INTERNAL_KEY_PREFIX;
    while (keys[mergedKey as string]) {
      mergedKey = `${mergedKey}_next`;
    }
    keys[mergedKey as string] = true;

    columnKeys.push(mergedKey);
  });

  return columnKeys;
}

export const getColumnKey = <RecordType extends AnyObject = AnyObject>(
  column: GetColumnKeyColumn<RecordType>,
  defaultKey: string,
): Key => {
  if ('key' in column && column.key !== undefined && column.key !== null) {
    return column.key;
  }
  if (column.dataIndex) {
    return Array.isArray(column.dataIndex) ? column.dataIndex.join('.') : (column.dataIndex as Key);
  }
  return defaultKey;
};

export function getColumnPos(index: number, pos?: string) {
  return pos ? `${pos}-${index}` : `${index}`;
}

export function validateValue<T>(val: T) {
  return val !== null && val !== undefined;
}

export function validNumberValue(value: any) {
  return typeof value === 'number' && !Number.isNaN(value);
}
