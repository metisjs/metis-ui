import * as React from 'react';
import { FunnelSolid } from '@metisjs/icons';
import { clsx } from '@util/classNameUtils';
import useSyncState from '@util/hooks/useSyncState';
import toArray from '@util/toArray';
import type { AnyObject, SafeKey } from '@util/type';
import isEqual from 'rc-util/es/isEqual';
import type { FilterState } from '.';
import extendsObject from '../../../_util/extendsObject';
import type { DropdownProps } from '../../../dropdown';
import Dropdown from '../../../dropdown';
import { OverrideProvider } from '../../../menu/context/OverrideContext';
import type {
  ColumnFilterItem,
  FilterKey,
  FilterRestProps,
  FilterSearchType,
  GetPopupContainer,
  InternalColumnType,
  Key,
  TableLocale,
} from '../../interface';
import FilterContent from './FilterContent';
import FilterDropdownMenuWrapper from './FilterWrapper';

export interface FilterDropdownProps<RecordType extends AnyObject = AnyObject> {
  tablePrefixCls: string;
  prefixCls: string;
  dropdownPrefixCls: string;
  column: InternalColumnType<RecordType>;
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
  const triggerOpen = (newOpen: boolean) => {
    setOpen(newOpen);
    mergedFilter.dropdownProps?.onOpenChange?.(newOpen);
  };

  const mergedOpen = mergedFilter.dropdownProps?.open ?? open; // inner state

  // ===================== Select Keys =====================
  const propFilteredKeys = filterState?.filteredKeys;
  const [getFilteredKeysSync, setFilteredKeysSync] = useSyncState(
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
    triggerOpen(false);
    internalTriggerFilter(getFilteredKeysSync());
  };

  const onReset = (
    { confirm, closeDropdown }: FilterRestProps = { confirm: false, closeDropdown: false },
  ) => {
    if (confirm) {
      internalTriggerFilter([]);
    }
    if (closeDropdown) {
      triggerOpen(false);
    }

    setSearchValue('');

    if (mergedFilter.resetToDefaultValue) {
      setFilteredKeysSync((toArray(mergedFilter.defaultValue) || []).map((key) => String(key)));
    } else {
      setFilteredKeysSync([]);
    }
  };

  const doFilter = ({ closeDropdown } = { closeDropdown: true }) => {
    if (closeDropdown) {
      triggerOpen(false);
    }
    internalTriggerFilter(getFilteredKeysSync());
  };

  const onOpenChange: DropdownProps['onOpenChange'] = (newOpen, info) => {
    if (info.source === 'trigger') {
      if (newOpen && propFilteredKeys !== undefined) {
        // Sync filteredKeys on appear in controlled mode (propFilteredKeys !== undefined)
        setFilteredKeysSync(wrapStringListType(propFilteredKeys));
      }

      triggerOpen(newOpen);

      // Delay to avoid date picker trigger onChange after onOpenChange
      setTimeout(() => {
        if (!newOpen && !mergedFilter.dropdown && filterOnClose) {
          onConfirm();
        }
      }, 50);
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
        column.valueType as Exclude<
          InternalColumnType<RecordType>['valueType'],
          (...args: any[]) => any
        >
      }
      valueEnum={
        column.valueEnum as Exclude<
          InternalColumnType<RecordType>['valueEnum'],
          (...args: any[]) => any
        >
      }
      selectedKeys={getFilteredKeysSync()}
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
        triggerOpen(false);
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
          'text-text-tertiary hover:bg-fill-quaternary hover:text-text-secondary relative ms-1 -me-1 flex items-center rounded-xs px-1',
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
