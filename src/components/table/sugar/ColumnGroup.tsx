import type * as React from 'react';
import type { AnyObject } from '@util/type';
import type { InternalColumnType } from '../interface';
import type { ColumnProps } from './Column';

export interface ColumnGroupProps<RecordType extends AnyObject>
  extends Omit<InternalColumnType<RecordType>, 'children'> {
  children:
    | React.ReactElement<ColumnProps<RecordType>>
    | readonly React.ReactElement<ColumnProps<RecordType>>[];
}

/* istanbul ignore next */
/**
 * This is a syntactic sugar for `columns` prop.
 * So HOC will not work on this.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ColumnGroup<RecordType extends AnyObject>(_: ColumnGroupProps<RecordType>) {
  return null;
}

export default ColumnGroup;
