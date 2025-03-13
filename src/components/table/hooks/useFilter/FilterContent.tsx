import * as React from 'react';
import { useContext } from '@rc-component/context';
import { clsx } from '@util/classNameUtils';
import toArray from '@util/toArray';
import type { AnyObject } from '@util/type';
import { isNil } from 'lodash';
import isEqual from 'rc-util/es/isEqual';
import Button from '../../../button';
import type { CascaderProps, DefaultOptionType } from '../../../cascader';
import Checkbox from '../../../checkbox';
import { ConfigContext } from '../../../config-provider/context';
import SeparatorIcon from '../../../date-picker/PickerInput/Selector/SeparatorIcon';
import Empty from '../../../empty';
import Field from '../../../form/Field';
import { fieldParsingOptions } from '../../../form/Field/util';
import useValueEnum from '../../../form/hooks/useValueEnum';
import type {
  FieldValueEnumMap,
  FieldValueEnumObj,
  FieldValueObject,
  FieldValueType,
} from '../../../form/interface';
import type { MenuProps } from '../../../menu';
import Menu from '../../../menu';
import Radio from '../../../radio';
import Space from '../../../space';
import Spin from '../../../spin';
import Tree from '../../../tree';
import type { EventDataNode, FieldDataNode } from '../../../tree/interface';
import TableContext from '../../context/TableContext';
import type {
  ColumnFilter,
  ColumnFilterItem,
  ColumnType,
  FilterConfirmProps,
  FilterRestProps,
  FilterSearchType,
  GetPopupContainer,
  Key,
  TableLocale,
} from '../../interface';
import { flattenKeys } from '../../utils/filterUtil';
import FilterSearch from './FilterSearch';

type FilterTreeDataNode = FieldDataNode<{ title: React.ReactNode; key: string }>;
type RawValueType<RecordType extends AnyObject> = Exclude<
  ColumnType<RecordType>['valueType'],
  (...args: any[]) => any
>;

function hasSubMenu(filters: ColumnFilterItem[]) {
  return filters.some(({ children }) => children);
}

function searchValueMatched(searchValue: string, text: React.ReactNode) {
  if (typeof text === 'string' || typeof text === 'number') {
    return text?.toString().toLowerCase().includes(searchValue.trim().toLowerCase());
  }
  return false;
}

function getFiltersByValueEnum<RecordType extends AnyObject = AnyObject>(
  valueType: RawValueType<RecordType> = 'text',
  valueEnum: FieldValueEnumObj | FieldValueEnumMap | undefined,
): ColumnFilterItem[] | undefined {
  const allowValueTypes: FieldValueType[] = [
    'select',
    'checkbox',
    'radio',
    'switch',
    'cascader',
    'segmented',
    'tag',
  ];

  let mergedValueType: FieldValueType = typeof valueType === 'object' ? valueType.type : valueType;
  mergedValueType = mergedValueType === 'text' && !!valueEnum ? 'select' : mergedValueType;

  if (allowValueTypes.includes(mergedValueType)) {
    if (
      !valueEnum &&
      typeof valueType === 'object' &&
      valueType.type === 'cascader' &&
      valueType.options
    ) {
      const {
        value: valuePropsName = 'value',
        label: labelPropsName = 'label',
        children: childrenPropsName = 'children',
      } = valueType.fieldNames || {};

      const traverseOptions = (options?: CascaderProps['options']) =>
        options?.map((item) => {
          const transformed: DefaultOptionType = {
            label: item[labelPropsName],
            value: item[valuePropsName],
          };

          if (item[childrenPropsName]) {
            transformed.children = traverseOptions(item[childrenPropsName]);
          }

          return transformed;
        });

      return traverseOptions(valueType.options) as ColumnFilterItem[];
    }

    return fieldParsingOptions(valueEnum);
  }

  return undefined;
}

