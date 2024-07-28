import * as React from 'react';
import { clsx } from '../../_util/classNameUtils';
import Checkbox from '../../checkbox';
import Scrollbar from '../../scrollbar';
import CascaderContext from '../context';
import { SEARCH_MARK } from '../hooks/useFilterOptions';
import type { DefaultOptionType, SingleValueType } from '../interface';
import { isLeaf, toPathKey } from '../utils/commonUtil';

export const FIX_LABEL = '__cascader_fix_label__';

export interface ColumnProps {
  prefixCls: string;
  multiple?: boolean;
  options: DefaultOptionType[];
  /** Current Column opened item key */
  activeValue?: React.Key;
  /** The value path before current column */
  prevValuePath: React.Key[];
  onToggleOpen: (open: boolean) => void;
  onSelect: (valuePath: SingleValueType, leaf: boolean) => void;
  onActive: (valuePath: SingleValueType) => void;
  checkedSet: Set<React.Key>;
  halfCheckedSet: Set<React.Key>;
  loadingKeys: React.Key[];
  isSelectable: (option: DefaultOptionType) => boolean;
  searchValue?: string;
}

export default function Column({
  prefixCls,
  multiple,
  options,
  activeValue,
  prevValuePath,
  onToggleOpen,
  onSelect,
  onActive,
  checkedSet,
  halfCheckedSet,
  loadingKeys,
  isSelectable,
  searchValue,
}: ColumnProps) {
  const menuPrefixCls = `${prefixCls}-menu`;
  const menuItemPrefixCls = `${prefixCls}-menu-item`;

  const { fieldNames, changeOnSelect, expandTrigger, expandIcon, loadingIcon, optionRender } =
    React.useContext(CascaderContext);

  const hoverOpen = expandTrigger === 'hover';

  // ============================ Option ============================
  const optionInfoList = React.useMemo(
    () =>
      options.map((option) => {
        const { disabled } = option;
        const searchOptions: Record<string, any>[] = option[SEARCH_MARK];
        const label = option[FIX_LABEL] ?? option[fieldNames.label];
        const value = option[fieldNames.value];

        const isMergedLeaf = isLeaf(option, fieldNames);

        // Get real value of option. Search option is different way.
        const fullPath = searchOptions
          ? searchOptions.map((opt) => opt[fieldNames.value])
          : [...prevValuePath, value];
        const fullPathKey = toPathKey(fullPath);

        const isLoading = loadingKeys.includes(fullPathKey);

        // >>>>> checked
        const checked = checkedSet.has(fullPathKey);

        // >>>>> halfChecked
        const halfChecked = halfCheckedSet.has(fullPathKey);

        return {
          disabled,
          label,
          value,
          isLeaf: isMergedLeaf,
          isLoading,
          checked,
          halfChecked,
          option,
          fullPath,
          fullPathKey,
        };
      }),
    [options, checkedSet, fieldNames, halfCheckedSet, loadingKeys, prevValuePath],
  );

  // ============================ Style ============================
  const menuCls = clsx(menuPrefixCls, '');

  // ============================ Render ============================
  return (
    <Scrollbar>
      <ul className={menuCls} role="menu">
        {optionInfoList.map(
          ({
            disabled,
            label,
            value,
            isLeaf: isMergedLeaf,
            isLoading,
            checked,
            halfChecked,
            option,
            fullPath,
            fullPathKey,
          }) => {
            // >>>>> Open
            const triggerOpenPath = () => {
              if (disabled || searchValue) {
                return;
              }
              const nextValueCells = [...fullPath];
              if (hoverOpen && isMergedLeaf) {
                nextValueCells.pop();
              }
              onActive(nextValueCells);
            };

            // >>>>> Selection
            const triggerSelect = () => {
              if (isSelectable(option)) {
                onSelect(fullPath, isMergedLeaf);
              }
            };

            // >>>>> Title
            let title: string | undefined;
            if (typeof option.title === 'string') {
              title = option.title;
            } else if (typeof label === 'string') {
              title = label;
            }

            // >>>>> Render
            return (
              <li
                key={fullPathKey}
                className={clsx(menuItemPrefixCls, {
                  [`${menuItemPrefixCls}-expand`]: !isMergedLeaf,
                  [`${menuItemPrefixCls}-active`]:
                    activeValue === value || activeValue === fullPathKey,
                  [`${menuItemPrefixCls}-disabled`]: disabled,
                  [`${menuItemPrefixCls}-loading`]: isLoading,
                })}
                role="menuitemcheckbox"
                title={title}
                aria-checked={checked}
                data-path-key={fullPathKey}
                onClick={() => {
                  triggerOpenPath();
                  if (!multiple || isMergedLeaf) {
                    triggerSelect();
                  }
                }}
                onDoubleClick={() => {
                  if (changeOnSelect) {
                    onToggleOpen(false);
                  }
                }}
                onMouseEnter={() => {
                  if (hoverOpen) {
                    triggerOpenPath();
                  }
                }}
                onMouseDown={(e) => {
                  // Prevent selector from blurring
                  e.preventDefault();
                }}
              >
                {multiple && (
                  <Checkbox
                    prefixCls={`${prefixCls}-checkbox`}
                    checked={checked}
                    indeterminate={halfChecked}
                    disabled={disabled}
                    onClick={(e: React.MouseEvent<HTMLSpanElement>) => {
                      e.stopPropagation();
                      triggerSelect();
                    }}
                  />
                )}
                <div className={`${menuItemPrefixCls}-content`}>
                  {optionRender ? optionRender(option) : label}
                </div>
                {!isLoading && expandIcon && !isMergedLeaf && (
                  <div className={`${menuItemPrefixCls}-expand-icon`}>{expandIcon}</div>
                )}
                {isLoading && loadingIcon && (
                  <div className={`${menuItemPrefixCls}-loading-icon`}>{loadingIcon}</div>
                )}
              </li>
            );
          },
        )}
      </ul>
    </Scrollbar>
  );
}
