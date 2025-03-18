import type { AnyObject } from '@util/type';
import type { ColumnTitle, ColumnTitleProps } from '../interface';

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
