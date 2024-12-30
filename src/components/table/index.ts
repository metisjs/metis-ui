import { EXPAND_COLUMN, INTERNAL_COL_DEFINE, INTERNAL_HOOKS } from './constant';
import { FooterComponents as Summary } from './Footer';
import type { ColumnsType, ColumnType, Reference } from './interface';
import type { TableProps } from './InternalTable';
import Table, { genTable } from './InternalTable';
import Column from './sugar/Column';
import ColumnGroup from './sugar/ColumnGroup';
import type { VirtualTableProps } from './VirtualTable';
import VirtualTable, { genVirtualTable } from './VirtualTable';

export {
  genTable,
  Summary,
  Column,
  ColumnGroup,
  type TableProps,
  INTERNAL_COL_DEFINE,
  EXPAND_COLUMN,
  INTERNAL_HOOKS,
  VirtualTable,
  genVirtualTable,
  type VirtualTableProps,
  type Reference,
  type ColumnType,
  type ColumnsType,
};

export default Table;
