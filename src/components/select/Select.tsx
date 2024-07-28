import useMergedState from 'rc-util/lib/hooks/useMergedState';
import * as React from 'react';
import useMemoizedFn from '../_util/hooks/useMemoizedFn';
import { useZIndex } from '../_util/hooks/useZIndex';
import { devUseWarning } from '../_util/warning';
import { ConfigContext } from '../config-provider';
import DefaultRenderEmpty from '../config-provider/defaultRenderEmpty';
import { FormItemInputContext } from '../form/context';
import type {
  BaseSelectProps,
  BaseSelectRef,
  DisplayInfoType,
  DisplayValueType,
} from './BaseSelect';
import BaseSelect, { isMultiple } from './BaseSelect';
import OptionList from './OptionList';
import { SelectContext, SelectContextProps } from './context';
import useBuiltinPlacements from './hooks/useBuiltinPlacements';
import useCache from './hooks/useCache';
import useFilterOptions from './hooks/useFilterOptions';
import useIcons from './hooks/useIcons';
import useId from './hooks/useId';
import useOptions from './hooks/useOptions';
import useRequest from './hooks/useRequest';
import {
  BaseOptionType,
  DraftValueType,
  LabeledValueType,
  OnActiveValue,
  OnInternalSelect,
  OptionInValueType,
  RawValueType,
  RequestConfig,
  SelectCommonPlacement,
  SelectProps,
} from './interface';
import { hasValue, toArray } from './utils/commonUtil';
import { fillFieldNames, flattenOptions } from './utils/valueUtil';
import warningProps, { warningNullOptions } from './utils/warningPropsUtil';

const OMIT_DOM_PROPS = ['inputValue'];

export const SelectPlacements = ['bottomLeft', 'bottomRight', 'topLeft', 'topRight'] as const;

function isRawValue(value: DraftValueType): value is RawValueType {
  return !value || typeof value !== 'object';
}

export interface InternalSelectProps
  extends Omit<
    SelectProps,
    | 'mode'
    | 'value'
    | 'defaultValue'
    | 'showSearch'
    | 'optionInValue'
    | 'onChange'
    | 'onSelect'
    | 'onDeselect'
    | 'pagination'
    | 'request'
  > {
  mode?: 'multiple' | 'tags';
  value?: any;
  defaultValue?: any;
  showSearch?: boolean;
  optionInValue?: boolean;
  pagination?: boolean;
  request?: RequestConfig<BaseOptionType, any[]>;
  onChange?: (value: any, option?: any) => void;
  onSelect?: (value: RawValueType | BaseOptionType, option?: BaseOptionType) => void;
  onDeselect?: (value: RawValueType | BaseOptionType, option?: BaseOptionType) => void;
}

