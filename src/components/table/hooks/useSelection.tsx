import * as React from 'react';
import { useCallback, useMemo } from 'react';
import { ChevronDownOutline } from '@metisjs/icons';
import { clsx, mergeSemanticCls } from '@util/classNameUtils';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import useMultipleSelect from '../../_util/hooks/useMultipleSelect';
import type { AnyObject } from '../../_util/type';
import { devUseWarning } from '../../_util/warning';
import type { CheckboxProps } from '../../checkbox';
import Checkbox from '../../checkbox';
import Dropdown from '../../dropdown';
import Radio from '../../radio';
import type { DataNode, GetCheckDisabled } from '../../tree/interface';
import { conductCheck } from '../../tree/utils/conductUtil';
import { arrAdd, arrDel } from '../../tree/utils/miscUtil';
import { convertDataToEntities } from '../../tree/utils/treeUtil';
import {
  INTERNAL_COL_DEFINE,
  SELECTION_ALL,
  SELECTION_COLUMN,
  SELECTION_INVERT,
  SELECTION_NONE,
} from '../constant';
import type {
  ColumnsType,
  ColumnType,
  ExpandableType,
  FixedType,
  GetPopupContainer,
  GetRowKey,
  Key,
  RowSelectMethod,
  SelectionItem,
  TableLocale,
  TableRowSelection,
} from '../interface';

const EMPTY_LIST: Key[] = [];

interface UseSelectionConfig<RecordType = AnyObject> {
  prefixCls: string;
  pageData: RecordType[];
  data: readonly RecordType[];
  getRowKey: GetRowKey<RecordType>;
  getRecordByKey: (key: Key) => RecordType;
  expandableType: ExpandableType;
  childrenColumnName: keyof RecordType;
  locale: TableLocale;
  verticalLine?: boolean;
  size?: 'default' | 'middle' | 'small';
  getPopupContainer?: GetPopupContainer;
}

export type InternalSelectionItem =
  | SelectionItem
  | typeof SELECTION_ALL
  | typeof SELECTION_INVERT
  | typeof SELECTION_NONE;

const flattenData = <RecordType extends AnyObject = AnyObject>(
  childrenColumnName: keyof RecordType,
  data?: RecordType[],
): RecordType[] => {
  let list: RecordType[] = [];
  (data || []).forEach((record) => {
    list.push(record);
    if (record && typeof record === 'object' && childrenColumnName in record) {
      list = [...list, ...flattenData<RecordType>(childrenColumnName, record[childrenColumnName])];
    }
  });
  return list;
};

