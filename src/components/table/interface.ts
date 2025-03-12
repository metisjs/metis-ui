import type * as React from 'react';
import type { SemanticClassName } from '@util/classNameUtils';
import type { Breakpoint } from '@util/responsiveObserver';
import type { AnyObject, RequestConfig, SafeKey } from '@util/type';
import type { DeepNamePath } from 'rc-field-form/lib/namePathType';
import type { CheckboxProps } from '../checkbox';
import type { DropdownProps } from '../dropdown';
import type { FormInstance, FormItemProps, FormProps } from '../form';
import type {
  FieldValueEnumMap,
  FieldValueEnumObj,
  FieldValueEnumRequestType,
  FieldValueType,
  FieldValueTypeWithFieldProps,
} from '../form/interface';
import type { PaginationProps } from '../pagination';
import type { ScrollbarProps, ScrollbarRef } from '../scrollbar';
import type { TooltipProps } from '../tooltip';
import type { SelectedKeysType } from './hooks/useFilter/FilterDropdown';
import type { InternalSelectionItem } from './hooks/useSelection';

export type Key = SafeKey;

export type FixedType = 'left' | 'right' | boolean;

export type TableLayout = 'auto' | 'fixed';

export type ScrollConfig = {
  index?: number;
  key?: Key;
  top?: number;
};

export type Reference = {
  nativeElement: HTMLDivElement;
  scrollTo: (config: ScrollConfig) => void;
};

export type GetPopupContainer = (triggerNode: HTMLElement) => HTMLElement;

// ==================== Row =====================
export type RowClassName<RecordType> = (
  record: RecordType,
  index: number,
  indent: number,
) => string;

// =================== Column ===================
export type SortOrder = 'descend' | 'ascend' | null;

export type SorterTooltipTarget = 'full-header' | 'sorter-icon';

export type SorterTooltipProps = TooltipProps & {
  target?: SorterTooltipTarget;
};

const _TableActions = ['paginate', 'sort', 'filter'] as const;
export type TableAction = (typeof _TableActions)[number];

export type CompareFn<T = AnyObject> = (a: T, b: T, sortOrder?: SortOrder) => number;

export interface ColumnFilterItem {
  label: React.ReactNode;
  value: Key | boolean;
  children?: ColumnFilterItem[];
}

export interface ColumnTitleProps<RecordType extends AnyObject = AnyObject> {
  sortColumns?: { column: ColumnType<RecordType>; order: SortOrder }[];
  filters?: Record<string, FilterValue>;
}

export type ColumnTitle<RecordType extends AnyObject = AnyObject> =
  | React.ReactNode
  | ((props: ColumnTitleProps<RecordType>) => React.ReactNode);

export interface TableCurrentDataSource<RecordType = AnyObject> {
  currentDataSource: RecordType[];
  action: TableAction;
}

export interface SorterResult<RecordType extends AnyObject = AnyObject> {
  column?: ColumnType<RecordType>;
  order?: SortOrder;
  field?: Key | readonly Key[];
  columnKey?: Key;
}

export type FilterValue = (Key | boolean)[];
export type FilterKey = (string | number)[] | null;
export type FilterSearchType<RecordType = AnyObject> =
  | boolean
  | ((input: string, record: RecordType) => boolean);
export interface FilterConfirmProps {
  closeDropdown: boolean;
}

export interface FilterRestProps {
  confirm?: boolean;
  closeDropdown?: boolean;
}

export interface ColumnFilterItem {
  label: React.ReactNode;
  value: Key | boolean;
  children?: ColumnFilterItem[];
}

export interface FilterDropdownProps {
  prefixCls: string;
  setSelectedKeys: (selectedKeys: SelectedKeysType) => void;
  selectedKeys: SelectedKeysType;
  /**
   * Confirm filter value, if you want to close dropdown before commit, you can call with
   * {closeDropdown: true}
   */
  confirm: (param?: FilterConfirmProps) => void;
  clearFilters?: (param?: FilterRestProps) => void;
  filters?: ColumnFilterItem[];
  /** Only close filterDropdown */
  close: () => void;
  open: boolean;
}

export interface CellType<RecordType extends AnyObject> {
  key?: Key;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  column?: ColumnsType<RecordType>[number];
  colSpan?: number;
  rowSpan?: number;

