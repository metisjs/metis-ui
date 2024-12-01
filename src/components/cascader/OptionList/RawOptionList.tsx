import * as React from 'react';
import { clsx } from '@util/classNameUtils';
import type { SafeKey } from '@util/type';
import type { useBaseProps } from '../../select';
import type { RefOptionListProps } from '../../select/BaseSelect';
import CascaderContext from '../context';
import type { DefaultOptionType, SingleValueType } from '../interface';
import {
  getFullPathKeys,
  isLeaf,
  scrollIntoParentView,
  toPathKey,
  toPathKeys,
} from '../utils/commonUtil';
import { toPathOptions } from '../utils/treeUtil';
import CacheContent from './CacheContent';
import Column, { FIX_LABEL } from './Column';
import useActive from './useActive';
import useKeyboard from './useKeyboard';

export type RawOptionListProps = Pick<
  ReturnType<typeof useBaseProps>,
  'prefixCls' | 'multiple' | 'searchValue' | 'toggleOpen' | 'notFoundContent' | 'open'
>;

const RawOptionList = React.forwardRef<RefOptionListProps, RawOptionListProps>((props, ref) => {
  const { prefixCls, multiple, searchValue, toggleOpen, notFoundContent, open } = props;

  const containerRef = React.useRef<HTMLDivElement>(null);

  const {
    options,
    values,
    halfValues,
    fieldNames,
    changeOnSelect,
    onSelect,
    searchOptions,
    expandTrigger,
    lazyLoad,
    loadData,
  } = React.useContext(CascaderContext);

  // ========================= loadData =========================
  const [loadingKeys, setLoadingKeys] = React.useState<React.Key[]>([]);

  const internalLoadData = async (valueCells: SafeKey[]) => {
    if (!lazyLoad || !loadData) {
      return;
    }

    const optionList = toPathOptions(valueCells, options, fieldNames);
    const rawOptions = optionList.map(({ option }) => option);
    const lastOption = rawOptions[rawOptions.length - 1];

    if (lastOption && !lastOption[fieldNames.children]?.length && !isLeaf(lastOption, fieldNames)) {
      const pathKey = toPathKey(valueCells);

      setLoadingKeys((keys) => [...keys, pathKey]);

      await loadData(lastOption);

      setLoadingKeys((keys) => keys.filter((key) => key !== pathKey));
    }
  };

  // ========================== Values ==========================
  const checkedSet = React.useMemo(() => new Set(toPathKeys(values)), [values]);
  const halfCheckedSet = React.useMemo(() => new Set(toPathKeys(halfValues)), [halfValues]);

  // ====================== Accessibility =======================
  const [activeValueCells, setActiveValueCells] = useActive(multiple, open);

  // =========================== Path ===========================
  const onPathOpen = (nextValueCells: SafeKey[]) => {
    setActiveValueCells(nextValueCells);

    // Trigger loadData
    internalLoadData(nextValueCells);
  };

  const isSelectable = (option: DefaultOptionType) => {
    const disabled = option[fieldNames.disabled];

    const isMergedLeaf = isLeaf(option, fieldNames);
    return !disabled && (isMergedLeaf || changeOnSelect || multiple);
  };

  const onPathSelect = (valuePath: SingleValueType, leaf: boolean, fromKeyboard = false) => {
    onSelect(valuePath);

    if (!multiple && (leaf || (changeOnSelect && (expandTrigger === 'hover' || fromKeyboard)))) {
      toggleOpen(false);
    }
  };

  // ========================== Option ==========================
  const mergedOptions = React.useMemo(() => {
    // searchOptions === null, 表示request search 正在查询中,依然正常显示options
    if (searchValue && searchOptions !== null) {
      return searchOptions;
    }

    return options;
  }, [searchValue, searchOptions, options]);

  // ========================== Column ==========================
  const optionColumns = React.useMemo(() => {
    const optionList = [{ options: mergedOptions }];
    let currentList = mergedOptions;

    const fullPathKeys = getFullPathKeys(currentList, fieldNames);

    for (let i = 0; i < activeValueCells.length; i += 1) {
      const activeValueCell = activeValueCells[i];
      const currentOption = currentList.find(
        (option, index) =>
          (fullPathKeys[index] ? toPathKey(fullPathKeys[index]) : option[fieldNames.value]) ===
          activeValueCell,
      );

      const subOptions = currentOption?.[fieldNames.children];
      if (!subOptions?.length) {
        break;
      }

      currentList = subOptions;
      optionList.push({ options: subOptions });
    }

    return optionList;
  }, [mergedOptions, activeValueCells, fieldNames]);

  // ========================= Keyboard =========================
  const onKeyboardSelect = (selectValueCells: SingleValueType, option: DefaultOptionType) => {
    if (isSelectable(option)) {
      onPathSelect(selectValueCells, isLeaf(option, fieldNames), true);
    }
  };

  useKeyboard(ref, mergedOptions, fieldNames, activeValueCells, onPathOpen, onKeyboardSelect, {
    searchValue,
    toggleOpen,
    open,
  });

  // >>>>> Active Scroll
  React.useEffect(() => {
    for (let i = 0; i < activeValueCells.length; i += 1) {
      const cellPath = activeValueCells.slice(0, i + 1);
      const cellKeyPath = toPathKey(cellPath);
      const ele = containerRef.current?.querySelector<HTMLElement>(
        `li[data-path-key="${cellKeyPath.replace(/\\{0,2}"/g, '\\"')}"]`, // matches unescaped double quotes
      );
      if (ele) {
        scrollIntoParentView(ele);
      }
    }
  }, [activeValueCells]);

  // ========================== Render ==========================
  // >>>>> Empty
  const isEmpty = !optionColumns[0]?.options?.length;

  const emptyList: DefaultOptionType[] = [
    {
      [fieldNames.value as 'value']: '__EMPTY__',
      [FIX_LABEL as 'label']: notFoundContent,
      [fieldNames.disabled]: true,
    },
  ];

  const columnProps = {
    ...props,
    multiple: !isEmpty && multiple,
    onSelect: onPathSelect,
    onActive: onPathOpen,
    onToggleOpen: toggleOpen,
    checkedSet,
    halfCheckedSet,
    loadingKeys,
    isSelectable,
  };

  // >>>>> Columns
  const mergedOptionColumns = isEmpty ? [{ options: emptyList }] : optionColumns;

  const columnNodes: React.ReactElement[] = mergedOptionColumns.map((col, index) => {
    const prevValuePath = activeValueCells.slice(0, index);
    const activeValue = activeValueCells[index];

    return (
      <Column
        key={index}
        {...columnProps}
        searchValue={searchValue}
        prefixCls={prefixCls}
        options={col.options}
        prevValuePath={prevValuePath}
        activeValue={activeValue}
      />
    );
  });

  // >>>>> Style
  const menusCls = clsx(
    `${prefixCls}-menus`,
    {
      [`${prefixCls}-menu-empty`]: isEmpty,
    },
    'flex flex-nowrap items-start',
  );

  // >>>>> Render
  return (
    <CacheContent open={open}>
      <div className={menusCls} ref={containerRef}>
        {columnNodes}
      </div>
    </CacheContent>
  );
});

if (process.env.NODE_ENV !== 'production') {
  RawOptionList.displayName = 'RawOptionList';
}

export default RawOptionList;
