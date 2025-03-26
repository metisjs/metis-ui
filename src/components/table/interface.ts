import type * as React from 'react';
import type { SemanticClassName } from '@util/classNameUtils';
import type { Breakpoint } from '@util/responsiveObserver';
import type { AnyObject, RequestConfig, RequiredWith, SafeKey } from '@util/type';
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
  FormItemConfig,
} from '../form/interface';
import type { InputProps } from '../input';
import type { PaginationProps } from '../pagination';
import type { ScrollbarProps, ScrollbarRef } from '../scrollbar';
import type { TooltipProps } from '../tooltip';
import type { InternalSelectionItem } from './hooks/useSelection';
import type { ToolBarProps } from './Toolbar';

export type Key = SafeKey;

export type FixedType = 'left' | 'right' | boolean;

export type TableLayout = 'auto' | 'fixed';

export type ScrollConfig = {
  index?: number;
  key?: Key;
  top?: number;
  align?: 'start' | 'end' | 'center';
  behavior?: ScrollBehavior;
};

export type Reference = {
  nativeElement: HTMLDivElement;
  scrollTo: (config: ScrollConfig) => void;
} & TableActionType;

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
  sortColumns?: { column: InternalColumnType<RecordType>; order: SortOrder }[];
  filters?: Record<string, FilterValue>;
}

export type ColumnTitle<RecordType extends AnyObject = AnyObject> =
  | React.ReactNode
  | ((props: ColumnTitleProps<RecordType>) => React.ReactNode);

export interface TableCurrentDataSource<RecordType = AnyObject> {
  currentDataSource: RecordType[];
  action: TableAction;
}

export interface SorterResult {
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
  setSelectedKeys: (selectedKeys: Key[]) => void;
  selectedKeys: Key[];
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
  column?: InternalColumnsType<RecordType>[number];
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
  onHeaderCell?: GetComponentProps<InternalColumnsType<RecordType>[number]>;
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
  children: Omit<ColumnsType<RecordType>, 'hidden'>;
}

export type InternalColumnGroupType<RecordType extends AnyObject> = RequiredWith<
  Omit<ColumnGroupType<RecordType>, 'children'>,
  'key'
> & {
  children: Omit<InternalColumnsType<RecordType>, 'hidden'>;
};

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
      value?: FilterValue | null | string;
      defaultValue?: FilterValue | null | string;
      icon?: React.ReactNode | ((filtered: boolean) => React.ReactNode);
      mode?: 'menu' | 'tree';
      search?: FilterSearchType<ColumnFilterItem>;
      onFilter?: (value: any, record: RecordType) => boolean;
      dropdownProps?: CoverableDropdownProps;
      resetToDefaultValue?: boolean;
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

export type TableActionType = {
  reload: (resetPageIndex?: boolean) => void;
  fullScreen: () => void;
  startEdit: (key: Key) => boolean;
  cancelEdit: () => boolean;
};

export type ColumnPropsWithValueType<RecordType extends AnyObject> =
  | {
      valueType?: 'text';
      editable?: ColumnEditable<RecordType, 'text'>;
      search?: boolean | ColumnSearchType<'text'>;
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
        search?: boolean | ColumnSearchType<K>;
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
    action: TableActionType,
  ) => React.ReactNode;
  shouldCellUpdate?: (record: RecordType, prevRecord: RecordType) => boolean;
  rowSpan?: number;
  width?: number | string;
  minWidth?: number;
  onCell?: GetComponentProps<RecordType>;
  valueEnum?: ColumnValueEnum<RecordType>;
} & ColumnPropsWithValueType<RecordType> &
  ColumnSharedType<RecordType>;

export type InternalColumnType<RecordType extends AnyObject> = RequiredWith<
  ColumnType<RecordType>,
  'key'
>;

export type ColumnsType<RecordType extends AnyObject = AnyObject> = readonly (
  | ColumnGroupType<RecordType>
  | ColumnType<RecordType>
)[];

