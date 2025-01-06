import * as React from 'react';
import { FunnelSolid } from '@metisjs/icons';
import { clsx } from '@util/classNameUtils';
import useSyncState from '@util/hooks/useSyncState';
import type { AnyObject, SafeKey } from '@util/type';
import { Space } from 'metis-ui';
import isEqual from 'rc-util/lib/isEqual';
import type { FilterState } from '.';
import extendsObject from '../../../_util/extendsObject';
import Button from '../../../button';
import Checkbox from '../../../checkbox';
import { ConfigContext } from '../../../config-provider/context';
import type { DropdownProps } from '../../../dropdown';
import Dropdown from '../../../dropdown';
import Empty from '../../../empty';
import type { MenuProps } from '../../../menu';
import Menu from '../../../menu';
import { OverrideProvider } from '../../../menu/context/OverrideContext';
import Radio from '../../../radio';
import type { FieldDataNode } from '../../../tree';
import Tree from '../../../tree';
import type { EventDataNode } from '../../../tree/interface';
import type {
  ColumnFilterItem,
  ColumnType,
  FilterKey,
  FilterSearchType,
  FilterValue,
  GetPopupContainer,
  Key,
  TableLocale,
} from '../../interface';
import FilterSearch from './FilterSearch';
import FilterDropdownMenuWrapper from './FilterWrapper';

type FilterTreeDataNode = FieldDataNode<{ title: React.ReactNode; key: string }>;

interface FilterRestProps {
  confirm?: boolean;
  closeDropdown?: boolean;
}

export function flattenKeys(filters?: ColumnFilterItem[]) {
  let keys: FilterValue = [];
  (filters || []).forEach(({ value, children }) => {
    keys.push(value);
    if (children) {
      keys = [...keys, ...flattenKeys(children)];
    }
  });
  return keys;
}

function hasSubMenu(filters: ColumnFilterItem[]) {
  return filters.some(({ children }) => children);
}

