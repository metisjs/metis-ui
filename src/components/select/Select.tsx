import useMergedState from 'rc-util/lib/hooks/useMergedState';
import * as React from 'react';
import { clsx, getComplexCls } from '../_util/classNameUtils';
import useMemoizedFn from '../_util/hooks/useMemoizedFn';
import { getMergedStatus, getStatusClassNames } from '../_util/statusUtils';
import warning from '../_util/warning';
import { ConfigContext } from '../config-provider';
import DisabledContext from '../config-provider/DisabledContext';
import DefaultRenderEmpty from '../config-provider/defaultRenderEmpty';
import useSize from '../config-provider/hooks/useSize';
import { FormItemInputContext } from '../form/context';
import { useCompactItemContext } from '../space/Compact';
import type {
  BaseSelectProps,
  BaseSelectRef,
  DisplayInfoType,
  DisplayValueType,
} from './BaseSelect';
import BaseSelect, { isMultiple } from './BaseSelect';
import OptionList from './OptionList';
import SelectContext, { SelectContextProps } from './SelectContext';
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
  SelectCommonPlacement,
  SelectProps,
  SelectPropsWithOptions,
} from './interface';
import { hasValue, toArray } from './utils/commonUtil';
import { fillFieldNames, flattenOptions, getFieldValue } from './utils/valueUtil';
import warningProps, { warningNullOptions } from './utils/warningPropsUtil';

const OMIT_DOM_PROPS = ['inputValue'];

export const SelectPlacements = ['bottomLeft', 'bottomRight', 'topLeft', 'topRight'] as const;

function isRawValue(value: DraftValueType): value is RawValueType {
  return !value || typeof value !== 'object';
}