function getFilterByValueType<RecordType extends AnyObject = AnyObject>(
  prefixCls: string,
  valueType: RawValueType<RecordType> = 'text',
  inputRef: React.MutableRefObject<any>,
  selectedKeys: (Key | undefined)[],
  setSelectedKeys: (selectedKeys: (Key | undefined)[]) => void,
) {
  const mergedValueType: FieldValueType =
    typeof valueType === 'object' ? valueType.type : valueType;

  // 数字类
  if (['money', 'rate', 'slider', 'progress', 'percent', 'digit'].includes(mergedValueType)) {
    const onChange = (index: number, value?: number) => {
      let newRange = [...selectedKeys];
      newRange[index] = value;

      setSelectedKeys(newRange.every((item) => isNil(item)) ? [] : newRange);
    };

    return (
      <div
        className={clsx(
          `${prefixCls}-range`,
          'flex items-center gap-2',
          mergedValueType !== 'rate' &&
            'group/range rounded-md bg-container shadow-sm ring-1 ring-inset ring-border focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary',
        )}
      >
        <Field
          ref={inputRef}
          mode="edit"
          valueType={valueType}
          value={selectedKeys[0]}
          onChange={(value) => onChange(0, value)}
          editorProps={{
            size: 'small',
            className: {
              root: clsx(
                `${prefixCls}-range-min`,
                'bg-transparent shadow-none ring-0 focus-within:ring-0',
                mergedValueType !== 'rate' && 'w-24',
              ),
              handler: clsx(
                'group-has-[:focus-within]/range:bottom-[2px] group-has-[:focus-within]/range:right-[2px] group-has-[:focus-within]/range:top-[2px] group-has-[:focus-within]/range:w-[calc(1.5rem-1px)]',
              ),
            },
          }}
        />
        <div
          className={clsx(
            `${prefixCls}-range-separator`,
            'flex h-6 items-center text-lg text-text-quaternary',
          )}
        >
          <SeparatorIcon />
        </div>
        <Field
          mode="edit"
          valueType={valueType}
          value={selectedKeys[1]}
          onChange={(value) => onChange(1, value)}
          editorProps={{
            size: 'small',
            className: {
              root: clsx(
                `${prefixCls}-range-max`,
                'bg-transparent shadow-none ring-0 focus-within:ring-0',
                mergedValueType !== 'rate' && 'w-24',
              ),
              handler: clsx(
                'group-has-[:focus-within]/range:bottom-[2px] group-has-[:focus-within]/range:right-[2px] group-has-[:focus-within]/range:top-[2px] group-has-[:focus-within]/range:w-[calc(1.5rem-1px)]',
              ),
            },
          }}
        />
      </div>
    );
  }

  // 日期类
  if (
    [
      'date',
      'dateWeek',
      'dateMonth',
      'dateQuarter',
      'dateYear',
      'dateTime',
      'fromNow',
      'time',
      'dateRange',
      'dateWeekRange',
      'dateMonthRange',
      'dateQuarterRange',
      'dateYearRange',
      'dateTimeRange',
      'timeRange',
    ].includes(mergedValueType)
  ) {
    const fieldValueType: FieldValueObject =
      typeof valueType === 'object' ? valueType : { type: valueType };
    if (mergedValueType === 'fromNow') {
      fieldValueType.type = 'dateTimeRange';
    } else {
      fieldValueType.type = mergedValueType.endsWith('Range')
        ? mergedValueType
        : (`${mergedValueType}Range` as FieldValueType);
    }

    return (
      <Field
        mode="edit"
        valueType={fieldValueType}
        value={selectedKeys}
        onChange={(value?: string[]) => setSelectedKeys(value ? value : [])}
        editorProps={{
          allowClear: false,
          size: 'small',
          allowEmpty: [true, true],
        }}
      />
    );
  }

  return (
    <Field
      ref={inputRef}
      mode="edit"
      valueType={valueType}
      value={selectedKeys[0]}
      onChange={(value?: string) => setSelectedKeys(value ? [value] : [])}
      editorProps={{
        allowClear: false,
        size: 'small',
        className: 'min-w-64',
      }}
    />
  );
}

