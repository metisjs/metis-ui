import type { AnyObject } from '@util/type';
import type { ColumnType } from '../interface';

export interface ColumnProps<RecordType extends AnyObject> extends ColumnType<RecordType> {
  children?: null;
}

/* istanbul ignore next */
/**
 * This is a syntactic sugar for `columns` prop.
 * So HOC will not work on this.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Column<RecordType extends AnyObject>(_: ColumnProps<RecordType>) {
  return null;
}

export default Column;