  /** Only used for table header */
  hasSubColumns?: boolean;
  colStart?: number;
  colEnd?: number;
}

export type DataIndex<T = any> = DeepNamePath<T> | number | string;

export type CellEllipsisType = { showTitle?: boolean } | boolean;

export type ColScopeType = 'col' | 'colgroup';

export type RowScopeType = 'row' | 'rowgroup';

export type ScopeType = ColScopeType | RowScopeType;

interface ColumnSharedType<RecordType extends AnyObject> {
  key?: Key;
  className?: SemanticClassName<
    { root: string },
    { rowType?: 'header' | 'body' | 'footer'; hovering?: boolean }
  >;
  hidden?: boolean;
  fixed?: FixedType;
  onHeaderCell?: GetComponentProps<ColumnsType<RecordType>[number]>;
  ellipsis?: CellEllipsisType;
  align?: AlignType;
  rowScope?: RowScopeType;
  // Sorter
  sorter?: ColumnSorter<RecordType>;
  // Filter
  filter?: ColumnFilter<RecordType>;
  // Responsive
  responsive?: Breakpoint[];
}

export interface ColumnGroupType<RecordType extends AnyObject>
  extends ColumnSharedType<RecordType> {
  title?: React.ReactNode;
  children: ColumnsType<RecordType>;
}

export type AlignType = 'start' | 'end' | 'left' | 'right' | 'center' | 'justify' | 'match-parent';

interface CoverableDropdownProps extends Omit<DropdownProps, 'onOpenChange'> {
  onOpenChange?: (open: boolean) => void;
}

export type ColumnSorter<RecordType extends AnyObject> =
  | boolean
  | {
      compare?: CompareFn<RecordType>;
      /** Config multiple sorter order priority */
      multiple?: number;
      order?: SortOrder;
      defaultOrder?: SortOrder;
      directions?: SortOrder[];
      icon?: (props: { order: SortOrder }) => React.ReactNode;
      showTooltip?: boolean | SorterTooltipProps;
    };

export type ColumnFilter<RecordType extends AnyObject> =
  | boolean
  | {
      filtered?: boolean;
      items?: ColumnFilterItem[];
      dropdown?: React.ReactNode | ((props: FilterDropdownProps) => React.ReactNode);
      triggerOnClose?: boolean;
      multiple?: boolean;
      filteredValue?: FilterValue | null | string;
      defaultFilteredValue?: FilterValue | null | string;
      icon?: React.ReactNode | ((filtered: boolean) => React.ReactNode);
      mode?: 'menu' | 'tree';
      search?: FilterSearchType<ColumnFilterItem>;
      onFilter?: (value: any, record: RecordType) => boolean;
      dropdownProps?: CoverableDropdownProps;
      resetToDefaultFilteredValue?: boolean;
    };

export type ColumnValueEnum<RecordType extends AnyObject> =
  | ((
      record: RecordType,
      index: number,
    ) => FieldValueEnumObj | FieldValueEnumMap | FieldValueEnumRequestType)
  | FieldValueEnumObj
  | FieldValueEnumMap
  | FieldValueEnumRequestType;

export type ColumnEditableConfig<
  RecordType extends AnyObject,
  ValueType extends FieldValueType = 'text',
> = {
  editorProps?: FieldValueTypeWithFieldProps[ValueType]['edit'];
  editorRender?: (form: FormInstance<RecordType>) => React.ReactNode;
} & Omit<FormItemProps<RecordType>, 'children'>;

export type ColumnEditable<
  RecordType extends AnyObject,
  ValueType extends FieldValueType = 'text',
> =
  | boolean
  | ColumnEditableConfig<RecordType, ValueType>
  | ((
      form: FormInstance,
      record: RecordType,
      index: number,
    ) => boolean | ColumnEditableConfig<RecordType, ValueType>);

export type ColumnRenderActionType = {
  startEdit: () => boolean;
};

export type ColumnValueTypeWithEditable<RecordType extends AnyObject> =
  | {
      valueType?: 'text';
      editable?: ColumnEditable<RecordType, 'text'>;
    }
  | {
      [K in FieldValueType]: {
        valueType:
          | K
          | ({
              type: K;
            } & FieldValueTypeWithFieldProps[K]['read'])
          | ((
              record: RecordType,
              index: number,
            ) =>
              | K
              | ({
                  type: K;
                } & FieldValueTypeWithFieldProps[K]['read']));
        editable?: ColumnEditable<RecordType, K>;
      };
    }[FieldValueType];