function renderFilterItems({
  filters,
  prefixCls,
  filteredKeys,
  filterMultiple,
  searchValue,
  filterSearch,
}: {
  filters: ColumnFilterItem[];
  prefixCls: string;
  filteredKeys: Key[];
  filterMultiple: boolean;
  searchValue: string;
  filterSearch: FilterSearchType<ColumnFilterItem>;
}): Required<MenuProps>['items'] {
  return filters.map((filter, index) => {
    const key = String(filter.value);

    if (filter.children) {
      return {
        key: key || index,
        label: filter.label,
        children: renderFilterItems({
          filters: filter.children,
          prefixCls,
          filteredKeys,
          filterMultiple,
          searchValue,
          filterSearch,
        }),
      };
    }

    const Component = filterMultiple ? Checkbox : Radio;

    const item = {
      key: filter.value !== undefined ? key : index,
      label: (
        <Space size={8} block>
          <Component
            checked={filteredKeys.includes(key)}
            className={{ indicator: 'peer-focus/checkbox:outline-0 peer-focus/radio:outline-0' }}
          />
          <span>{filter.label}</span>
        </Space>
      ),
    };
    if (searchValue.trim()) {
      if (typeof filterSearch === 'function') {
        return filterSearch(searchValue, filter) ? item : null;
      }
      return searchValueMatched(searchValue, filter.label) ? item : null;
    }
    return item;
  });
}

export interface FilterContentProps<RecordType extends AnyObject = AnyObject> {
  prefixCls: string;
  dropdownPrefixCls: string;
  inputRef: React.MutableRefObject<any>;
  columnKey: Key;
  filter: Exclude<ColumnFilter<RecordType>, boolean>;
  valueType?: RawValueType<RecordType>;
  valueEnum?: Exclude<ColumnType<RecordType>['valueEnum'], (...args: any[]) => any>;
  selectedKeys: Key[];
  open: boolean;
  filterMode?: 'menu' | 'tree';
  filterSearch?: FilterSearchType<ColumnFilterItem>;
  filterMultiple: boolean;
  searchValue: string;
  locale: TableLocale;
  setSelectedKeys: (selectedKeys: Key[]) => void;
  confirm: (param?: FilterConfirmProps) => void;
  clearFilters?: (param?: FilterRestProps) => void;
  close: () => void;
  onSearch: (value: string) => void;
  getPopupContainer?: GetPopupContainer;
}