const useSelection = <RecordType extends AnyObject = AnyObject>(
  config: UseSelectionConfig<RecordType>,
  rowSelection?: TableRowSelection<RecordType>,
): readonly [(columns: ColumnsType<RecordType>) => ColumnsType<RecordType>, Set<Key>] => {
  const {
    preserveSelectedRowKeys = true,
    selectedRowKeys,
    defaultSelectedRowKeys,
    getCheckboxProps,
    onChange: onSelectionChange,
    onSelect,
    columnWidth: selectionColWidth,
    type: selectionType,
    selections,
    fixed,
    cellRender: customizeCellRender,
    hideSelectAll,
    checkStrictly = true,
    optionRender,
  } = rowSelection || {};

  const {
    prefixCls,
    data,
    pageData,
    getRecordByKey,
    getRowKey,
    expandableType,
    childrenColumnName,
    locale: tableLocale,
    verticalLine,
    size,
    getPopupContainer,
  } = config;

  const warning = devUseWarning('Table');

  // ========================= MultipleSelect =========================
  const [, updatePrevSelectedIndex] = useMultipleSelect<React.Key, React.Key>((item) => item);

  // ========================= Keys =========================
  const [mergedSelectedKeys, setMergedSelectedKeys] = useMergedState(
    selectedRowKeys || defaultSelectedRowKeys || EMPTY_LIST,
    {
      value: selectedRowKeys,
    },
  );

  // ======================== Caches ========================
  const preserveRecordsRef = React.useRef(new Map<Key, RecordType>());

  const updatePreserveRecordsCache = useCallback(
    (keys: Key[]) => {
      if (preserveSelectedRowKeys) {
        const newCache = new Map<Key, RecordType>();
        // Keep key if mark as preserveSelectedRowKeys
        keys.forEach((key) => {
          let record = getRecordByKey(key);

          if (!record && preserveRecordsRef.current.has(key)) {
            record = preserveRecordsRef.current.get(key)!;
          }

          newCache.set(key, record);
        });
        // Refresh to new cache
        preserveRecordsRef.current = newCache;
      }
    },
    [getRecordByKey, preserveSelectedRowKeys],
  );

  // Update cache with selectedKeys
  React.useEffect(() => {
    updatePreserveRecordsCache(mergedSelectedKeys);
  }, [mergedSelectedKeys]);

  // Get flatten data
  const flattedData = useMemo(
    () => flattenData(childrenColumnName, pageData),
    [childrenColumnName, pageData],
  );

  const { keyEntities } = useMemo(() => {
    if (checkStrictly) {
      return { keyEntities: null };
    }
    let convertData = data;
    if (preserveSelectedRowKeys) {
      // use flattedData keys
      const keysSet = new Set(flattedData.map((record, index) => getRowKey(record, index)));
      // remove preserveRecords that duplicate data
      const preserveRecords = Array.from(preserveRecordsRef.current).reduce(
        (total: RecordType[], [key, value]) => (keysSet.has(key) ? total : total.concat(value)),
        [],
      );
      convertData = [...convertData, ...preserveRecords];
    }
    return convertDataToEntities(convertData as unknown as DataNode[], {
      externalGetKey: getRowKey as any,
      childrenPropName: childrenColumnName as string,
    });
  }, [data, getRowKey, checkStrictly, childrenColumnName, preserveSelectedRowKeys, flattedData]);

  // Get all checkbox props
  const checkboxPropsMap = useMemo(() => {
    const map = new Map<Key, Partial<CheckboxProps>>();
    flattedData.forEach((record, index) => {
      const key = getRowKey(record, index);
      const checkboxProps = (getCheckboxProps ? getCheckboxProps(record) : null) || {};
      map.set(key, checkboxProps);

      warning(
        !('checked' in checkboxProps || 'defaultChecked' in checkboxProps),
        'usage',
        'Do not set `checked` or `defaultChecked` in `getCheckboxProps`. Please use `selectedRowKeys` instead.',
      );
    });
    return map;
  }, [flattedData, getRowKey, getCheckboxProps]);

  const isCheckboxDisabled: GetCheckDisabled<RecordType> = useCallback(
    (r: RecordType) => !!checkboxPropsMap.get(getRowKey(r))?.disabled,
    [checkboxPropsMap, getRowKey],
  );

  const [derivedSelectedKeys, derivedHalfSelectedKeys] = useMemo(() => {
    if (checkStrictly) {
      return [mergedSelectedKeys || [], []];
    }
    const { checkedKeys, halfCheckedKeys } = conductCheck(
      mergedSelectedKeys,
      true,
      keyEntities as any,
      isCheckboxDisabled as any,
    );
    return [checkedKeys || [], halfCheckedKeys];
  }, [mergedSelectedKeys, checkStrictly, keyEntities, isCheckboxDisabled]);

  const derivedSelectedKeySet = useMemo<Set<Key>>(() => {
    const keys = selectionType === 'radio' ? derivedSelectedKeys.slice(0, 1) : derivedSelectedKeys;
    return new Set(keys);
  }, [derivedSelectedKeys, selectionType]);

  const derivedHalfSelectedKeySet = useMemo<Set<Key>>(
    () => (selectionType === 'radio' ? new Set() : new Set(derivedHalfSelectedKeys)),
    [derivedHalfSelectedKeys, selectionType],
  );

  // Reset if rowSelection reset
  React.useEffect(() => {
    if (!rowSelection) {
      setMergedSelectedKeys(EMPTY_LIST);
    }
  }, [!!rowSelection]);

  const setSelectedKeys = useCallback(
    (keys: Key[], method: RowSelectMethod) => {
      let availableKeys: Key[];
      let records: RecordType[];

      updatePreserveRecordsCache(keys);

      if (preserveSelectedRowKeys) {
        availableKeys = keys;
        records = keys.map((key) => preserveRecordsRef.current.get(key)!);
      } else {
        // Filter key which not exist in the `dataSource`
        availableKeys = [];
        records = [];

        keys.forEach((key) => {
          const record = getRecordByKey(key);
          if (record !== undefined) {
            availableKeys.push(key);
            records.push(record);
          }
        });
      }

      setMergedSelectedKeys(availableKeys);

      onSelectionChange?.(availableKeys, records, { type: method });
    },
    [setMergedSelectedKeys, getRecordByKey, onSelectionChange, preserveSelectedRowKeys],
  );

  // ====================== Selections ======================
  // Trigger single `onSelect` event
  const triggerSingleSelection = useCallback(
    (key: Key, selected: boolean, keys: Key[], event: Event) => {
      if (onSelect) {
        const rows = keys.map((k) => getRecordByKey(k));
        onSelect(getRecordByKey(key), selected, rows, event);
      }

      setSelectedKeys(keys, 'single');
    },
    [onSelect, getRecordByKey, setSelectedKeys],
  );

  const mergedSelections = useMemo<SelectionItem[] | null>(() => {
    if (!selections || hideSelectAll) {
      return null;
    }

    const selectionList: InternalSelectionItem[] =
      selections === true ? [SELECTION_ALL, SELECTION_INVERT, SELECTION_NONE] : selections;

    return selectionList
      .map((selection: InternalSelectionItem) => {
        if (selection === SELECTION_ALL) {
          return {
            key: 'all',
            label: tableLocale.selection!.selectAll,
            onSelect() {
              setSelectedKeys(
                data
                  .map((record, index) => getRowKey(record, index))
                  .filter((key) => {
                    const checkProps = checkboxPropsMap.get(key);
                    return !checkProps?.disabled || derivedSelectedKeySet.has(key);
                  }),
                'all',
              );
            },
          };
        }
        if (selection === SELECTION_INVERT) {
          return {
            key: 'invert',
            label: tableLocale.selection!.selectInvert,
            onSelect() {
              const keySet = new Set(derivedSelectedKeySet);
              pageData.forEach((record, index) => {
                const key = getRowKey(record, index);
                const checkProps = checkboxPropsMap.get(key);

                if (!checkProps?.disabled) {
                  if (keySet.has(key)) {
                    keySet.delete(key);
                  } else {
                    keySet.add(key);
                  }
                }
              });

              const keys = Array.from(keySet);

              setSelectedKeys(keys, 'invert');
            },
          };
        }
        if (selection === SELECTION_NONE) {
          return {
            key: 'none',
            label: tableLocale.selection!.selectNone,
            onSelect() {
              setSelectedKeys(
                Array.from(derivedSelectedKeySet).filter((key) => {
                  const checkProps = checkboxPropsMap.get(key);
                  return checkProps?.disabled;
                }),
                'none',
              );
            },
          };
        }
        return selection as SelectionItem;
      })
      .map((selection) => ({
        ...selection,
        onSelect: (...rest) => {
          selection.onSelect?.(...rest);
          updatePrevSelectedIndex(null);
        },
      }));
  }, [selections, derivedSelectedKeySet, pageData, getRowKey, setSelectedKeys]);

  // ======================= Columns ========================
  const transformColumns = useCallback(
    (columns: ColumnsType<RecordType>): ColumnsType<RecordType> => {
      // >>>>>>>>>>> Skip if not exists `rowSelection`
      if (!rowSelection) {
        warning(
          !columns.includes(SELECTION_COLUMN),
          'usage',
          '`rowSelection` is not config but `SELECTION_COLUMN` exists in the `columns`.',
        );

        return columns.filter((col) => col !== SELECTION_COLUMN);
      }

      // >>>>>>>>>>> Support selection
      let cloneColumns = [...columns];
      const keySet = new Set(derivedSelectedKeySet);

      // Record key only need check with enabled
      const recordKeys = flattedData
        .map(getRowKey)
        .filter((key) => !checkboxPropsMap.get(key)!.disabled);
      const checkedCurrentAll = recordKeys.every((key) => keySet.has(key));
      const checkedCurrentSome = recordKeys.some((key) => keySet.has(key));

      const onSelectAllChange = () => {
        const changeKeys: Key[] = [];

        if (checkedCurrentAll) {
          recordKeys.forEach((key) => {
            keySet.delete(key);
            changeKeys.push(key);
          });
        } else {
          recordKeys.forEach((key) => {
            if (!keySet.has(key)) {
              keySet.add(key);
              changeKeys.push(key);
            }
          });
        }

        const keys = Array.from(keySet);

        setSelectedKeys(keys, 'all');
        updatePrevSelectedIndex(null);
      };

      // ===================== Render =====================
      // Title Cell
      let title: React.ReactNode;
      let columnTitleCheckbox: React.ReactNode;
      if (selectionType !== 'radio') {
        let customizeSelections: React.ReactNode;
        if (mergedSelections) {
          const menu = {
            getPopupContainer,
            items: mergedSelections.map((selection, index) => {
              const { key, label: text, onSelect: onSelectionClick } = selection;

              return {
                key: key ?? index,
                onClick: () => {
                  onSelectionClick?.(recordKeys);
                },
                label: text,
              };
            }),
          };
          customizeSelections = (
            <div
              className={clsx(
                `${prefixCls}-selection-extra`,
                'absolute right-1 top-1/2 z-[1] -translate-y-1/2 translate-x-full cursor-pointer',
              )}
            >
              <Dropdown
                menu={menu}
                getPopupContainer={getPopupContainer}
                className={({ open }) =>
                  clsx(
                    'text-text-tertiary transition-colors hover:text-text-secondary',
                    open && 'text-text-secondary',
                  )
                }
              >
                <span>
                  <ChevronDownOutline className="h-3 w-3" />
                </span>
              </Dropdown>
            </div>
          );
        }

        const allDisabledData = flattedData
          .map((record, index) => {
            const key = getRowKey(record, index);
            const checkboxProps = checkboxPropsMap.get(key) || {};
            return { checked: keySet.has(key), ...checkboxProps };
          })
          .filter(({ disabled }) => disabled);

        const allDisabled =
          !!allDisabledData.length && allDisabledData.length === flattedData.length;

        const allDisabledAndChecked =
          allDisabled && allDisabledData.every(({ checked }) => checked);
        const allDisabledSomeChecked =
          allDisabled && allDisabledData.some(({ checked }) => checked);

        columnTitleCheckbox = (
          <Checkbox
            checked={
              !allDisabled ? !!flattedData.length && checkedCurrentAll : allDisabledAndChecked
            }
            indeterminate={
              !allDisabled
                ? !checkedCurrentAll && checkedCurrentSome
                : !allDisabledAndChecked && allDisabledSomeChecked
            }
            onChange={onSelectAllChange}
            disabled={flattedData.length === 0 || allDisabled}
            aria-label={customizeSelections ? 'Custom selection' : 'Select all'}
            skipGroup
            className={{ indicator: 'peer-focus/checkbox:outline-0' }}
          />
        );

        let selectedOptionNode: React.ReactNode;
        if (optionRender && derivedSelectedKeys.length) {
          let selectedRows: RecordType[] = [];
          if (preserveSelectedRowKeys) {
            selectedRows = derivedSelectedKeys.map((key) => preserveRecordsRef.current.get(key)!);
          } else {
            selectedRows = [];

            derivedSelectedKeys.forEach((key) => {
              const record = getRecordByKey(key);
              if (record !== undefined) {
                selectedRows.push(record);
              }
            });
          }

          selectedOptionNode = (
            <div
              className={clsx(
                `${prefixCls}-selection-option`,
                'absolute right-0 top-1/2 z-[1] -translate-y-1/2 translate-x-full pe-2 ps-3',
                { 'ps-2': size === 'middle' || size === 'small' },
              )}
            >
              {optionRender({
                selectedRowKeys: derivedSelectedKeys,
                selectedRows: selectedRows,
                clearSelected: () =>
                  setSelectedKeys(
                    Array.from(derivedSelectedKeySet).filter((key) => {
                      const checkProps = checkboxPropsMap.get(key);
                      return checkProps?.disabled;
                    }),
                    'none',
                  ),
              })}
            </div>
          );
        }

        title = (
          <div className={clsx(`${prefixCls}-selection`, 'inline-flex align-text-top')}>
            {!hideSelectAll && columnTitleCheckbox}
            {!hideSelectAll && customizeSelections}
            {selectedOptionNode}
          </div>
        );
      }

      // Body Cell
      let cellRender: (
        _: RecordType,
        record: RecordType,
        index: number,
      ) => { node: React.ReactNode; checked: boolean };
      if (selectionType === 'radio') {
        cellRender = (_, record, index) => {
          const key = getRowKey(record, index);
          const checked = keySet.has(key);
          const checkboxProps = checkboxPropsMap.get(key);
          return {
            node: (
              <Radio
                {...checkboxProps}
                className={mergeSemanticCls(
                  { root: 'align-text-top', indicator: 'peer-focus/radio:outline-0' },
                  checkboxProps?.className,
                )}
                checked={checked}
                onClick={(e) => {
                  e.stopPropagation();
                  checkboxProps?.onClick?.(e);
                }}
                onChange={(newChecked, event) => {
                  if (!keySet.has(key)) {
                    triggerSingleSelection(key, true, [key], event.nativeEvent);
                  }
                  checkboxProps?.onChange?.(newChecked, event);
                }}
              />
            ),
            checked,
          };
        };
      } else {
        cellRender = (_, record, index) => {
          const key = getRowKey(record, index);
          const checked = keySet.has(key);
          const indeterminate = derivedHalfSelectedKeySet.has(key);
          const checkboxProps = checkboxPropsMap.get(key);
          let mergedIndeterminate: boolean;
          if (expandableType === 'nest') {
            mergedIndeterminate = indeterminate;
            warning(
              typeof checkboxProps?.indeterminate !== 'boolean',
              'usage',
              'set `indeterminate` using `rowSelection.getCheckboxProps` is not allowed with tree structured dataSource.',
            );
          } else {
            mergedIndeterminate = checkboxProps?.indeterminate ?? indeterminate;
          }
          // Record checked
          return {
            node: (
              <Checkbox
                {...checkboxProps}
                className={mergeSemanticCls(
                  { root: 'align-text-top', indicator: 'peer-focus/checkbox:outline-0' },
                  checkboxProps?.className,
                )}
                indeterminate={mergedIndeterminate}
                checked={checked}
                skipGroup
                onClick={(e) => {
                  e.stopPropagation();
                  checkboxProps?.onClick?.(e);
                }}
                onChange={(_, event) => {
                  const { nativeEvent } = event;
                  const { shiftKey } = nativeEvent as MouseEvent;
                  const currentSelectedIndex = recordKeys.findIndex((item) => item === key);
                  const isMultiple = derivedSelectedKeys.some((item) => recordKeys.includes(item));

                  if (shiftKey && checkStrictly && isMultiple) {
                    const keys = Array.from(keySet);

                    setSelectedKeys(keys, 'multiple');
                  } else {
                    // Single record selected
                    const originCheckedKeys = derivedSelectedKeys;
                    if (checkStrictly) {
                      const checkedKeys = checked
                        ? arrDel(originCheckedKeys, key)
                        : arrAdd(originCheckedKeys, key);
                      triggerSingleSelection(key, !checked, checkedKeys, nativeEvent);
                    } else {
                      // Always fill first
                      const result = conductCheck(
                        [...originCheckedKeys, key],
                        true,
                        keyEntities as any,
                        isCheckboxDisabled as any,
                      );
                      const { checkedKeys, halfCheckedKeys } = result;
                      let nextCheckedKeys = checkedKeys;

                      // If remove, we do it again to correction
                      if (checked) {
                        const tempKeySet = new Set(checkedKeys);
                        tempKeySet.delete(key);
                        nextCheckedKeys = conductCheck(
                          Array.from(tempKeySet),
                          { checked: false, halfCheckedKeys },
                          keyEntities as any,
                          isCheckboxDisabled as any,
                        ).checkedKeys;
                      }

                      triggerSingleSelection(key, !checked, nextCheckedKeys, nativeEvent);
                    }
                  }

                  if (checked) {
                    updatePrevSelectedIndex(null);
                  } else {
                    updatePrevSelectedIndex(currentSelectedIndex);
                  }
                  checkboxProps?.onChange?.(_, event);
                }}
              />
            ),
            checked,
          };
        };
      }

      const renderSelectionCell = (_: any, record: RecordType, index: number) => {
        const { node, checked } = cellRender(_, record, index);

        if (customizeCellRender) {
          return customizeCellRender(checked, record, index, node);
        }

        return node;
      };

      // Insert selection column if not exist
      if (!cloneColumns.includes(SELECTION_COLUMN)) {
        // Always after expand icon
        if (
          cloneColumns.findIndex(
            (col: any) => col[INTERNAL_COL_DEFINE]?.columnType === 'EXPAND_COLUMN',
          ) === 0
        ) {
          const [expandColumn, ...restColumns] = cloneColumns;
          cloneColumns = [expandColumn, SELECTION_COLUMN, ...restColumns];
        } else {
          // Normal insert at first column
          cloneColumns = [SELECTION_COLUMN, ...cloneColumns];
        }
      }

      // Deduplicate selection column
      const selectionColumnIndex = cloneColumns.indexOf(SELECTION_COLUMN);

      warning(
        cloneColumns.filter((col) => col === SELECTION_COLUMN).length <= 1,
        'usage',
        'Multiple `SELECTION_COLUMN` exist in `columns`.',
      );

      cloneColumns = cloneColumns.filter(
        (column, index) => column !== SELECTION_COLUMN || index === selectionColumnIndex,
      );

      // Fixed column logic
      const prevCol: ColumnType<RecordType> & Record<string, any> =
        cloneColumns[selectionColumnIndex - 1];
      const nextCol: ColumnType<RecordType> & Record<string, any> =
        cloneColumns[selectionColumnIndex + 1];

      let mergedFixed: FixedType | undefined = fixed;

      if (mergedFixed === undefined) {
        if (nextCol?.fixed !== undefined) {
          mergedFixed = nextCol.fixed;
        } else if (prevCol?.fixed !== undefined) {
          mergedFixed = prevCol.fixed;
        }
      }

      if (
        mergedFixed &&
        prevCol &&
        prevCol[INTERNAL_COL_DEFINE]?.columnType === 'EXPAND_COLUMN' &&
        prevCol.fixed === undefined
      ) {
        prevCol.fixed = mergedFixed;
      }

      const columnCls = clsx(
        `${prefixCls}-selection-col`,
        {
          [`${prefixCls}-selection-col-with-dropdown`]: selections && selectionType === 'checkbox',
        },
        'w-10',
        {
          'w-8': size === 'middle' || size === 'small',
        },
        !verticalLine && [
          'w-6 first:w-9 last:w-9',
          {
            'first:w-8 last:w-8': size === 'middle' || size === 'small',
          },
        ],
      );

      const renderColumnTitle = () => {
        if (!rowSelection?.columnTitle) {
          return title;
        }
        if (typeof rowSelection.columnTitle === 'function') {
          return rowSelection.columnTitle(columnTitleCheckbox);
        }
        return rowSelection.columnTitle;
      };

      // Replace with real selection column
      const selectionColumn: ColumnsType<RecordType>[0] & {
        [INTERNAL_COL_DEFINE]: Record<string, any>;
      } = {
        fixed: mergedFixed,
        width: selectionColWidth,
        className: ({ rowType }) =>
          clsx(
            `${prefixCls}-selection-column`,
            !verticalLine && [
              'px-1 text-center first:pl-4 first:pr-1 last:pl-1 last:pr-4',
              {
                'first:pl-3 first:pr-1 last:pl-1 last:pr-3': size === 'middle' || size === 'small',
              },
            ],
            {
              'before:hidden': rowType === 'header',
              'px-4': verticalLine && mergedSelections,
            },
          ),
        title: renderColumnTitle(),
        render: renderSelectionCell,
        onCell: rowSelection.onCell,
        [INTERNAL_COL_DEFINE]: { className: columnCls, columnType: 'SELECTION_COLUMN' },
      };

      return cloneColumns.map((col) => (col === SELECTION_COLUMN ? selectionColumn : col));
    },
    [
      getRowKey,
      flattedData,
      rowSelection,
      derivedSelectedKeys,
      derivedSelectedKeySet,
      derivedHalfSelectedKeySet,
      selectionColWidth,
      mergedSelections,
      expandableType,
      checkboxPropsMap,
      triggerSingleSelection,
      isCheckboxDisabled,
      verticalLine,
      size,
      optionRender,
      getRecordByKey,
    ],
  );

  return [transformColumns, derivedSelectedKeySet] as const;
};

export default useSelection;
