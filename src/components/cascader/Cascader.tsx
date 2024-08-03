import useEvent from 'rc-util/lib/hooks/useEvent';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import * as React from 'react';
import { clsx, getSemanticCls } from '../_util/classNameUtils';
import { useZIndex } from '../_util/hooks/useZIndex';
import { ConfigContext } from '../config-provider';
import DefaultRenderEmpty from '../config-provider/defaultRenderEmpty';
import { FormItemInputContext } from '../form/context';
import BaseSelect, { BaseSelectProps, BaseSelectRef, DisplayValueType } from '../select/BaseSelect';
import useBuiltinPlacements from '../select/hooks/useBuiltinPlacements';
import useIcons from '../select/hooks/useIcons';
import useId from '../select/hooks/useId';
import { RequestConfig, SelectCommonPlacement } from '../select/interface';
import CascaderContext from './context';
import useColumnIcons from './hooks/useColumnIcons';
import useDisplayValues from './hooks/useDisplayValues';
import useFilterOptions from './hooks/useFilterOptions';
import useOptions from './hooks/useOptions';
import useSelect from './hooks/useSelect';
import useValues from './hooks/useValues';
import {
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
  'onChange' | 'value' | 'defaultValue' | 'multiple' | 'pagination' | 'request'
> & {
  multiple?: boolean;
  value?: InternalValueType;
  defaultValue?: InternalValueType;
  pagination?: boolean;
  request?: RequestConfig<BaseOptionType, any[]>;
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
    request,
    ...restProps
  } = props;

  const {
    getPopupContainer: getContextPopupContainer,
    getPrefixCls,
    renderEmpty,
    popupOverflow,
  } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('cascader', customizePrefixCls);
  const semanticCls = getSemanticCls(className);

  const mergedId = useId(id);

  // =================== Form =====================
  const { hasFeedback, feedbackIcon } = React.useContext(FormItemInputContext);

  // =================== No Found ====================
  const mergedNotFoundContent = notFoundContent || renderEmpty?.('Cascader') || (
    <DefaultRenderEmpty componentName="Cascader" />
  );

  // ===================== Icons ======================
  const { suffixIcon, removeIcon, clearIcon } = useIcons({
    ...props,
    hasFeedback,
    feedbackIcon,
    prefixCls,
  });
  const [mergedExpandIcon, loadingIcon] = useColumnIcons(prefixCls, expandIcon);

  const mergedAllowClear = allowClear === true ? { clearIcon } : allowClear;

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

  // =========================== Option ===========================
  const [mergedOptions, getPathKeyEntities, getValueByKeyPath, getPathOptions] = useOptions(
    mergedFieldNames,
    options,
  );

  // =========================== Search ===========================
  const [mergedSearchValue, setSearchValue] = useMergedState('', {
    value: searchValue,
    postState: (search) => search || '',
  });

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
    !!request,
  );

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

  const cascaderContext = React.useMemo(
    () => ({
      options: mergedOptions,
      fieldNames: mergedFieldNames,
      values: rawCheckedValues,
      halfValues: rawHalfCheckedValues,
      changeOnSelect,
      onSelect: onInternalSelect,
      checkable: multiple,
      searchOptions,
      expandTrigger,
      expandIcon: mergedExpandIcon,
      loadingIcon,
      optionRender,
    }),
    [
      mergedOptions,
      mergedFieldNames,
      rawCheckedValues,
      rawHalfCheckedValues,
      changeOnSelect,
      onInternalSelect,
      multiple,
      searchOptions,
      expandTrigger,
      mergedExpandIcon,
      loadingIcon,
      optionRender,
    ],
  );

  const emptyOptions = !(mergedSearchValue ? searchOptions : mergedOptions).length;

  // ========================== Style ===========================
  const popupCls = clsx(
    'p-0',
    !mergedSearchValue && !emptyOptions && '!min-w-[auto]',
    semanticCls.popup,
  );

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
        displayValues={displayValues}
        onDisplayValuesChange={onDisplayValuesChange}
        mode={multiple ? 'multiple' : undefined}
        searchValue={mergedSearchValue}
        onSearch={onInternalSearch}
        showSearch={showSearch}
        OptionList={OptionList}
        emptyOptions={emptyOptions}
        className={{
          root: semanticCls.root,
          popup: popupCls,
        }}
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
>(
  props: CascaderProps<OptionType, MultipleType, ShowSearchType> & {
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
