import * as React from 'react';
import { FunnelSolid } from '@metisjs/icons';
import { clsx } from '@util/classNameUtils';
import useSyncState from '@util/hooks/useSyncState';
import type { AnyObject, SafeKey } from '@util/type';
import isEqual from 'rc-util/lib/isEqual';
import type { FilterState } from '.';
import extendsObject from '../../../_util/extendsObject';
import type { DropdownProps } from '../../../dropdown';
import Dropdown from '../../../dropdown';
import { OverrideProvider } from '../../../menu/context/OverrideContext';
import type {
  ColumnFilterItem,
  ColumnType,
  FilterKey,
  FilterRestProps,
  FilterSearchType,
  GetPopupContainer,
  Key,
  TableLocale,
} from '../../interface';
import FilterContent from './FilterContent';
import FilterDropdownMenuWrapper from './FilterWrapper';

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
    filterMode,
    filterSearch,
    filterState,
    triggerFilter,
    locale,
    children,
    getPopupContainer,
  } = props;

  const { filter } = column;
  const mergedFilter = typeof filter === 'boolean' ? {} : { ...filter };

  const inputRef = React.useRef<any>(null);

  const [open, setOpen] = React.useState(false);

  const filtered: boolean = !!(
    filterState &&
    (filterState.filteredKeys?.length || filterState.forceFiltered)
  );
  const triggerVisible = (newVisible: boolean) => {
    setOpen(newVisible);
    mergedFilter.dropdownProps?.onOpenChange?.(newVisible);
  };

  const mergedOpen = mergedFilter.dropdownProps?.open ?? open; // inner state

  // ===================== Select Keys =====================
  const propFilteredKeys = filterState?.filteredKeys;
  const [filteredKeysSync, setFilteredKeysSync] = useSyncState(
    wrapStringListType(propFilteredKeys),
  );

  const onSelectKeys = ({ selectedKeys }: { selectedKeys: SafeKey[] }) => {
    setFilteredKeysSync(selectedKeys);
  };

  React.useEffect(() => {
    if (!open) {
      return;
    }
    onSelectKeys({ selectedKeys: wrapStringListType(propFilteredKeys) });
  }, [propFilteredKeys]);

  // search in tree mode column filter
  const [searchValue, setSearchValue] = React.useState('');
  const onSearch = (value: string) => {
    setSearchValue(value);
  };
  // clear search value after close filter dropdown
  React.useEffect(() => {
    if (!open) {
      setSearchValue('');
    } else {
      setTimeout(() => {
        inputRef.current?.select?.();
      }, 100);
    }
  }, [open]);

  // ======================= Submit ========================
  const internalTriggerFilter = (keys?: Key[]) => {
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

    if (mergedFilter.resetToDefaultFilteredValue) {
      setFilteredKeysSync((mergedFilter.defaultFilteredValue || []).map((key) => String(key)));
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

  const onOpenChange: DropdownProps['onOpenChange'] = (newVisible, info) => {
    if (info.source === 'trigger') {
      if (newVisible && propFilteredKeys !== undefined) {
        // Sync filteredKeys on appear in controlled mode (propFilteredKeys !== undefined)
        setFilteredKeysSync(wrapStringListType(propFilteredKeys));
      }

      triggerVisible(newVisible);

      if (!newVisible && !mergedFilter.dropdown && filterOnClose) {
        onConfirm();
      }
    }
  };

  let dropdownContent: React.ReactNode = (
    <FilterContent
      prefixCls={prefixCls}
      dropdownPrefixCls={dropdownPrefixCls}
      inputRef={inputRef}
      columnKey={columnKey}
      filter={mergedFilter}
      valueType={
        column.valueType as Exclude<ColumnType<RecordType>['valueType'], (...args: any[]) => any>
      }
      valueEnum={
        column.valueEnum as Exclude<ColumnType<RecordType>['valueEnum'], (...args: any[]) => any>
      }
      selectedKeys={filteredKeysSync}
      open={mergedOpen}
      filterMode={filterMode}
      filterSearch={filterSearch}
      filterMultiple={filterMultiple}
      searchValue={searchValue}
      locale={locale}
      setSelectedKeys={setFilteredKeysSync}
      confirm={doFilter}
      clearFilters={onReset}
      close={() => {
        triggerVisible(false);
      }}
      onSearch={onSearch}
      getPopupContainer={getPopupContainer}
    />
  );

  // We should not block customize Menu with additional props
  if (mergedFilter.dropdown) {
    dropdownContent = <OverrideProvider selectable={undefined}>{dropdownContent}</OverrideProvider>;
  }

  dropdownContent = (
    <FilterDropdownMenuWrapper className={`${prefixCls}-dropdown`}>
      {dropdownContent}
    </FilterDropdownMenuWrapper>
  );

  const getDropdownTrigger = () => {
    let filterIcon: React.ReactNode;
    if (typeof mergedFilter.icon === 'function') {
      filterIcon = mergedFilter.icon(filtered);
    } else if (mergedFilter.icon) {
      filterIcon = mergedFilter.icon;
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
          'relative -me-1 ms-1 flex items-center rounded-sm px-1 text-text-tertiary hover:bg-fill-quaternary hover:text-text-secondary',
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
      ...mergedFilter.dropdownProps,
      open: mergedOpen,
      onOpenChange,
      popupRender: () => {
        if (typeof mergedFilter.dropdownProps?.popupRender === 'function') {
          return mergedFilter.dropdownProps.popupRender(dropdownContent);
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
