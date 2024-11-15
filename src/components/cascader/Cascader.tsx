import * as React from 'react';
import useEvent from 'rc-util/lib/hooks/useEvent';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import { clsx, mergeSemanticCls } from '../_util/classNameUtils';
import useSemanticCls from '../_util/hooks/useSemanticCls';
import { useZIndex } from '../_util/hooks/useZIndex';
import type { RequestConfig } from '../_util/type';
import { ConfigContext } from '../config-provider';
import DefaultRenderEmpty from '../config-provider/defaultRenderEmpty';
import useSize from '../config-provider/hooks/useSize';
import { FormItemInputContext } from '../form/context';
import type { BaseSelectProps, BaseSelectRef, DisplayValueType } from '../select/BaseSelect';
import BaseSelect from '../select/BaseSelect';
import useBuiltinPlacements from '../select/hooks/useBuiltinPlacements';
import useIcons from '../select/hooks/useIcons';
import useId from '../select/hooks/useId';
import type { SelectCommonPlacement } from '../select/interface';
import { useCompactItemContext } from '../space/Compact';
import CascaderContext from './context';
import useColumnIcons from './hooks/useColumnIcons';
import useDisplayValues from './hooks/useDisplayValues';
import useFilterOptions from './hooks/useFilterOptions';
import useOptions from './hooks/useOptions';
import useRequest from './hooks/useRequest';
import useSelect from './hooks/useSelect';
import useValues from './hooks/useValues';
import type {
  BaseOptionType,
  CascaderProps,
  DefaultOptionType,
  FieldNames,
  LabeledValueType,
  MultiValueType,
  SingleValueType,
} from './interface';
import OptionList from './OptionList';
import {
  fillFieldNames,
  isRawValues,
  SHOW_CHILD,
  SHOW_PARENT,
  toMultipleValue,
  toRawValueCells,
} from './utils/commonUtil';
import { formatStrategyValues, toPathOptions } from './utils/treeUtil';
import warningProps, { warningNullOptions } from './utils/warningPropsUtil';

export type InternalValueType =
  | SingleValueType
  | MultiValueType
  | DefaultOptionType[]
  | DefaultOptionType[][];
export interface InternalFieldNames extends Required<FieldNames> {
  key: string;
}

export type InternalCascaderProps = Omit<
  CascaderProps,
  'onChange' | 'value' | 'defaultValue' | 'multiple' | 'pagination' | 'request' | 'lazyLoad'
> & {
  multiple?: boolean;
  value?: InternalValueType;
  defaultValue?: InternalValueType;
  request?: RequestConfig<BaseOptionType, any[]>;
  lazyLoad?: boolean;
  onChange?: (
    value: SingleValueType | MultiValueType,
    selectOptions: BaseOptionType[] | BaseOptionType[][],
  ) => void;
};

export type CascaderRef = Omit<BaseSelectRef, 'scrollTo'>;