const FilterContent = <RecordType extends AnyObject = AnyObject>({
  prefixCls,
  dropdownPrefixCls,
  inputRef,
  columnKey,
  filter,
  valueType = 'text',
  valueEnum,
  selectedKeys = [],
  open,
  filterMode,
  filterSearch = false,
  filterMultiple,
  searchValue,
  locale,
  setSelectedKeys,
  confirm,
  clearFilters,
  close,
  onSearch,
  getPopupContainer,
}: FilterContentProps<RecordType>) => {
  const { renderEmpty } = React.useContext(ConfigContext);
  const { tableKey } = useContext(TableContext, ['tableKey']);

  const [mergedValueEnum, loading] = useValueEnum(
    valueEnum,
    `${tableKey}-cell-${columnKey}`,
    !filter.dropdown && !filter.items,
  );

  const mergedValueType: FieldValueType =
    typeof valueType === 'object' ? valueType.type : valueType;

  const mergedFilterMode = filterMode ?? (mergedValueType === 'cascader' ? 'tree' : 'menu');

  if (typeof filter.dropdown === 'function') {
    return filter.dropdown({
      prefixCls: `${prefixCls}-custom`,
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      filters: filter.items,
      open,
      close,
    });
  }

  if (filter.dropdown) {
    return filter.dropdown;
  }

  const mergedItems: ColumnFilterItem[] | undefined = filter.items?.length
    ? filter.items
    : getFiltersByValueEnum(valueType, mergedValueEnum);

  // ======================== Style ========================
  const dropdownMenuClass = clsx({
    [`${dropdownPrefixCls}-menu-without-submenu`]: !hasSubMenu(mergedItems || []),
  });

  // ======================== Event ========================
  const onCheckAll = (checked: boolean) => {
    if (checked) {
      const allFilterKeys = flattenKeys(mergedItems).map((key) => String(key));
      setSelectedKeys(allFilterKeys);
    } else {
      setSelectedKeys([]);
    }
  };

  const onCheck = (
    keys: string[],
    { node, checked }: { node: EventDataNode<FilterTreeDataNode>; checked: boolean },
  ) => {
    if (!filterMultiple) {
      setSelectedKeys(checked && node.key ? [node.key] : []);
    } else {
      setSelectedKeys(keys);
    }
  };

  const onSelectKeys = ({ selectedKeys }: { selectedKeys: Key[] }) => {
    setSelectedKeys(selectedKeys);
  };

  const getTreeData = ({ filters }: { filters?: ColumnFilterItem[] }) => {
    return (filters || []).map((filter, index) => {
      const key = String(filter.value);

      const matched = searchValue.trim()
        ? typeof filterSearch === 'function'
          ? filterSearch(searchValue, filter)
          : searchValueMatched(searchValue, filter.label)
        : false;

      const item: FilterTreeDataNode = {
        title: matched ? <span className="text-primary">{filter.label}</span> : filter.label,
        key: filter.value !== undefined ? key : String(index),
      };
      if (filter.children) {
        item.children = getTreeData({ filters: filter.children });
      }
      return item;
    });
  };

  const getFilterComponent = () => {
    const empty = renderEmpty?.('Table.filter') ?? (
      <Empty description={locale.filter.emptyText} className={{ root: 'm-0 py-4', image: 'h-6' }} />
    );

    if (!mergedItems) {
      return (
        <div className={clsx(`${prefixCls}-dropdown-panel`, 'p-2')}>
          {getFilterByValueType(prefixCls, valueType, inputRef, selectedKeys, setSelectedKeys)}
        </div>
      );
    }

    if (mergedFilterMode === 'tree') {
      return (
        <>
          <FilterSearch<ColumnFilterItem>
            filterSearch={filterSearch}
            value={searchValue}
            onChange={onSearch}
            prefixCls={prefixCls}
            locale={locale}
          />
          <div className={clsx(`${prefixCls}-dropdown-tree`, 'p-2')}>
            {filterMultiple ? (
              <Checkbox
                checked={selectedKeys.length === flattenKeys(mergedItems).length}
                indeterminate={
                  selectedKeys.length > 0 && selectedKeys.length < flattenKeys(mergedItems).length
                }
                className={{
                  root: `${prefixCls}-dropdown-checkall`,
                  indicator: 'peer-focus/checkbox:outline-0',
                }}
                onChange={onCheckAll}
              >
                {locale.filter.checkall}
              </Checkbox>
            ) : null}
            <Tree<FilterTreeDataNode>
              checkable
              selectable={false}
              multiple={filterMultiple}
              checkStrictly={!filterMultiple}
              className={{
                root: `${prefixCls}-menu`,
                node: { checkbox: { indicator: 'peer-focus/checkbox:outline-0' } },
              }}
              onCheck={onCheck as any}
              checkedKeys={selectedKeys as Key[]}
              selectedKeys={selectedKeys as Key[]}
              showIcon={false}
              treeData={getTreeData({ filters: mergedItems })}
              autoExpandParent
              defaultExpandAll
            />
          </div>
        </>
      );
    }
    const items = renderFilterItems({
      filters: mergedItems || [],
      filterSearch,
      prefixCls,
      filteredKeys: selectedKeys as Key[],
      filterMultiple,
      searchValue,
    });
    const isEmpty = items.every((item) => item === null);

    return (
      <>
        <FilterSearch
          filterSearch={filterSearch}
          value={searchValue}
          onChange={onSearch}
          prefixCls={prefixCls}
          locale={locale}
        />
        {isEmpty ? (
          empty
        ) : (
          <Menu
            selectable
            multiple={filterMultiple}
            prefixCls={`${dropdownPrefixCls}-menu`}
            className={dropdownMenuClass}
            onSelect={onSelectKeys}
            onDeselect={onSelectKeys}
            selectedKeys={selectedKeys as Key[]}
            getPopupContainer={getPopupContainer}
            items={items}
          />
        )}
      </>
    );
  };

  const getResetDisabled = () => {
    if (filter.resetToDefaultFilteredValue) {
      return isEqual(
        (toArray(filter.defaultFilteredValue) || []).map((key) => String(key)),
        selectedKeys,
        true,
      );
    }

    return selectedKeys.length === 0;
  };

  return (
    <>
      <Spin spinning={loading} size="small">
        {getFilterComponent()}
      </Spin>
      <div
        className={clsx(
          `${prefixCls}-dropdown-btns`,
          'flex justify-between gap-2 border-t border-t-border-secondary p-2',
        )}
      >
        <Button
          type="link"
          size="mini"
          disabled={getResetDisabled()}
          onClick={() => clearFilters?.()}
        >
          {locale.filter.reset}
        </Button>
        <Button type="primary" size="mini" onClick={() => confirm()}>
          {locale.filter.confirm}
        </Button>
      </div>
    </>
  );
};

export default FilterContent;