export type InternalColumnsType<RecordType extends AnyObject> = (
  | InternalColumnGroupType<RecordType>
  | InternalColumnType<RecordType>
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
  cellRender?: (
    value: boolean,
    record: T,
    index: number,
    originNode: React.ReactNode,
  ) => React.ReactNode;
  onCell?: GetComponentProps<T>;
  optionRender?: (props: {
    selectedRowKeys: Key[];
    selectedRows: T[];
    clearSelected: () => void;
  }) => React.ReactNode;
}

// =================== Locale ===================
export interface TableLocale {
  emptyText?: React.ReactNode | (() => React.ReactNode);
  filter?: {
    confirm?: React.ReactNode;
    reset?: React.ReactNode;
    emptyText?: React.ReactNode;
    checkall?: React.ReactNode;
    searchPlaceholder?: string;
  };
  selection?: {
    selectAll?: React.ReactNode;
    selectInvert?: React.ReactNode;
    selectNone?: React.ReactNode;
    selectionAll?: React.ReactNode;
  };
  expand?: string;
  collapse?: string;
  sort?: {
    triggerDesc?: string;
    triggerAsc?: string;
    cancel?: string;
  };
  editable?: {
    saveText?: string;
    cancelText?: string;
    editingAlertMessage?: React.ReactNode;
  };
  toolbar?: {
    reload?: string;
    setting?: string;
    fullscreen?: string;
    exitFullscreen?: string;
    reset?: string;
    leftPin?: string;
    noPin?: string;
    rightPin?: string;
  };
  search?: {
    search?: string;
    reset?: string;
    collapsed?: string;
    expand?: string;
  };
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
          sorter: SorterResult | SorterResult[];
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
  editingRowKey?: Key;
  onChange?: (editingRowKey?: Key, editingRecord?: RecordType) => void;
  actionRender?: EditableActionRenderFunction<RecordType>;
  onSave?: (record: RecordType, index: number) => Promise<any | void>;
} & Omit<
  FormProps<RecordType>,
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

export type ToolbarSearchProps = Omit<InputProps, 'defaultValue' | 'value' | 'name'> & {
  name?: string;
};

export type OptionConfig = {
  fullScreen?: OptionsType;
  reload?: OptionsType;
  setting?: boolean;
};

export type OptionsFunctionType = (
  e: React.MouseEvent<HTMLSpanElement>,
  action?: TableActionType,
) => void;

export type OptionsType = OptionsFunctionType | boolean;

export type ToolbarConfig =
  | React.ReactNode[] // as actions
  | {
      search?: ToolbarSearchProps | boolean;
      actions?: React.ReactNode[];
      options?: OptionConfig | boolean;
      optionsRender?: ToolBarProps['optionsRender'];
    }
  | ((actions: TableActionType) =>
      | React.ReactNode[]
      | {
          search?: ToolbarSearchProps | boolean;
          actions?: React.ReactNode[];
          options?: OptionConfig;
          optionsRender?: ToolBarProps['optionsRender'];
        });

export type ColumnStateType = {
  /**
   * 持久化的类型，支持 localStorage 和 sessionStorage
   */
  persistenceType?: 'localStorage' | 'sessionStorage';
  /** 持久化的key，用于存储到 storage 中 */
  persistenceKey?: string;
};

export type ColumnState = {
  show?: boolean;
  fixed?: Exclude<FixedType, boolean>;
  order: number;
};

export type ColumnSearchType<ValueType extends FieldValueType = 'text'> = {
  key?: React.Key;
  order?: number;
  fieldProps?: FieldValueTypeWithFieldProps[ValueType]['edit'];
  fieldRender?: (form: FormInstance) => React.ReactNode;
} & Omit<FormItemProps, 'children'>;

export type TableSearchConfig = {
  items?: (FormItemConfig & { order?: number })[];
  defaultCollapsed?: boolean;
  collapsed?: boolean;
  defaultItemsNumber?: number;
  onCollapsedChange?: (collapse: boolean) => void;
  onSearch?: (params: Record<Key, any>) => void;
} & Omit<FormProps, 'children' | 'items'>;