function searchValueMatched(searchValue: string, text: React.ReactNode) {
  if (typeof text === 'string' || typeof text === 'number') {
    return text?.toString().toLowerCase().includes(searchValue.trim().toLowerCase());
  }
  return false;
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

export interface FilterDropdownProps<RecordType extends AnyObject = AnyObject> {
  tablePrefixCls: string;
  prefixCls: string;
  dropdownPrefixCls: string;
  column: ColumnType<RecordType>;
  filterState?: FilterState<RecordType>;
  filterOnClose: boolean;
  filterMultiple: boolean;
  filterMode?: 'menu' | 'tree';
  filterSearch?: FilterSearchType<ColumnFilterItem>;
  columnKey: Key;
  children: React.ReactNode;
  triggerFilter: (filterState: FilterState<RecordType>) => void;
  locale: TableLocale;
  getPopupContainer?: GetPopupContainer;
  filterResetToDefaultFilteredValue?: boolean;
}

function wrapStringListType(keys?: FilterKey) {
  return keys || [];
}

const FilterDropdown = <RecordType extends AnyObject = AnyObject>(
  props: FilterDropdownProps<RecordType>,
) => {
  const {
    tablePrefixCls,
    prefixCls,
    column,
    dropdownPrefixCls,
    columnKey,
    filterOnClose,
    filterMultiple,
    filterMode = 'menu',
    filterSearch = false,
    filterState,
    triggerFilter,
    locale,
    children,
    getPopupContainer,
  } = props;

  const { filter } = column;

  const [open, setOpen] = React.useState(false);

  const filtered: boolean = !!(
    filterState &&
    (filterState.filteredKeys?.length || filterState.forceFiltered)
  );
  const triggerVisible = (newVisible: boolean) => {
    setOpen(newVisible);
    filter?.dropdownProps?.onOpenChange?.(newVisible);
  };

  const mergedOpen = filter?.dropdownProps?.open ?? open; // inner state

  // ===================== Select Keys =====================
  const propFilteredKeys = filterState?.filteredKeys;
  const [filteredKeysSync, setFilteredKeysSync] = useSyncState(
    wrapStringListType(propFilteredKeys),
  );

  const onSelectKeys = ({ selectedKeys }: { selectedKeys: SafeKey[] }) => {
    setFilteredKeysSync(selectedKeys);
  };

  const onCheck = (
    keys: string[],
    { node, checked }: { node: EventDataNode<FilterTreeDataNode>; checked: boolean },
  ) => {
    if (!filterMultiple) {
      onSelectKeys({ selectedKeys: checked && node.key ? [node.key] : [] });
    } else {
      onSelectKeys({ selectedKeys: keys });
    }
  };

  React.useEffect(() => {
    if (!open) {
      return;
    }
    onSelectKeys({ selectedKeys: wrapStringListType(propFilteredKeys) });
  }, [propFilteredKeys]);

  // ====================== Open Keys ======================
  const [openKeys, setOpenKeys] = React.useState<string[]>([]);
  const onOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  // search in tree mode column filter
  const [searchValue, setSearchValue] = React.useState('');
  const onSearch = (value: string) => {
    setSearchValue(value);
  };
  // clear search value after close filter dropdown
  React.useEffect(() => {
    if (!open) {
      setSearchValue('');
    }
  }, [open]);

  // ======================= Submit ========================
  const internalTriggerFilter = (keys?: SafeKey[]) => {
    const mergedKeys = keys?.length ? keys : null;
    if (mergedKeys === null && (!filterState || !filterState.filteredKeys)) {
      return null;
    }

    if (isEqual(mergedKeys, filterState?.filteredKeys, true)) {
      return null;
    }

    triggerFilter({
      column,
      key: columnKey,
      filteredKeys: mergedKeys,
    });
  };

  const onConfirm = () => {
    triggerVisible(false);
    internalTriggerFilter(filteredKeysSync);
  };

  const onReset = (
    { confirm, closeDropdown }: FilterRestProps = { confirm: false, closeDropdown: false },
  ) => {
    if (confirm) {
      internalTriggerFilter([]);
    }
    if (closeDropdown) {
      triggerVisible(false);
    }

    setSearchValue('');

    if (filter?.resetToDefaultFilteredValue) {
      setFilteredKeysSync((filter?.defaultFilteredValue || []).map((key) => String(key)));
    } else {
      setFilteredKeysSync([]);
    }
  };

  const doFilter = ({ closeDropdown } = { closeDropdown: true }) => {
    if (closeDropdown) {
      triggerVisible(false);
    }
    internalTriggerFilter(filteredKeysSync);
  };

  const onVisibleChange: DropdownProps['onOpenChange'] = (newVisible, info) => {
    if (info.source === 'trigger') {
      if (newVisible && propFilteredKeys !== undefined) {
        // Sync filteredKeys on appear in controlled mode (propFilteredKeys !== undefined)
        setFilteredKeysSync(wrapStringListType(propFilteredKeys));
      }

      triggerVisible(newVisible);

      if (!newVisible && !filter?.dropdown && filterOnClose) {
        onConfirm();
      }
    }
  };

  // ======================== Style ========================
  const dropdownMenuClass = clsx({
    [`${dropdownPrefixCls}-menu-without-submenu`]: !hasSubMenu(filter?.items || []),
  });

  const onCheckAll = (checked: boolean) => {
    if (checked) {
      const allFilterKeys = flattenKeys(filter?.items).map((key) => String(key));
      setFilteredKeysSync(allFilterKeys);
    } else {
      setFilteredKeysSync([]);
    }
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

  let dropdownContent: React.ReactNode;

  const { renderEmpty } = React.useContext(ConfigContext);

  if (typeof filter?.dropdown === 'function') {
    dropdownContent = filter.dropdown({
      prefixCls: `${dropdownPrefixCls}-custom`,
      setSelectedKeys: (selectedKeys) => onSelectKeys({ selectedKeys: selectedKeys as string[] }),
      selectedKeys: filteredKeysSync,
      confirm: doFilter,
      clearFilters: onReset,
      filters: filter.items,
      visible: mergedOpen,
      close: () => {
        triggerVisible(false);
      },
    });
  } else if (filter?.dropdown) {
    dropdownContent = filter?.dropdown;
  } else {
    const selectedKeys = filteredKeysSync || [];
    const getFilterComponent = () => {
      const empty = renderEmpty?.('Table.filter') ?? (
        <Empty
          description={locale.filterEmptyText}
          imageStyle={{
            height: 24,
          }}
          style={{
            margin: 0,
            padding: '16px 0',
          }}
        />
      );
      if ((filter?.items || []).length === 0) {
        return empty;
      }
      if (filterMode === 'tree') {
        return (
          <>
            <FilterSearch<ColumnFilterItem>
              filterSearch={filterSearch}
              value={searchValue}
              onChange={onSearch}
              tablePrefixCls={tablePrefixCls}
              locale={locale}
            />
            <div className={clsx(`${tablePrefixCls}-filter-dropdown-tree`, 'p-2')}>
              {filterMultiple ? (
                <Checkbox
                  checked={selectedKeys.length === flattenKeys(filter?.items).length}
                  indeterminate={
                    selectedKeys.length > 0 &&
                    selectedKeys.length < flattenKeys(filter?.items).length
                  }
                  className={{
                    root: `${tablePrefixCls}-filter-dropdown-checkall`,
                    indicator: 'peer-focus/checkbox:outline-0',
                  }}
                  onChange={onCheckAll}
                >
                  {locale.filterCheckall}
                </Checkbox>
              ) : null}
              <Tree<FilterTreeDataNode>
                checkable
                selectable={false}
                multiple={filterMultiple}
                checkStrictly={!filterMultiple}
                className={{
                  root: `${dropdownPrefixCls}-menu`,
                  node: { checkbox: { indicator: 'peer-focus/checkbox:outline-0' } },
                }}
                onCheck={onCheck as any}
                checkedKeys={selectedKeys}
                selectedKeys={selectedKeys}
                showIcon={false}
                treeData={getTreeData({ filters: filter?.items })}
                autoExpandParent
                defaultExpandAll
              />
            </div>
          </>
        );
      }
      const items = renderFilterItems({
        filters: filter?.items || [],
        filterSearch,
        prefixCls,
        filteredKeys: filteredKeysSync,
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
            tablePrefixCls={tablePrefixCls}
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
              selectedKeys={selectedKeys}
              getPopupContainer={getPopupContainer}
              openKeys={openKeys}
              onOpenChange={onOpenChange}
              items={items}
            />
          )}
        </>
      );
    };

    const getResetDisabled = () => {
      if (filter?.resetToDefaultFilteredValue) {
        return isEqual(
          (filter?.defaultFilteredValue || []).map((key) => String(key)),
          selectedKeys,
          true,
        );
      }

      return selectedKeys.length === 0;
    };

    dropdownContent = (
      <>
        {getFilterComponent()}
        <div
          className={clsx(
            `${prefixCls}-dropdown-btns`,
            'flex justify-between gap-2 border-t border-t-border-secondary p-2',
          )}
        >
          <Button type="link" size="mini" disabled={getResetDisabled()} onClick={() => onReset()}>
            {locale.filterReset}
          </Button>
          <Button type="primary" size="mini" onClick={onConfirm}>
            {locale.filterConfirm}
          </Button>
        </div>
      </>
    );
  }

  // We should not block customize Menu with additional props
  if (filter?.dropdown) {
    dropdownContent = <OverrideProvider selectable={undefined}>{dropdownContent}</OverrideProvider>;
  }

  dropdownContent = (
    <FilterDropdownMenuWrapper className={`${prefixCls}-dropdown`}>
      {dropdownContent}
    </FilterDropdownMenuWrapper>
  );

  const getDropdownTrigger = () => {
    let filterIcon: React.ReactNode;
    if (typeof filter?.icon === 'function') {
      filterIcon = filter.icon(filtered);
    } else if (filter?.icon) {
      filterIcon = filter.icon;
    } else {
      filterIcon = <FunnelSolid />;
    }

    return (
      <span
        role="button"
        tabIndex={-1}
        className={clsx(
          `${prefixCls}-trigger`,
          {
            active: filtered,
          },
          'relative -me-2 ms-1 flex items-center rounded-sm px-1 text-text-tertiary hover:bg-fill-quaternary hover:text-text-secondary',
          {
            'text-text-secondary': mergedOpen,
            'text-primary hover:text-primary': filtered,
          },
        )}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {filterIcon}
      </span>
    );
  };

  const mergedDropdownProps = extendsObject<DropdownProps>(
    {
      trigger: ['click'],
      placement: 'bottomRight',
      children: getDropdownTrigger(),
      getPopupContainer,
    },
    {
      ...filter?.dropdownProps,
      open: mergedOpen,
      onOpenChange: onVisibleChange,
      popupRender: () => {
        if (typeof filter?.dropdownProps?.popupRender === 'function') {
          return filter.dropdownProps.popupRender(dropdownContent);
        }
        return dropdownContent;
      },
    },
  );

  return (
    <div className={clsx(`${prefixCls}-column`, 'flex justify-between')}>
      <span className={clsx(`${tablePrefixCls}-column-title`, 'relative flex-1')}>{children}</span>
      <Dropdown {...mergedDropdownProps} />
    </div>
  );
};

export default FilterDropdown;