export type ColumnType<RecordType extends AnyObject> = {
  title?: ColumnTitle<RecordType>;
  colSpan?: number;
  dataIndex?: DataIndex<RecordType>;
  render?: (
    value: any,
    record: RecordType,
    index: number,
    action: ColumnRenderActionType,
  ) => React.ReactNode;
  shouldCellUpdate?: (record: RecordType, prevRecord: RecordType) => boolean;
  rowSpan?: number;
  width?: number | string;
  minWidth?: number;
  onCell?: GetComponentProps<RecordType>;
  valueEnum?: ColumnValueEnum<RecordType>;
} & ColumnValueTypeWithEditable<RecordType> &
  ColumnSharedType<RecordType>;

export type ColumnsType<RecordType extends AnyObject = AnyObject> = readonly (
  | ColumnGroupType<RecordType>
  | ColumnType<RecordType>
)[];

export type GetRowKey<RecordType> = (record: RecordType, index?: number) => Key;

// ================= Fix Column =================
export interface StickyOffsets {
  left: readonly number[];
  right: readonly number[];
  isSticky?: boolean;
}

export interface ColumnsPos {
  left: readonly number[];
  right: readonly number[];
}

export interface ScrollOffset {
  left: number;
  right: number;
}

// ================= Customized =================
export type GetComponentProps<DataType> = (
  data: DataType,
  index?: number,
) => React.HTMLAttributes<any> & React.TdHTMLAttributes<any>;

type Component<P> =
  | React.ComponentType<P>
  | React.ForwardRefExoticComponent<P>
  | React.FC<P>
  | keyof React.ReactHTML;

export type CustomizeComponent = Component<any>;

export type CustomizeScrollBody<RecordType> = (
  data: readonly RecordType[],
  info: {
    ref: React.Ref<ScrollbarRef>;
    onScroll: ScrollbarProps['onScroll'];
  },
) => React.ReactNode;

export interface TableComponents<RecordType> {
  table?: CustomizeComponent;
  header?: {
    table?: CustomizeComponent;
    wrapper?: CustomizeComponent;
    row?: CustomizeComponent;
    cell?: CustomizeComponent;
  };
  body?:
    | CustomizeScrollBody<RecordType>
    | {
        wrapper?: CustomizeComponent;
        row?: CustomizeComponent;
        cell?: CustomizeComponent;
      };
}

export type GetComponent = (
  path: readonly string[],
  defaultComponent?: CustomizeComponent,
) => CustomizeComponent;

// =================== Expand ===================
export type ExpandableType = false | 'row' | 'nest';

export type ExpandedRowRender<ValueType> = (
  record: ValueType,
  index: number,
  indent: number,
  expanded: boolean,
) => React.ReactNode;

export interface RenderExpandIconProps<RecordType> {
  prefixCls: string;
  expanded: boolean;
  record: RecordType;
  expandable: boolean;
  nestExpandable: boolean;
  onExpand: TriggerEventHandler<RecordType>;
}

export type RenderExpandIcon<RecordType> = (
  props: RenderExpandIconProps<RecordType>,
) => React.ReactNode;

export interface ExpandableConfig<RecordType> {
  expandedRowKeys?: readonly Key[];
  defaultExpandedRowKeys?: readonly Key[];
  expandedRowRender?: ExpandedRowRender<RecordType>;
  columnTitle?: React.ReactNode;
  expandRowByClick?: boolean;
  expandIcon?: RenderExpandIcon<RecordType>;
  onExpand?: (expanded: boolean, record: RecordType) => void;
  onExpandedRowsChange?: (expandedKeys: readonly Key[]) => void;
  defaultExpandAllRows?: boolean;
  indentSize?: number;
  expandIconColumnIndex?: number;
  showExpandColumn?: boolean;
  expandedRowClassName?: string | RowClassName<RecordType>;
  childrenColumnName?: keyof RecordType;
  rowExpandable?: (record: RecordType) => boolean;
  columnWidth?: number | string;
  fixed?: FixedType;
}

// =================== Events ===================
export type TriggerEventHandler<RecordType> = (
  record: RecordType,
  event: React.MouseEvent<HTMLElement>,
) => void;

