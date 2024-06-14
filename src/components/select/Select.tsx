import useMergedState from 'rc-util/lib/hooks/useMergedState';
import * as React from 'react';
import { ComplexClassName, clsx, getComplexCls } from '../_util/classNameUtils';
import useMemoizedFn from '../_util/hooks/useMemoizedFn';
import { InputStatus, getMergedStatus, getStatusClassNames } from '../_util/statusUtils';
import warning from '../_util/warning';
import { ConfigContext } from '../config-provider';
import DisabledContext from '../config-provider/DisabledContext';
import { SizeType } from '../config-provider/SizeContext';
import DefaultRenderEmpty from '../config-provider/defaultRenderEmpty';
import useSize from '../config-provider/hooks/useSize';
import { FormItemInputContext } from '../form/context';
import { useCompactItemContext } from '../space/Compact';
import type {
  BaseSelectProps,
  BaseSelectPropsWithoutPrivate,
  BaseSelectRef,
  DisplayInfoType,
  DisplayValueType,
  RenderNode,
} from './BaseSelect';
import BaseSelect, { isMultiple } from './BaseSelect';
import OptGroup from './OptGroup';
import Option from './Option';
import OptionList from './OptionList';
import SelectContext, { SelectContextProps } from './SelectContext';
import useBuiltinPlacements from './hooks/useBuiltinPlacements';
import useCache from './hooks/useCache';
import useFilterOptions from './hooks/useFilterOptions';
import useId from './hooks/useId';
import useOptions from './hooks/useOptions';
import { hasValue, toArray } from './utils/commonUtil';
import getIcons from './utils/iconUtil';
import { fillFieldNames, flattenOptions, injectPropsWithOption } from './utils/valueUtil';
import warningProps, { warningNullOptions } from './utils/warningPropsUtil';

const OMIT_DOM_PROPS = ['inputValue'];

const SelectPlacements = ['bottomLeft', 'bottomRight', 'topLeft', 'topRight'] as const;

export type SelectCommonPlacement = (typeof SelectPlacements)[number];

export type OnActiveValue = (
  active: RawValueType | null,
  index: number,
  info?: { source?: 'keyboard' | 'mouse' },
) => void;

export type OnInternalSelect = (value: RawValueType, info: { selected: boolean }) => void;

export type RawValueType = string | number;
export interface LabelInValueType {
  label: React.ReactNode;
  value: RawValueType;
}

export type DraftValueType =
  | RawValueType
  | LabelInValueType
  | DisplayValueType
  | (RawValueType | LabelInValueType | DisplayValueType)[];

export type FilterFunc<OptionType> = (inputValue: string, option?: OptionType) => boolean;

export interface FieldNames {
  value?: string;
  label?: string;
  groupLabel?: string;
  options?: string;
}

export interface BaseOptionType {
  disabled?: boolean;
  [name: string]: any;
}

export interface DefaultOptionType extends BaseOptionType {
  label: React.ReactNode;
  value?: string | number | null;
  children?: Omit<DefaultOptionType, 'children'>[];
}

export type SelectHandler<ValueType, OptionType extends BaseOptionType = DefaultOptionType> = (
  value: ValueType,
  option: OptionType,
) => void;

type ArrayElementType<T> = T extends (infer E)[] ? E : T;

export interface SelectProps<ValueType = any, OptionType extends BaseOptionType = DefaultOptionType>
  extends Omit<
    BaseSelectPropsWithoutPrivate,
    'mode' | 'getInputElement' | 'getRawInputElement' | 'backfill' | 'placement' | 'className'
  > {
  prefixCls?: string;
  id?: string;
  className?: ComplexClassName<'popup' | 'selector'>;

  bordered?: boolean;
  disabled?: boolean;

  // >>> Size
  size?: SizeType;

  // >>> Field Names
  fieldNames?: FieldNames;

  // >>> Search
  searchValue?: string;
  onSearch?: (value: string) => void;
  autoClearSearchValue?: boolean;

  // >>> Select
  onSelect?: SelectHandler<ArrayElementType<ValueType>, OptionType>;
  onDeselect?: SelectHandler<ArrayElementType<ValueType>, OptionType>;

  // >>> Options
  /**
   * In Select, `false` means do nothing.
   * In TreeSelect, `false` will highlight match item.
   * It's by design.
   */
  filterOption?: boolean | FilterFunc<OptionType>;
  filterSort?: (optionA: OptionType, optionB: OptionType) => number;
  optionFilterProp?: string;
  optionLabelProp?: string;
  children?: React.ReactNode;
  options?: OptionType[];
  defaultActiveFirstOption?: boolean;
  virtual?: boolean;
  listHeight?: number;
  listItemHeight?: number;

  // >>> Icon
  menuItemSelectedIcon?: RenderNode;
  suffixIcon?: React.ReactNode;

  mode?: 'multiple' | 'tags';
  /** @private Internal usage. Do not use in your production. */
  combobox?: boolean;

  labelInValue?: boolean;
  value?: ValueType | null;
  defaultValue?: ValueType | null;
  onChange?: (value: ValueType, option: OptionType | OptionType[]) => void;

  placement?: SelectCommonPlacement;
  status?: InputStatus;
}

function isRawValue(value: DraftValueType): value is RawValueType {
  return !value || typeof value !== 'object';
}