const Select = React.forwardRef(
  (props: SelectProps<any, BaseOptionType, any[]>, ref: React.Ref<BaseSelectRef>) => {
    const {
      id,
      mode,
      combobox,
      className,
      prefixCls: customizePrefixCls,
      fieldNames,
      bordered = true,

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
      optionLabelProp,
      options,
      defaultActiveFirstOption,
      virtual,
      listHeight = 256,
      listItemHeight = 24,

      // Value
      value,
      defaultValue,
      optionInValue,
      onChange,

      status: customStatus,
      notFoundContent,
      size: customizeSize,
      disabled: customDisabled,
      placement,
      builtinPlacements,
      getPopupContainer,

      loading,
      showSearch,

      onPopupScroll,

      ...restProps
    } = props;

    const {
      getPopupContainer: getContextPopupContainer,
      getPrefixCls,
      renderEmpty,
      virtual: contextVirtual,
      popupMatchSelectWidth: contextPopupMatchSelectWidth,
      popupOverflow,
    } = React.useContext(ConfigContext);

    const complexCls = getComplexCls(className);
    const prefixCls = getPrefixCls('select', customizePrefixCls);
    const mergedId = useId(id);
    const multiple = isMultiple(mode);
    const mergedVirtual = virtual ?? contextVirtual;
    const mergedMode = combobox ? 'combobox' : mode;
    const mergedPopupMatchSelectWidth = popupMatchSelectWidth ?? contextPopupMatchSelectWidth;

    const { compactSize, compactItemClassnames } = useCompactItemContext(prefixCls);
    const mergedSize = useSize((ctx) => customizeSize ?? compactSize ?? ctx);

    // ===================== Disabled =====================
    const disabled = React.useContext(DisabledContext);
    const mergedDisabled = customDisabled ?? disabled;

    // ===================== Form Status =====================
    const {
      status: contextStatus,
      hasFeedback,
      isFormItemInput,
      feedbackIcon,
    } = React.useContext(FormItemInputContext);
    const mergedStatus = getMergedStatus(contextStatus, customStatus);

    // =========================== Search ===========================
    const [mergedSearchValue, setSearchValue] = useMergedState('', {
      value: searchValue,
      postState: (search) => search || '',
    });

    // ===================== Request =====================
    const {
      options: requestedOptions,
      loading: requestLoading,
      onScroll: onInternalPopupScroll,
      // loadingMore: requestLoadingMore,
    } = useRequest(
      request,
      showSearch,
      mergedSearchValue,
      optionFilterProp,
      pagination,
      onPopupScroll,
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

    // ========================= FieldNames =========================
    const mergedFieldNames = React.useMemo(
      () => fillFieldNames(fieldNames),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [JSON.stringify(fieldNames)],
    );

    // =========================== Option ===========================
    const parsedOptions = useOptions(
      request ? requestedOptions : options,
      mergedFieldNames,
      optionFilterProp,
      optionLabelProp,
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
          let rawKey: React.Key = '';
          let rawDisabled: boolean | undefined;
          let rawTitle: string = '';

          // Fill label & value
          if (isRawValue(val)) {
            rawValue = val;
          } else {
            rawLabel = getFieldValue(val, mergedFieldNames.label) ?? val.label;
            rawValue = getFieldValue(val, mergedFieldNames.value) ?? val.value;
          }

          const option = valueOptions.get(rawValue);
          if (option) {
            // Fill missing props
            if (rawLabel === undefined)
              rawLabel = optionLabelProp
                ? option[optionLabelProp]
                : getFieldValue(option, mergedFieldNames.label);
            rawKey = option?.key ?? rawValue;
            rawDisabled = getFieldValue(option, mergedFieldNames.disabled);
            rawTitle = option?.title;

            // Warning if label not same as provided
            if (process.env.NODE_ENV !== 'production' && !optionLabelProp) {
              const optionLabel = getFieldValue(option, mergedFieldNames.label);
              if (
                optionLabel !== undefined &&
                !React.isValidElement(optionLabel) &&
                !React.isValidElement(rawLabel) &&
                optionLabel !== rawLabel
              ) {
                warning(false, '`label` of `value` is not same as `label` in Select options.');
              }
            }
          }

          return {
            label: rawLabel,
            value: rawValue,
            key: rawKey,
            disabled: rawDisabled,
            title: rawTitle,
            option,
          };
        });
      },
      [mergedFieldNames, optionLabelProp, valueOptions],
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

      return mergedValues.map((item) => ({
        ...item,
        label: item.label ?? item.value,
      }));
    }, [mergedMode, mergedValues]);

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
        '`fieldNames.value` and `fieldNames.label` must be a string in tag mode.',
      );

      return {
        [typeof mergedFieldNames.value === 'string' ? mergedFieldNames.value : 'value']: val,
        [typeof mergedFieldNames.label === 'string' ? mergedFieldNames.label : 'label']:
          mergedLabel,
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
        filteredOptions.some((item) => item[optionFilterProp || 'value'] === mergedSearchValue)
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

    // ========================== Style ===========================
    const rootClassName = clsx(
      'group/select relative cursor-pointer',
      {
        [`${prefixCls}-lg text-base`]: mergedSize === 'large',
        [`${prefixCls}-sm`]: mergedSize === 'small',
        [`${prefixCls}-borderless`]: !bordered,
        [`${prefixCls}-in-form-item`]: isFormItemInput,
      },
      compactItemClassnames[0],
      complexCls.root,
    );

    const selectorClassName = clsx(
      {
        'px-2 after:leading-6': mergedSize === 'small',
        'after:leading-8': mergedSize === 'large',
        'shadow-none ring-0': !bordered,
        'bg-neutral-bg-container': !bordered && mergedDisabled,
      },
      getStatusClassNames(mergedStatus, hasFeedback),
      compactItemClassnames[1],
      complexCls.selector,
    );

    const selectorSearchClassName = clsx({
      'end-2 start-2': mergedSize === 'small' && !multiple,
      'ms-0.5 h-7': mergedSize === 'small' && multiple,
    });

    const selectorPlaceholderClassName = clsx({
      'end-2 start-2': mergedSize === 'small' && multiple,
    });

    const selectorItemClassName = clsx({
      'text-base/7': mergedSize === 'large',
      'text-sm/5': mergedSize === 'small',
      'leading-8': mergedSize === 'large' && multiple,
      'pe-1 ps-2 leading-6': mergedSize === 'small' && multiple,
    });

    const popupClassName = clsx(
      'absolute z-[1050] rounded-md bg-neutral-bg-elevated py-1 text-sm shadow-lg ring-1 ring-neutral-border-secondary focus:outline-none',
      complexCls.popup,
    );

    // ========================== Context ===========================
    const selectContext = React.useMemo((): SelectContextProps => {
      const realVirtual = mergedVirtual !== false && popupMatchSelectWidth !== false;
      return {
        ...parsedOptions,
        flattenOptions: displayOptions,
        onActiveValue,
        defaultActiveFirstOption: mergedDefaultActiveFirstOption,
        onSelect: onInternalSelect,
        menuItemSelectedIcon: itemIcon,
        rawValues,
        fieldNames: mergedFieldNames,
        virtual: realVirtual,
        listHeight,
        listItemHeight,
      };
    }, [
      mergedVirtual,
      parsedOptions,
      displayOptions,
      onActiveValue,
      mergedDefaultActiveFirstOption,
      onInternalSelect,
      itemIcon,
      rawValues,
      mergedFieldNames,
      popupMatchSelectWidth,
      listHeight,
      listItemHeight,
    ]);

    // ========================== Warning ===========================
    if (process.env.NODE_ENV !== 'production') {
      warningProps(props);
      warningNullOptions(mergedOptions, mergedFieldNames);
    }

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
          disabled={mergedDisabled}
          builtinPlacements={mergedBuiltinPlacements}
          popupMatchSelectWidth={mergedPopupMatchSelectWidth}
          suffixIcon={suffixIcon}
          removeIcon={removeIcon}
          clearIcon={clearIcon}
          placement={memoPlacement}
          notFoundContent={mergedNotFound}
          getPopupContainer={getPopupContainer || getContextPopupContainer}
          className={{
            root: rootClassName,
            popup: popupClassName,
            selector: selectorClassName,
            selectorSearch: selectorSearchClassName,
            selectorItem: selectorItemClassName,
            selectorPlaceholder: selectorPlaceholderClassName,
          }}
          transition={{
            leave: 'transition ease-in duration-150',
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
        />
      </SelectContext.Provider>
    );
  },
);

if (process.env.NODE_ENV !== 'production') {
  Select.displayName = 'Select';
}

const TypedSelect = Select as unknown as <
  ValueType = any,
  OptionType extends BaseOptionType = BaseOptionType,
>(
  props: SelectPropsWithOptions<ValueType, OptionType> & {
    ref?: React.Ref<BaseSelectRef>;
  },
) => React.ReactElement;

export default TypedSelect;