// =================== Sticky ===================
export interface TableSticky {
  offsetHeader?: number;
  offsetSummary?: number;
  offsetScroll?: number;
  getContainer?: () => Window | HTMLElement;
}

// =================== Selection ===================
export type RowSelectionType = 'checkbox' | 'radio';

export type SelectionSelectFn<T = AnyObject> = (
  record: T,
  selected: boolean,
  selectedRows: T[],
  nativeEvent: Event,
) => void;

export type RowSelectMethod = 'all' | 'none' | 'invert' | 'single' | 'multiple';

export type SelectionItemSelectFn = (currentRowKeys: Key[]) => void;

export interface SelectionItem {
  key: string;
  label: React.ReactNode;
  onSelect?: SelectionItemSelectFn;
}

export interface TableRowSelection<T extends AnyObject = AnyObject> {
  /** Keep the selection keys in list even the key not exist in `dataSource` anymore */
  preserveSelectedRowKeys?: boolean;
  type?: RowSelectionType;
  selectedRowKeys?: Key[];
  defaultSelectedRowKeys?: Key[];
  onChange?: (selectedRowKeys: Key[], selectedRows: T[], info: { type: RowSelectMethod }) => void;
  getCheckboxProps?: (record: T) => Partial<Omit<CheckboxProps, 'checked' | 'defaultChecked'>>;
  onSelect?: SelectionSelectFn<T>;
  selections?: InternalSelectionItem[] | boolean;
  hideSelectAll?: boolean;
  fixed?: FixedType;
  columnWidth?: string | number;
  columnTitle?: React.ReactNode | ((checkboxNode: React.ReactNode) => React.ReactNode);
  checkStrictly?: boolean;
  renderCell?: (
    value: boolean,
    record: T,
    index: number,
    originNode: React.ReactNode,
  ) => React.ReactNode;
  onCell?: GetComponentProps<T>;
}

// =================== Locale ===================
export interface TableLocale {
  filterTitle?: string;
  filterConfirm?: React.ReactNode;
  filterReset?: React.ReactNode;
  filterEmptyText?: React.ReactNode;
  filterCheckall?: React.ReactNode;
  filterSearchPlaceholder?: string;
  emptyText?: React.ReactNode | (() => React.ReactNode);
  selectAll?: React.ReactNode;
  selectNone?: React.ReactNode;
  selectInvert?: React.ReactNode;
  selectionAll?: React.ReactNode;
  sortTitle?: string;
  expand?: string;
  collapse?: string;
  triggerDesc?: string;
  triggerAsc?: string;
  cancelSort?: string;
  saveText?: string;
  cancelText?: string;
  editingAlertMessage?: string;
}

type TablePaginationPosition =
  | 'topLeft'
  | 'topCenter'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomCenter'
  | 'bottomRight'
  | 'none';

export interface TablePaginationConfig extends PaginationProps {
  position?: TablePaginationPosition[];
}

export type TableGetRequestType<
  RecordType extends AnyObject,
  Pagination extends boolean = true,
> = Pagination extends false
  ? RequestConfig<RecordType, any[]>
  : RequestConfig<
      RecordType,
      [
        {
          filters: Record<string, FilterValue | null>;
          sorter: SorterResult<RecordType> | SorterResult<RecordType>[];
          pageSize: number;
          current: number;
        },
        ...any[],
      ]
    >;

export type EditableActionRenderFunction<T> = (
  record: T,
  defaultDoms: {
    save: React.ReactNode;
    cancel: React.ReactNode;
  },
) => React.ReactNode[];

export type TableEditableConfig<RecordType extends AnyObject> = {
  formProps?: Omit<
    FormProps<RecordType> & {
      formRef?: React.Ref<FormInstance | undefined>;
      onInit?: (values: RecordType, form: FormInstance) => void;
    },
    | 'onFinish'
    | 'colon'
    | 'layout'
    | 'labelAlign'
    | 'labelWrap'
    | 'labelWidth'
    | 'size'
    | 'requiredMark'
    | 'column'
    | 'errorPopover'
  >;
  form?: FormInstance;
  editingRowKey?: Key;
  onChange?: (editingRowKey?: Key, editingRecord?: RecordType) => void;
  actionRender?: EditableActionRenderFunction<RecordType>;
  onSave?: (record: RecordType, index: number) => Promise<any | void>;
};