const Select = React.forwardRef(
  (props: SelectProps<any, DefaultOptionType>, ref: React.Ref<BaseSelectRef>) => {
    const {
      id,
      mode,
      combobox,
      className,
      prefixCls: customizePrefixCls,
      fieldNames,
      bordered = true,

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
      children,
      defaultActiveFirstOption,
      virtual,
      listHeight = 256,
      listItemHeight = 24,

      // Value
      value,
      defaultValue,
      labelInValue,
      onChange,

      status: customStatus,
      notFoundContent,
      size: customizeSize,
      disabled: customDisabled,
      placement,
      builtinPlacements,
      getPopupContainer,

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
    const childrenAsData = !!(!options && children);
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

    // ===================== Empty =====================
    let mergedNotFound: React.ReactNode;
    if (notFoundContent !== undefined) {
      mergedNotFound = notFoundContent;
    } else if (mergedMode === 'combobox') {
      mergedNotFound = null;
    } else {
      mergedNotFound = renderEmpty?.('Select') || <DefaultRenderEmpty componentName="Select" />;
    }

    // ===================== Icons =====================
    const { suffixIcon, itemIcon, removeIcon, clearIcon } = getIcons({
      ...props,
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
      () => fillFieldNames(fieldNames, childrenAsData),
      /* eslint-disable react-hooks/exhaustive-deps */
      [
        // We stringify fieldNames to avoid unnecessary re-renders.
        JSON.stringify(fieldNames),
        childrenAsData,
      ],
      /* eslint-enable react-hooks/exhaustive-deps */
    );

    // =========================== Search ===========================
    const [mergedSearchValue, setSearchValue] = useMergedState('', {
      value: searchValue,
      postState: (search) => search || '',
    });

    // =========================== Option ===========================
    const parsedOptions = useOptions(
      options,
      children,
      mergedFieldNames,
      optionFilterProp,
      optionLabelProp,
    );
    const { valueOptions, labelOptions, options: mergedOptions } = parsedOptions;

    // ========================= Wrap Value =========================
    const convert2LabelValues = React.useCallback(
      (draftValues: DraftValueType) => {
        // Convert to array
        const valueList = toArray(draftValues);

        // Convert to labelInValue type
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
            rawLabel = val.label;
            rawValue = val.value!;
          }

          const option = valueOptions.get(rawValue);
          if (option) {
            // Fill missing props
            if (rawLabel === undefined)
              rawLabel = option?.[optionLabelProp || mergedFieldNames.label];
            rawKey = option?.key ?? rawValue;
            rawDisabled = option?.disabled;
            rawTitle = option?.title;

            // Warning if label not same as provided
            if (process.env.NODE_ENV !== 'production' && !optionLabelProp) {
              const optionLabel = option?.[mergedFieldNames.label];
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
    }, [mergedValues]);

    // ======================= Display Option =======================
    // Create a placeholder item if not exist in `options`
    const createTagOption = useMemoizedFn((val: RawValueType, label?: React.ReactNode) => {
      const mergedLabel = label ?? val;
      return {
        [mergedFieldNames.value]: val,
        [mergedFieldNames.label]: mergedLabel,
      } as DefaultOptionType;
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
      if (!filterSort) {
        return filledSearchOptions;
      }

      return [...filledSearchOptions].sort((a, b) => filterSort(a, b));
    }, [filledSearchOptions, filterSort]);

    const displayOptions = React.useMemo(
      () =>
        flattenOptions(orderedFilteredOptions, {
          fieldNames: mergedFieldNames,
          childrenAsData,
        }),
      [orderedFilteredOptions, mergedFieldNames, childrenAsData],
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
        const returnValues = labelInValue ? labeledValues : labeledValues.map((v) => v.value);
        const returnOptions = labeledValues.map((v) =>
          injectPropsWithOption(getMixedOption(v.value)),
        );

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
      [mergedMode],
    );

    // ========================= OptionList =========================
    const triggerSelect = (val: RawValueType, selected: boolean, type?: DisplayInfoType) => {
      const getSelectEnt = (): [RawValueType | LabelInValueType, DefaultOptionType] => {
        const option = getMixedOption(val);
        return [
          labelInValue
            ? {
                label: option?.[mergedFieldNames.label],
                value: val,
              }
            : val,
          injectPropsWithOption(option),
        ];
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
        childrenAsData,
      };
    }, [
      parsedOptions,
      displayOptions,
      onActiveValue,
      mergedDefaultActiveFirstOption,
      onInternalSelect,
      itemIcon,
      rawValues,
      mergedFieldNames,
      virtual,
      popupMatchSelectWidth,
      listHeight,
      listItemHeight,
      childrenAsData,
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

const TypedSelect = Select as unknown as (<
  ValueType = any,
  OptionType extends BaseOptionType | DefaultOptionType = DefaultOptionType,
>(
  props: React.PropsWithChildren<SelectProps<ValueType, OptionType>> & {
    ref?: React.Ref<BaseSelectRef>;
  },
) => React.ReactElement) & {
  Option: typeof Option;
  OptGroup: typeof OptGroup;
};

TypedSelect.Option = Option;
TypedSelect.OptGroup = OptGroup;

export default TypedSelect;
