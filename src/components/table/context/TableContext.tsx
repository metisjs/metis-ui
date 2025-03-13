import { createContext, createImmutable } from '@rc-component/context';
import type { AnyObject } from '@util/type';
import type { FormInstance } from '../../form';
import type {
  ColumnsType,
  ColumnType,
  ExpandableType,
  ExpandedRowRender,
  GetComponent,
  GetComponentProps,
  GetRowKey,
  Key,
  RenderExpandIcon,
  RowClassName,
  TableLayout,
  TriggerEventHandler,
} from '../interface';
import type { FixedInfo } from '../utils/fixUtil';

const { makeImmutable, responseImmutable, useImmutableMark } = createImmutable();
export { makeImmutable, responseImmutable, useImmutableMark };

export interface TableContextProps<RecordType extends AnyObject = AnyObject> {
  // Scroll
  scrollX?: number | string | true;

  // Table
  prefixCls: string;
  getComponent: GetComponent;
  fixedInfoList: readonly FixedInfo[];
  isSticky: boolean;
  componentWidth: number;
  fixHeader: boolean;
  fixFooter?: boolean | 'top' | 'bottom';
  fixColumn: boolean;
  horizonScroll: boolean;
  selectedRowKeys: Set<React.Key>;
  size: 'default' | 'middle' | 'small';
  verticalLine?: boolean;
  tableKey: string;

  // Body
  rowClassName?: string | RowClassName<RecordType>;
  expandedRowClassName?: string | RowClassName<RecordType>;
  onRow?: GetComponentProps<RecordType>;
  emptyNode?: React.ReactNode;

  tableLayout: TableLayout;

  indentSize: number;
  expandableType: ExpandableType;
  expandRowByClick: boolean;
  expandedRowRender?: ExpandedRowRender<RecordType>;
  expandIcon: RenderExpandIcon<RecordType>;
  onTriggerExpand: TriggerEventHandler<RecordType>;
  expandIconColumnIndex: number;
  allColumnsFixedLeft: boolean;

  // Column
  columns: ColumnsType<RecordType>;
  flattenColumns: readonly ColumnType<RecordType>[];
  onColumnResize: (columnKey: React.Key, width: number) => void;

  // Row
  hoverStartRow: number;
  hoverEndRow: number;
  onHover: (start: number, end: number) => void;
  rowExpandable?: (record: RecordType) => boolean;
  editingRowKey?: Key;
  startEdit: (recordKey: Key, form: FormInstance) => boolean;
  actionRender: (record: RecordType, index: number) => React.ReactNode[];

  expandedKeys: Set<Key>;
  getRowKey: GetRowKey<RecordType>;
  childrenColumnName: keyof RecordType;

  rowHoverable?: boolean;
}

const TableContext = createContext<TableContextProps>();

export default TableContext;