const Cascader = React.forwardRef<CascaderRef, InternalCascaderProps>((props, ref) => {
  const {
    id,
    prefixCls: customizePrefixCls,
    size: customizeSize,
    fieldNames,
    className,
    multiple = false,
    allowClear = true,
    notFoundContent,
    defaultValue,
    value,
    changeOnSelect,
    onChange,
    displayRender,
    autoClearSearchValue = true,
    searchValue,
    onSearch,
    showSearch,
    filterOption,
    filterRender,
    filterSort,
    optionFilterProp,
    expandTrigger,
    options,
    optionRender,
    placement,
    builtinPlacements,
    expandIcon,
    showCheckedStrategy = SHOW_PARENT,
    getPopupContainer,
    loading,
    request,
    lazyLoad,
    ...restProps
  } = props;

  const {
    getPopupContainer: getContextPopupContainer,
    getPrefixCls,
    renderEmpty,
    popupOverflow,
    cascader,
  } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('cascader', customizePrefixCls);

  const mergedId = useId(id);

  // =================== Form =====================
  const { hasFeedback, feedbackIcon } = React.useContext(FormItemInputContext);

  // =================== No Found ====================
  const mergedNotFoundContent = notFoundContent || renderEmpty?.('Cascader') || (
    <DefaultRenderEmpty componentName="Cascader" />
  );

  // ===================== Placement =====================
  const memoPlacement = React.useMemo<SelectCommonPlacement>(() => {
    if (placement !== undefined) {
      return placement;
    }
    return 'bottomLeft';
  }, [placement]);

  const mergedBuiltinPlacements = useBuiltinPlacements(builtinPlacements, popupOverflow);

  // ========================= FieldNames =========================
  const mergedFieldNames = React.useMemo(
    () => fillFieldNames(fieldNames),
    [JSON.stringify(fieldNames)],
  );

  // =========================== Search ===========================
  const [mergedSearchValue, setSearchValue] = useMergedState('', {
    value: searchValue,
    postState: (search) => search || '',
  });

  // ===================== Request =====================
  const requestSearchable = showSearch && request && lazyLoad;
  const {
    options: requestedOptions,
    searchOptions: requestedSearchOptions,
    loading: requestLoading,
    loadData,
  } = useRequest(
    mergedFieldNames,
    request,
    requestSearchable,
    requestSearchable ? mergedSearchValue : undefined,
    optionFilterProp,
    lazyLoad,
    filterOption,
    filterRender,
    filterSort,
    changeOnSelect,
  );
  const mergedLoading = loading || requestLoading;

  // =========================== Option ===========================
  const [mergedOptions, getPathKeyEntities, getValueByKeyPath, getPathOptions] = useOptions(
    mergedFieldNames,
    request ? requestedOptions : options,
  );

  // ===================== Icons ======================
  const { compactSize } = useCompactItemContext(prefixCls);
  const mergedSize = useSize((ctx) => customizeSize ?? compactSize ?? ctx);
  const { suffixIcon, removeIcon, clearIcon } = useIcons({
    ...props,
    loading: mergedLoading,
    hasFeedback,
    feedbackIcon,
    prefixCls,
    size: mergedSize,
  });
  const [mergedExpandIcon, loadingIcon] = useColumnIcons(expandIcon);

  const mergedAllowClear = allowClear === true ? { clearIcon } : allowClear;

  const onInternalSearch: BaseSelectProps['onSearch'] = (searchText, info) => {
    setSearchValue(searchText);

    if (info.source !== 'blur' && onSearch) {
      onSearch(searchText);
    }
  };

  const searchOptions = useFilterOptions(
    mergedOptions,
    mergedFieldNames,
    mergedSearchValue,
    filterOption,
    filterRender,
    filterSort,
    optionFilterProp,
    changeOnSelect,
    !!request && lazyLoad,
  );

  const mergedSearchOptions = request && lazyLoad ? requestedSearchOptions : searchOptions;

  // =========================== Values ===========================
  const [checkedValues, halfCheckedValues, missingCheckedValues, onValueChange, toLabeledValues] =
    useValues(
      multiple,
      defaultValue,
      value,
      mergedFieldNames,
      getPathOptions,
      getPathKeyEntities,
      getValueByKeyPath,
    );

  const deduplicatedValues = React.useMemo(
    () => [
      ...missingCheckedValues,
      ...formatStrategyValues(checkedValues, getPathKeyEntities, showCheckedStrategy),
    ],
    [checkedValues, getPathKeyEntities, missingCheckedValues, showCheckedStrategy],
  );

  const displayValues = useDisplayValues(
    deduplicatedValues,
    mergedFieldNames,
    multiple,
    displayRender,
  );

  // =========================== Change ===========================
  const triggerChange = useEvent(
    (nextValues: SingleValueType | MultiValueType | LabeledValueType | LabeledValueType[]) => {
      onValueChange(nextValues);

      // Save perf if no need trigger event
      if (onChange) {
        const nextValueList = toMultipleValue(nextValues) as (SingleValueType | LabeledValueType)[];
        const nextRawValues = toRawValueCells(nextValueList);

        const valueOptions = nextValueList.map((value) =>
          (isRawValues(value) ? toPathOptions(value, mergedOptions, mergedFieldNames) : value).map(
            (valueOpt) => valueOpt.option,
          ),
        ) as DefaultOptionType[][];

        const triggerValues = multiple ? nextRawValues : nextRawValues[0];
        const triggerOptions = multiple ? valueOptions : valueOptions[0];

        onChange(triggerValues, triggerOptions);
      }
    },
  );

  // =========================== Select ===========================
  const handleSelection = useSelect(
    multiple,
    triggerChange,
    checkedValues,
    halfCheckedValues,
    missingCheckedValues,
    mergedFieldNames,
    toLabeledValues,
    getValueByKeyPath,
    getPathKeyEntities,
    showCheckedStrategy,
  );

  const onInternalSelect = useEvent((valueCell: SingleValueType | LabeledValueType) => {
    if (!multiple || autoClearSearchValue) {
      setSearchValue('');
    }

    handleSelection(valueCell);
  });

  // Display Value change logic
  const onDisplayValuesChange: BaseSelectProps['onDisplayValuesChange'] = (_, info) => {
    if (info.type === 'clear') {
      triggerChange([]);
      return;
    }

    // Cascader do not support `add` type. Only support `remove`
    const { labeledValue } = info.values[0] as DisplayValueType & {
      labeledValue: LabeledValueType;
    };
    onInternalSelect(labeledValue);
  };

  // ========================== Warning ===========================
  if (process.env.NODE_ENV !== 'production') {
    warningProps(props);
    warningNullOptions(mergedOptions, mergedFieldNames);
  }

  // ========================== Context ===========================
  const rawCheckedValues = React.useMemo(() => toRawValueCells(checkedValues), [checkedValues]);
  const rawHalfCheckedValues = React.useMemo(
    () => toRawValueCells(halfCheckedValues),
    [halfCheckedValues],
  );

  const semanticCls = useSemanticCls(className, 'cascader', { open: true });
  const cascaderContext = React.useMemo(
    () => ({
      options: mergedOptions,
      fieldNames: mergedFieldNames,
      values: rawCheckedValues,
      halfValues: rawHalfCheckedValues,
      changeOnSelect,
      onSelect: onInternalSelect,
      checkable: multiple,
      searchOptions: mergedSearchOptions,
      expandTrigger,
      expandIcon: mergedExpandIcon,
      loadingIcon,
      optionRender,
      loadData,
      lazyLoad,
      columnClassName: semanticCls.column,
      optionClassName: semanticCls.option,
    }),
    [
      mergedOptions,
      mergedFieldNames,
      rawCheckedValues,
      rawHalfCheckedValues,
      changeOnSelect,
      onInternalSelect,
      multiple,
      mergedSearchOptions,
      expandTrigger,
      mergedExpandIcon,
      loadingIcon,
      optionRender,
      loadData,
      lazyLoad,
      semanticCls,
    ],
  );

  // mergedSearchOptions === null, 表示request search 正在查询中,依然正常显示options
  const emptyOptions = !(
    mergedSearchValue && mergedSearchOptions !== null ? mergedSearchOptions : mergedOptions
  ).length;

  // ========================== Style ===========================
  const popupCls = clsx(
    'p-0',
    !(mergedSearchValue && mergedSearchOptions !== null) && !emptyOptions && '!min-w-[auto]',
  );

  const mergedClassName = mergeSemanticCls({ popup: popupCls }, cascader?.className, className);

  // ============================ zIndex ============================
  const [zIndex] = useZIndex('SelectLike');

  // ============================ Render ============================
  return (
    <CascaderContext.Provider value={cascaderContext}>
      <BaseSelect
        {...restProps}
        ref={ref as any}
        id={mergedId}
        prefixCls={prefixCls}
        autoClearSearchValue={autoClearSearchValue}
        popupMatchSelectWidth={false}
        zIndex={zIndex}
        size={mergedSize}
        displayValues={displayValues}
        onDisplayValuesChange={onDisplayValuesChange}
        mode={multiple ? 'multiple' : undefined}
        searchValue={mergedSearchValue}
        onSearch={onInternalSearch}
        showSearch={showSearch}
        OptionList={OptionList}
        emptyOptions={emptyOptions}
        className={mergedClassName}
        builtinPlacements={mergedBuiltinPlacements}
        placement={memoPlacement}
        notFoundContent={mergedNotFoundContent}
        allowClear={mergedAllowClear}
        suffixIcon={suffixIcon}
        removeIcon={removeIcon}
        getPopupContainer={getPopupContainer || getContextPopupContainer}
        transition={{
          leave: 'transition ease-in duration-100',
          leaveFrom: 'opacity-100',
          leaveTo: 'opacity-0',
        }}
      />
    </CascaderContext.Provider>
  );
}) as unknown as (<
  OptionType extends DefaultOptionType = DefaultOptionType,
  MultipleType extends boolean = false,
  ShowSearchType extends boolean = false,
  LazyLoadType extends boolean = false,
>(
  props: CascaderProps<OptionType, MultipleType, ShowSearchType, LazyLoadType> & {
    ref?: React.Ref<CascaderRef>;
  },
) => React.ReactElement) & {
  displayName?: string;
  SHOW_PARENT: typeof SHOW_PARENT;
  SHOW_CHILD: typeof SHOW_CHILD;
};

if (process.env.NODE_ENV !== 'production') {
  Cascader.displayName = 'Cascader';
}

Cascader.SHOW_PARENT = SHOW_PARENT;
Cascader.SHOW_CHILD = SHOW_CHILD;

export default Cascader;