const Select = React.forwardRef((props: InternalSelectProps, ref: React.Ref<BaseSelectRef>) => {
  const {
    id,
    mode,
    combobox,
    className,
    prefixCls: customizePrefixCls,
    fieldNames,
    allowClear,
    displayRender,

    // Request
    request,
    pagination,

    // Search
    searchValue,
    onSearch,
    autoClearSearchValue = true,

    // Select
    onSelect,
    onDeselect,
    popupMatchSelectWidth = true,

    // Options
    filterOption,
    filterSort,
    optionFilterProp,

    options,
    optionRender,
    defaultActiveFirstOption,
    virtual,
    listHeight = 256,
    listItemHeight = 24,

    // Value
    value,
    defaultValue,
    optionInValue,
    onChange,

    notFoundContent,
    placement,
    builtinPlacements,
    getPopupContainer,

    loading,
    showSearch,

    onPopupScroll,
    getInputElement,

    ...restProps
  } = props;

  const warning = devUseWarning('Select');

  const {
    getPopupContainer: getContextPopupContainer,
    getPrefixCls,
    renderEmpty,
    virtual: contextVirtual,
    popupMatchSelectWidth: contextPopupMatchSelectWidth,
    popupOverflow,
  } = React.useContext(ConfigContext);

  const prefixCls = getPrefixCls('select', customizePrefixCls);
  const mergedId = useId(id);
  const multiple = isMultiple(mode);
  const mergedVirtual = virtual ?? contextVirtual;
  const mergedMode = combobox ? 'combobox' : mode;
  const mergedPopupMatchSelectWidth = popupMatchSelectWidth ?? contextPopupMatchSelectWidth;

  // ===================== Form Status =====================
  const { hasFeedback, feedbackIcon } = React.useContext(FormItemInputContext);

  // =========================== Search ===========================
  const [mergedSearchValue, setSearchValue] = useMergedState('', {
    value: searchValue,
    postState: (search) => search || '',
  });

  // ========================= FieldNames =========================
  const mergedFieldNames = React.useMemo(
    () => fillFieldNames(fieldNames),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(fieldNames)],
  );

  // ===================== Request =====================
  const {
    options: requestedOptions,
    loading: requestLoading,
    onScroll: onInternalPopupScroll,
  } = useRequest(
    mergedFieldNames,
    request,
    showSearch,
    mergedSearchValue,
    optionFilterProp,
    pagination,
    onPopupScroll,
    combobox,
  );
  const mergedLoading = loading || requestLoading;

  // ===================== Empty =====================
  let mergedNotFound: React.ReactNode;
  if (requestLoading) {
    mergedNotFound = null;
  } else if (notFoundContent !== undefined) {
    mergedNotFound = notFoundContent;
  } else if (mergedMode === 'combobox') {
    mergedNotFound = null;
  } else {
    mergedNotFound = renderEmpty?.('Select') || <DefaultRenderEmpty componentName="Select" />;
  }

  // ===================== Icons =====================
  const { suffixIcon, itemIcon, removeIcon, clearIcon } = useIcons({
    ...props,
    loading: mergedLoading,
    multiple,
    hasFeedback,
    feedbackIcon,
    prefixCls,
  });

  const mergedAllowClear = allowClear === true ? { clearIcon } : allowClear;

  // ===================== Placement =====================
  const memoPlacement = React.useMemo<SelectCommonPlacement>(() => {
    if (placement !== undefined) {
      return placement;
    }
    return 'bottomLeft';
  }, [placement]);

  const mergedBuiltinPlacements = useBuiltinPlacements(builtinPlacements, popupOverflow);

  // ========================= FilterOption =========================
  const mergedFilterOption = React.useMemo(() => {
    if (filterOption === undefined && mergedMode === 'combobox') {
      return false;
    }
    return filterOption;
  }, [filterOption, mergedMode]);

  // =========================== Option ===========================
  const parsedOptions = useOptions<BaseOptionType>(
    mergedFieldNames,
    request ? requestedOptions : options,
  );
  const { valueOptions, labelOptions, options: mergedOptions } = parsedOptions;

  // ========================= Wrap Value =========================
  const convert2LabelValues = React.useCallback(
    (draftValues: DraftValueType): LabeledValueType[] => {
      // Convert to array
      const valueList = toArray(draftValues);

      // Convert to optionInValue type
      return valueList.map((val) => {
        let rawValue: RawValueType;
        let rawLabel: React.ReactNode;
        let rawKey: React.Key | undefined;
        let rawDisabled: boolean | undefined;
        let rawTitle: string = '';

        // Fill label & value
        if (isRawValue(val)) {
          rawValue = val;
        } else {
          rawKey = val.key;
          rawValue = val[mergedFieldNames.value] ?? val.value;
          rawLabel = val[mergedFieldNames.label] ?? val.label;
        }

        const option = valueOptions.get(rawValue);
        if (option) {
          if (rawLabel === undefined) rawLabel = option[mergedFieldNames.label];
          if (rawKey === undefined) rawKey = option?.key ?? rawValue;
          rawDisabled = option[mergedFieldNames.disabled];
          rawTitle = option?.title;
        }

        return {
          label: rawLabel,
          value: rawValue,
          key: rawKey ?? '',
          disabled: rawDisabled,
          title: rawTitle,
          option,
        };
      });
    },
    [mergedFieldNames, valueOptions],
  );

  // =========================== Values ===========================
  const [internalValue, setInternalValue] = useMergedState(defaultValue, {
    value,
  });

  // Merged value with LabelValueType
  const rawLabeledValues = React.useMemo(() => {
    const values = convert2LabelValues(internalValue);

    // combobox no need save value when it's no value
    if (mergedMode === 'combobox' && !values[0]?.value) {
      return [];
    }

    return values;
  }, [internalValue, convert2LabelValues, mergedMode]);

  // Fill label with cache to avoid option remove
  const [mergedValues, getMixedOption] = useCache(rawLabeledValues, valueOptions);

  const displayValues = React.useMemo(() => {
    // `null` need show as placeholder instead
    if (!mergedMode && mergedValues.length === 1) {
      const firstValue = mergedValues[0];
      if (
        firstValue.value === null &&
        (firstValue.label === null || firstValue.label === undefined)
      ) {
        return [];
      }
    }

    return mergedValues.map((item) => {
      let label: React.ReactNode = item.label ?? item.value;
      const option = getMixedOption(item.value);
      if (displayRender && option) {
        label = displayRender(option);
      }
      return {
        ...item,
        label,
      };
    });
  }, [mergedMode, mergedValues, displayRender, getMixedOption]);

  /** Convert `displayValues` to raw value type set */
  const rawValues = React.useMemo(
    () => new Set(mergedValues.map((val) => val.value)),
    [mergedValues],
  );

  React.useEffect(() => {
    if (mergedMode === 'combobox') {
      const strValue = mergedValues[0]?.value;
      setSearchValue(hasValue(strValue) ? String(strValue) : '');
    }
  }, [mergedMode, mergedValues, setSearchValue]);

  // ======================= Display Option =======================
  // Create a placeholder item if not exist in `options`
  const createTagOption = useMemoizedFn((val: RawValueType, label?: React.ReactNode) => {
    const mergedLabel = label ?? val;

    warning(
      typeof mergedFieldNames.value === 'string' && typeof mergedFieldNames.label === 'string',
      'usage',
      '`fieldNames.value` and `fieldNames.label` must be a string in tag mode.',
    );

    return {
      [typeof mergedFieldNames.value === 'string' ? mergedFieldNames.value : 'value']: val,
      [typeof mergedFieldNames.label === 'string' ? mergedFieldNames.label : 'label']: mergedLabel,
    };
  });

  // Fill tag as option if mode is `tags`
  const filledTagOptions = React.useMemo(() => {
    if (mergedMode !== 'tags') {
      return mergedOptions;
    }

    // >>> Tag mode
    const cloneOptions = [...(mergedOptions ?? [])];

    // Check if value exist in options (include new patch item)
    const existOptions = (val: RawValueType) => valueOptions.has(val);

    // Fill current value as option
    [...mergedValues]
      .sort((a, b) => (a.value < b.value ? -1 : 1))
      .forEach((item) => {
        const val = item.value;

        if (!existOptions(val)) {
          cloneOptions.push(createTagOption(val, item.label));
        }
      });

    return cloneOptions;
  }, [createTagOption, mergedOptions, valueOptions, mergedValues, mergedMode]);

  const filteredOptions = useFilterOptions(
    filledTagOptions,
    mergedFieldNames,
    mergedSearchValue,
    mergedFilterOption,
    optionFilterProp,
    !!request,
  );

  // Fill options with search value if needed
  const filledSearchOptions = React.useMemo(() => {
    if (
      mergedMode !== 'tags' ||
      !mergedSearchValue ||
      filteredOptions.some((item) => item[optionFilterProp || 'label'] === mergedSearchValue)
    ) {
      return filteredOptions;
    }

    // Fill search value as option
    return [createTagOption(mergedSearchValue), ...filteredOptions];
  }, [createTagOption, optionFilterProp, mergedMode, filteredOptions, mergedSearchValue]);

  const orderedFilteredOptions = React.useMemo(() => {
    if (!filterSort || request) {
      return filledSearchOptions;
    }

    return [...filledSearchOptions].sort((a, b) => filterSort(a, b));
  }, [filledSearchOptions, filterSort]);

  const displayOptions = React.useMemo(
    () => flattenOptions(orderedFilteredOptions, mergedFieldNames),
    [orderedFilteredOptions, mergedFieldNames],
  );

  // =========================== Change ===========================
  const triggerChange = (values: DraftValueType) => {
    const labeledValues = convert2LabelValues(values);
    setInternalValue(labeledValues);

    if (
      onChange &&
      // Trigger event only when value changed
      (labeledValues.length !== mergedValues.length ||
        labeledValues.some((newVal, index) => mergedValues[index]?.value !== newVal?.value))
    ) {
      const returnOptions = labeledValues.map((v) => getMixedOption(v.value));
      const returnValues = optionInValue ? returnOptions : labeledValues.map((v) => v.value);

      onChange(
        // Value
        multiple ? returnValues : returnValues[0],
        // Option
        multiple ? returnOptions : returnOptions[0],
      );
    }
  };

  // ======================= Accessibility ========================
  const [activeValue, setActiveValue] = React.useState<string>();
  const [accessibilityIndex, setAccessibilityIndex] = React.useState(0);
  const mergedDefaultActiveFirstOption =
    defaultActiveFirstOption !== undefined ? defaultActiveFirstOption : mergedMode !== 'combobox';

  const onActiveValue: OnActiveValue = React.useCallback(
    (_, index) => {
      setAccessibilityIndex(index);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mergedMode],
  );

  // ========================= OptionList =========================
  const triggerSelect = (val: RawValueType, selected: boolean, type?: DisplayInfoType) => {
    const getSelectEnt = (): [RawValueType | OptionInValueType, BaseOptionType] => {
      const option = getMixedOption(val);
      return [optionInValue ? option : val, option];
    };

    if (selected && onSelect) {
      const [wrappedValue, option] = getSelectEnt();
      onSelect(wrappedValue, option);
    } else if (!selected && onDeselect && type !== 'clear') {
      const [wrappedValue, option] = getSelectEnt();
      onDeselect(wrappedValue, option);
    }
  };

  // Used for OptionList selection
  const onInternalSelect = useMemoizedFn<OnInternalSelect>((val, info) => {
    let cloneValues: (RawValueType | DisplayValueType)[];

    // Single mode always trigger select only with option list
    const mergedSelect = multiple ? info.selected : true;

    if (mergedSelect) {
      cloneValues = multiple ? [...mergedValues, val] : [val];
    } else {
      cloneValues = mergedValues.filter((v) => v.value !== val);
    }

    triggerChange(cloneValues);
    triggerSelect(val, mergedSelect);

    // Clean search value if single or configured
    if (mergedMode === 'combobox') {
      // setSearchValue(String(val));
      setActiveValue('');
    } else if (!isMultiple(mergedMode) || autoClearSearchValue) {
      setSearchValue('');
      setActiveValue('');
    }
  });

  // ======================= Display Change =======================
  // BaseSelect display values change
  const onDisplayValuesChange: BaseSelectProps['onDisplayValuesChange'] = (nextValues, info) => {
    triggerChange(nextValues);
    const { type, values } = info;

    if (type === 'remove' || type === 'clear') {
      values.forEach((item) => {
        triggerSelect(item.value!, false, type);
      });
    }
  };

  // =========================== Search ===========================
  const onInternalSearch: BaseSelectProps['onSearch'] = (searchText, info) => {
    setSearchValue(searchText);
    setActiveValue(undefined);

    // [Submit] Tag mode should flush input
    if (info.source === 'submit') {
      const formatted = (searchText || '').trim();
      // prevent empty tags from appearing when you click the Enter button
      if (formatted) {
        const newRawValues = Array.from(new Set<RawValueType>([...rawValues, formatted]));
        triggerChange(newRawValues);
        triggerSelect(formatted, true);
        setSearchValue('');
      }

      return;
    }

    if (info.source !== 'blur') {
      if (mergedMode === 'combobox') {
        triggerChange(searchText);
      }

      onSearch?.(searchText);
    }
  };

  const onInternalSearchSplit: BaseSelectProps['onSearchSplit'] = (words) => {
    let patchValues: RawValueType[] = words;

    if (mergedMode !== 'tags') {
      patchValues = words
        .map((word) => {
          const opt = labelOptions.get(word);
          return opt?.value;
        })
        .filter((val) => val !== undefined) as RawValueType[];
    }

    const newRawValues = Array.from(new Set<RawValueType>([...rawValues, ...patchValues]));
    triggerChange(newRawValues);
    newRawValues.forEach((newRawValue) => {
      triggerSelect(newRawValue, true);
    });
  };

  // ========================== Context ===========================
  const selectContext = React.useMemo((): SelectContextProps => {
    return {
      ...parsedOptions,
      optionRender,
      flattenOptions: displayOptions,
      onActiveValue,
      defaultActiveFirstOption: mergedDefaultActiveFirstOption,
      onSelect: onInternalSelect,
      menuItemSelectedIcon: itemIcon,
      rawValues,
      fieldNames: mergedFieldNames,
      virtual: mergedVirtual,
      listHeight,
      listItemHeight,
    };
  }, [
    mergedVirtual,
    parsedOptions,
    optionRender,
    displayOptions,
    onActiveValue,
    mergedDefaultActiveFirstOption,
    onInternalSelect,
    itemIcon,
    rawValues,
    mergedFieldNames,
    listHeight,
    listItemHeight,
  ]);

  // ========================== Warning ===========================
  if (process.env.NODE_ENV !== 'production') {
    warningProps(props);
    warningNullOptions(mergedOptions, mergedFieldNames);
  }

  // ====================== zIndex =========================
  const [zIndex] = useZIndex('SelectLike');

  // ==============================================================
  // ==                          Render                          ==
  // ==============================================================
  return (
    <SelectContext.Provider value={selectContext}>
      <BaseSelect
        {...restProps}
        // >>> MISC
        id={mergedId}
        prefixCls={prefixCls}
        ref={ref}
        omitDomProps={OMIT_DOM_PROPS}
        mode={mergedMode}
        builtinPlacements={mergedBuiltinPlacements}
        popupMatchSelectWidth={mergedPopupMatchSelectWidth}
        suffixIcon={suffixIcon}
        removeIcon={removeIcon}
        allowClear={mergedAllowClear}
        placement={memoPlacement}
        notFoundContent={mergedNotFound}
        getPopupContainer={getPopupContainer || getContextPopupContainer}
        className={className}
        transition={{
          leave: 'transition ease-in duration-100',
          leaveFrom: 'opacity-100',
          leaveTo: 'opacity-0',
        }}
        loading={mergedLoading}
        showSearch={showSearch}
        onPopupScroll={onInternalPopupScroll}
        // >>> Values
        displayValues={displayValues}
        onDisplayValuesChange={onDisplayValuesChange}
        // >>> Search
        searchValue={mergedSearchValue}
        onSearch={onInternalSearch}
        autoClearSearchValue={autoClearSearchValue}
        onSearchSplit={onInternalSearchSplit}
        // >>> OptionList
        OptionList={OptionList}
        emptyOptions={!displayOptions.length}
        // >>> Accessibility
        activeValue={activeValue}
        activeDescendantId={`${mergedId}_list_${accessibilityIndex}`}
        zIndex={zIndex}
        getInputElement={getInputElement}
      />
    </SelectContext.Provider>
  );
}) as unknown as (<
  OptionType extends BaseOptionType = BaseOptionType,
  ModeType extends 'multiple' | 'tags' | 'default' = 'default',
  OptionInValueType extends boolean = false,
  ShowSearchType extends boolean = false,
  PaginationType extends boolean = false,
>(
  props: SelectProps<OptionType, ModeType, OptionInValueType, ShowSearchType, PaginationType> & {
    ref?: React.Ref<BaseSelectRef>;
  },
) => React.ReactElement) & {
  displayName?: string;
};

if (process.env.NODE_ENV !== 'production') {
  Select.displayName = 'Select';
}

export default Select;
