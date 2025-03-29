import * as React from 'react';
import { clsx } from '@util/classNameUtils';
import ContextIsolator from '@util/ContextIsolator';
import useSemanticCls from '@util/hooks/useSemanticCls';
import { getStatusClassNames } from '@util/statusUtils';
import type { PartialWith } from '@util/type';
import { useEvent, useMergedState } from 'rc-util';
import useLayoutEffect from 'rc-util/es/hooks/useLayoutEffect';
import omit from 'rc-util/es/omit';
import pickAttrs from 'rc-util/es/pickAttrs';
import useToggleDates from '../hooks/useToggleDates';
import type {
  BaseInfo,
  DateValue,
  InternalMode,
  PanelMode,
  PickerRef,
  SelectorProps,
  SharedHTMLAttrs,
  SharedPickerProps,
  SharedTimeProps,
  ValueDate,
} from '../interface';
import PickerTrigger from '../PickerTrigger';
import { pickTriggerProps } from '../PickerTrigger/util';
import { getPlaceholder, toArray } from '../utils/miscUtil';
import PickerContext from './context';
import useCellRender from './hooks/useCellRender';
import useFieldsInvalidate from './hooks/useFieldsInvalidate';
import useFilledProps from './hooks/useFilledProps';
import useOpen from './hooks/useOpen';
import usePickerRef from './hooks/usePickerRef';
import useRangeActive from './hooks/useRangeActive';
import useRangePickerValue from './hooks/useRangePickerValue';
import useRangeValue, { useInnerValue } from './hooks/useRangeValue';
import useShowNow from './hooks/useShowNow';
import Popup from './Popup';
import SingleSelector from './Selector/SingleSelector';

export interface BasePickerProps<DateType extends object = any>
  extends PartialWith<SharedPickerProps<DateType>, 'prefixCls' | 'locale'> {
  // Structure
  id?: string;

  /** Not support `time` or `datetime` picker */
  multiple?: boolean;
  removeIcon?: React.ReactNode;
  /** Only work when `multiple` is in used */
  maxTagCount?: number | 'responsive';

  // Value
  value?: DateValue<DateType> | DateValue<DateType>[] | null;
  defaultValue?: DateValue<DateType> | DateValue<DateType>[] | null;
  onChange?: (dateString: string | string[], date: DateType | DateType[] | null) => void;
  onCalendarChange?: (
    dateString: string | string[],
    date: DateType | DateType[],
    info: BaseInfo,
  ) => void;
  /**  */
  onOk?: (value?: DateType | DateType[]) => void;

  // Placeholder
  placeholder?: string;

  // Picker Value
  /**
   * Config the popup panel date.
   * Every time active the input to open popup will reset with `defaultPickerValue`.
   *
   * Note: `defaultPickerValue` priority is higher than `value` for the first open.
   */
  defaultPickerValue?: DateType | null;
  /**
   * Config each start & end field popup panel date.
   * When config `pickerValue`, you must also provide `onPickerValueChange` to handle changes.
   */
  pickerValue?: DateType | null;
  /**
   * Each popup panel `pickerValue` change will trigger the callback.
   * @param date The changed picker value
   * @param info.source `panel` from the panel click. `reset` from popup open or field typing.
   */
  onPickerValueChange?: (
    date: DateType,
    info: {
      source: 'reset' | 'panel';
      mode: PanelMode;
    },
  ) => void;

  // Preset
  presets?: ValueDate<DateType>[];

  // Control
  disabled?: boolean;

  // Mode
  mode?: PanelMode;
  onPanelChange?: (values: DateType, modes: PanelMode) => void;
}

export interface InternalPickerProps<DateType extends object = any>
  extends BasePickerProps<DateType>,
    Omit<SharedTimeProps<DateType>, 'format' | 'defaultValue'> {}

/** Internal usage. For cross function get same aligned props */
export type ReplacedPickerProps<DateType extends object = any> = {
  onChange?: (dateString: string | string[] | null, date: DateType | DateType[] | null) => void;
  onCalendarChange?: (
    dateString: string | string[],
    date: DateType | DateType[],
    info: BaseInfo,
  ) => void;
};

function Picker<DateType extends object = any>(
  props: InternalPickerProps<DateType>,
  ref: React.Ref<PickerRef>,
) {
  // ========================= Prop =========================
  const [filledProps, internalPicker, complexPicker, formatList, maskFormat, isInvalidateDate] =
    useFilledProps(props);

  const {
    // Style
    prefixCls,
    className,
    popupZIndex,

    // Misc
    size,
    status,
    placeholder,

    // Compact
    isCompactItem,
    compactItemClassnames,

    // Variant
    variant,
    enableVariantCls,

    // Value
    order,
    defaultValue,
    value,
    needConfirm,
    onChange,
    onKeyDown,

    // Disabled
    disabled,
    disabledDate,
    minDate,
    maxDate,

    // Open
    defaultOpen,
    open,
    onOpenChange,

    // Picker
    locale,
    generateConfig,
    picker,
    showNow,
    showTime,

    // Mode
    mode,
    onPanelChange,
    onCalendarChange,
    onOk,
    multiple,

    // Picker Value
    defaultPickerValue,
    pickerValue,
    onPickerValueChange,

    // Format
    inputReadOnly,

    suffixIcon,
    removeIcon,

    // Focus
    onFocus,
    onBlur,

    // Presets
    presets,

    // Render
    components,
    cellRender,

    // Native
    onClick,
  } = filledProps as Omit<
    typeof filledProps,
    | keyof ReplacedPickerProps<DateType>
    | 'value'
    | 'defaultValue'
    | 'pickerValue'
    | 'defaultPickerValue'
  > &
    ReplacedPickerProps<DateType> & {
      value?: DateType[];
      defaultValue?: DateType[];
      pickerValue?: DateType[];
      defaultPickerValue?: DateType[];
    };

  // ========================= Refs =========================
  const selectorRef = usePickerRef(ref);

  // ========================= Util =========================
  function pickerParam<T>(values: null | T | T[]) {
    if (values === null) {
      return null;
    }

    return multiple ? values : (values as T[])[0];
  }

  const toggleDates = useToggleDates(generateConfig, locale, internalPicker);

  // ========================= Open =========================
  const [mergedOpen, triggerOpen] = useOpen(open, defaultOpen, [!!disabled], onOpenChange);

  // ======================= Calendar =======================
  const onInternalCalendarChange = (dateStrings: string[], dates: DateType[], info: BaseInfo) => {
    if (onCalendarChange) {
      const filteredInfo = {
        ...info,
      };
      delete filteredInfo.range;
      onCalendarChange(pickerParam(dateStrings)!, pickerParam(dates)!, filteredInfo);
    }
  };

  const onInternalOk = (dates: DateType[]) => {
    onOk?.(pickerParam(dates)!);
  };

  // ======================== Values ========================
  const [mergedValue, setInnerValue, getCalendarValue, triggerCalendarChange, triggerOk] =
    useInnerValue(
      generateConfig,
      locale,
      formatList,
      false,
      !!order,
      defaultValue,
      value,
      onInternalCalendarChange,
      onInternalOk,
    );

  const calendarValue = getCalendarValue();

  // ======================== Active ========================
  // In SinglePicker, we will always get `activeIndex` is 0.
  const [focused, triggerFocus, lastOperation, activeIndex] = useRangeActive([!!disabled]);

  const onSharedFocus = (event: React.FocusEvent<HTMLElement>) => {
    triggerFocus(true);

    onFocus?.(event, {});
  };

  const onSharedBlur = (event: React.FocusEvent<HTMLElement>) => {
    triggerFocus(false);

    onBlur?.(event, {});
  };

  // ========================= Mode =========================
  const [mergedMode, setMode] = useMergedState(picker, {
    value: mode,
  });

  /** Extends from `mergedMode` to patch `datetime` mode */
  const internalMode: InternalMode = mergedMode === 'date' && showTime ? 'datetime' : mergedMode;

  // ======================= Show Now =======================
  const mergedShowNow = useShowNow(picker, mergedMode, showNow);

  // ======================== Value =========================
  const onInternalChange: InternalPickerProps<DateType>['onChange'] = (dateStrings, dates) => {
    onChange?.(pickerParam(dateStrings), pickerParam(dates));
  };

  const [
    ,
    /** Trigger `onChange` directly without check `disabledDate` */
    triggerSubmitChange,
  ] = useRangeValue<DateType[], DateType>(
    {
      ...filledProps,
      onChange: onInternalChange,
    } as any,
    mergedValue,
    setInnerValue,
    getCalendarValue,
    triggerCalendarChange,
    [], //disabled,
    formatList,
    focused,
    mergedOpen,
    isInvalidateDate,
  );

  // ======================= Validate =======================
  const [submitInvalidates, onSelectorInvalid] = useFieldsInvalidate(
    calendarValue,
    isInvalidateDate,
  );

  const submitInvalidate = React.useMemo(
    () => submitInvalidates.some((invalidated) => invalidated),
    [submitInvalidates],
  );

  // ===================== Picker Value =====================
  // Proxy to single pickerValue
  const onInternalPickerValueChange = (
    dates: DateType[],
    info: BaseInfo & { source: 'reset' | 'panel'; mode: [PanelMode, PanelMode] },
  ) => {
    if (onPickerValueChange) {
      const cleanInfo = { ...info, mode: info.mode[0] };
      delete cleanInfo.range;
      onPickerValueChange(dates[0], cleanInfo);
    }
  };

  const [currentPickerValue, setCurrentPickerValue] = useRangePickerValue<DateType, DateType[]>(
    generateConfig,
    locale,
    calendarValue,
    [mergedMode],
    mergedOpen,
    activeIndex,
    internalPicker,
    false, // multiplePanel,
    defaultPickerValue,
    pickerValue,
    toArray(showTime?.defaultOpenValue as DateType[]),
    onInternalPickerValueChange,
    minDate,
    maxDate,
  );

  // >>> Mode need wait for `pickerValue`
  const triggerModeChange = useEvent(
    (nextPickerValue: DateType | null, nextMode: PanelMode, triggerEvent?: boolean) => {
      setMode(nextMode);

      // Compatible with `onPanelChange`
      if (onPanelChange && triggerEvent !== false) {
        const lastPickerValue: DateType =
          nextPickerValue || calendarValue[calendarValue.length - 1];
        onPanelChange(lastPickerValue, nextMode);
      }
    },
  );

  // ======================== Submit ========================
  /**
   * Different with RangePicker, confirm should check `multiple` logic.
   * This will never provide `date` instead.
   */
  const triggerConfirm = () => {
    triggerSubmitChange(getCalendarValue());

    triggerOpen(false, { force: true });
  };

  // ======================== Click =========================
  const onSelectorClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    if (!disabled && !selectorRef.current?.nativeElement.contains(document.activeElement)) {
      // Click to focus the enabled input
      selectorRef.current?.focus();
    }

    triggerOpen(true);

    onClick?.(event);
  };

  const onSelectorClear = () => {
    triggerSubmitChange(null);
    triggerOpen(false, { force: true });
  };

  // ======================== Hover =========================
  const [hoverSource, setHoverSource] = React.useState<'cell' | 'preset' | null>(null);
  const [internalHoverValue, setInternalHoverValue] = React.useState<DateType | null>(null);

  const hoverValues = React.useMemo(() => {
    const values = [internalHoverValue, ...calendarValue].filter((date) => date);

    return multiple ? values : values.slice(0, 1);
  }, [calendarValue, internalHoverValue, multiple]);

  // Selector values is different with RangePicker
  // which can not use `hoverValue` directly
  const selectorValues = React.useMemo(() => {
    if (!multiple && internalHoverValue) {
      return [internalHoverValue];
    }

    return calendarValue.filter((date) => date);
  }, [calendarValue, internalHoverValue, multiple]);

  // Clean up `internalHoverValues` when closed
  React.useEffect(() => {
    if (!mergedOpen) {
      setInternalHoverValue(null);
    }
  }, [mergedOpen]);

  // ========================================================
  // ==                       Panels                       ==
  // ========================================================

  const onPresetHover = (nextValue: DateType | null) => {
    setInternalHoverValue(nextValue);
    setHoverSource('preset');
  };

  const onPresetSubmit = (nextValue: DateType) => {
    const nextCalendarValues = multiple ? toggleDates(getCalendarValue(), nextValue) : [nextValue];
    const passed = triggerSubmitChange(nextCalendarValues);

    if (passed && !multiple) {
      triggerOpen(false, { force: true });
    }
  };

  const onNow = (now: DateType) => {
    onPresetSubmit(now);
  };

  // ======================== Panel =========================
  const onPanelHover = (date: DateType | null) => {
    setInternalHoverValue(date);
    setHoverSource('cell');
  };

  // >>> Focus
  const onPanelFocus: React.FocusEventHandler<HTMLElement> = (event) => {
    triggerOpen(true);
    onSharedFocus(event);
  };

  // >>> Calendar
  const onPanelSelect = (date: DateType) => {
    lastOperation('panel');

    const nextValues = multiple ? toggleDates(getCalendarValue(), date) : [date];

    // Only trigger calendar event but not update internal `calendarValue` state
    triggerCalendarChange(nextValues);

    // >>> Trigger next active if !needConfirm
    // Fully logic check `useRangeValue` hook
    if (!needConfirm && !complexPicker && internalPicker === internalMode) {
      triggerConfirm();
    }
  };

  // >>> Close
  const onPopupClose = () => {
    // Close popup
    triggerOpen(false);
  };

  // >>> cellRender
  const onInternalCellRender = useCellRender(cellRender);

  // ========================================================
  // ==                      Selector                      ==
  // ========================================================

  // ======================== Change ========================
  const onSelectorChange = (date: DateType[]) => {
    triggerCalendarChange(date);
  };

  const onSelectorInputChange = () => {
    lastOperation('input');
  };

  // ======================= Selector =======================
  const onSelectorFocus: SelectorProps['onFocus'] = (event) => {
    lastOperation('input');

    triggerOpen(true, {
      inherit: true,
    });

    // setActiveIndex(index);

    onSharedFocus(event);
  };

  const onSelectorBlur: SelectorProps['onBlur'] = (event) => {
    triggerOpen(false);

    onSharedBlur(event);
  };

  const onSelectorKeyDown: SelectorProps['onKeyDown'] = (event, preventDefault) => {
    if (event.key === 'Tab') {
      triggerConfirm();
    }

    onKeyDown?.(event, preventDefault);
  };

  // ======================= Context ========================
  const context = React.useMemo(
    () => ({
      prefixCls,
      locale,
      generateConfig,
      input: components.input,
    }),
    [prefixCls, locale, generateConfig, components.input],
  );

  // ======================== Effect ========================
  // >>> Mode
  // Reset for every active
  useLayoutEffect(() => {
    if (mergedOpen && activeIndex !== undefined) {
      // Legacy compatible. This effect update should not trigger `onPanelChange`
      triggerModeChange(null, picker, false);
    }
  }, [mergedOpen, activeIndex, picker]);

  // >>> For complex picker, we need check if need to focus next one
  useLayoutEffect(() => {
    const lastOp = lastOperation();

    // Trade as confirm on field leave
    if (!mergedOpen && lastOp === 'input') {
      triggerOpen(false);
      triggerConfirm();
    }

    // Submit with complex picker
    if (!mergedOpen && complexPicker && !needConfirm && lastOp === 'panel') {
      triggerOpen(true);
      triggerConfirm();
    }
  }, [mergedOpen]);

  // ======================== Style ========================
  const semanticCls = useSemanticCls(className, 'datePicker', { open: mergedOpen, disabled });

  const rootCls = clsx(
    {
      [`${prefixCls}-${size}`]: size,
      [`${prefixCls}-${variant}`]: enableVariantCls,
    },
    'group/selector',
    'relative inline-flex rounded-md bg-container text-sm leading-6 text-text shadow-sm ring-1 ring-inset ring-border',
    '[.input-addon_&]:-mx-3 [.input-addon_&]:bg-transparent [.input-addon_&]:shadow-none [.input-addon_&]:ring-0',
    {
      'rounded px-2 py-0.5': size === 'mini',
      'px-3 py-1': size === 'small',
      'px-3 py-1.5': size === 'middle',
      'px-3 py-2': size === 'large',
    },
    multiple && [
      'w-full cursor-text',
      {
        'min-h-7 py-0.5 pe-2 ps-1': size === 'mini',
        'min-h-8 py-0.5 pe-3 ps-1': size === 'small',
        'min-h-9 py-0.5 pe-3 ps-1': size === 'middle',
        'min-h-10 py-0.5 pe-3 ps-1': size === 'large',
      },
    ],
    {
      'bg-container ring-1': variant === 'outlined',
      'bg-transparent shadow-none ring-0': variant === 'borderless',
      'bg-fill-quinary ring-0': variant === 'filled',
    },
    compactItemClassnames,
    (focused || mergedOpen) && {
      'ring-2 ring-primary': variant === 'outlined',
      'ring-0': variant === 'borderless',
      'bg-container ring-2 ring-primary': variant === 'filled',
      'z-[2]': isCompactItem,
    },
    getStatusClassNames(status, variant, focused || mergedOpen),
    disabled && {
      'bg-fill-quaternary text-text-tertiary': true,
      'not-allowed bg-fill-quaternary text-text-tertiary ring-border': variant !== 'borderless',
    },
    semanticCls.root,
  );

  const selectorPlaceholderCls = clsx({
    'end-1 start-1': size === 'mini',
  });

  const selectorItemCls = clsx(
    {
      'pe-1 ps-2 leading-5': size === 'mini',
      'leading-6': size === 'small',
      'leading-8': size === 'large',
    },
    semanticCls.item,
  );

  const clearCls = clsx(
    {
      'end-2': size === 'mini',
    },
    semanticCls.clear,
  );

  // ======================== Render ========================
  const panelProps = React.useMemo(() => {
    const domProps = pickAttrs(filledProps, false);
    const restProps = omit(filledProps, [
      ...(Object.keys(domProps) as (keyof SharedHTMLAttrs)[]),
      'onChange',
      'onCalendarChange',
      'style',
      'className',
      'onPanelChange',
    ]);
    return {
      ...restProps,
      multiple: filledProps.multiple,
    };
  }, [filledProps, semanticCls]);

  // >>> Render
  const panel = (
    <Popup<any>
      // MISC
      {...panelProps}
      panelClassName={semanticCls.panel}
      presetsClassName={semanticCls.presets}
      footerClassName={semanticCls.footer}
      showNow={mergedShowNow}
      showTime={showTime}
      // Disabled
      disabledDate={disabledDate}
      // Focus
      onFocus={onPanelFocus}
      onBlur={onSharedBlur}
      // Mode
      picker={picker}
      mode={mergedMode}
      internalMode={internalMode}
      onPanelChange={triggerModeChange}
      // Value
      format={maskFormat}
      value={calendarValue}
      isInvalid={isInvalidateDate}
      onSelect={onPanelSelect}
      // PickerValue
      pickerValue={currentPickerValue}
      defaultOpenValue={showTime?.defaultOpenValue}
      onPickerValueChange={setCurrentPickerValue}
      // Hover
      hoverValue={hoverValues}
      onHover={onPanelHover}
      // Submit
      needConfirm={!!needConfirm}
      onSubmit={triggerConfirm}
      onOk={triggerOk}
      // Preset
      presets={presets}
      onPresetHover={onPresetHover}
      onPresetSubmit={onPresetSubmit}
      onNow={onNow}
      // Render
      cellRender={onInternalCellRender}
    />
  );

  return (
    <ContextIsolator space>
      <PickerContext.Provider value={context}>
        <PickerTrigger
          {...pickTriggerProps(filledProps)}
          popupElement={panel}
          popupClassName={semanticCls.popup}
          open={mergedOpen}
          onClose={onPopupClose}
          zIndex={popupZIndex}
        >
          <SingleSelector
            // Shared
            {...filledProps}
            placeholder={getPlaceholder(locale, picker, placeholder)}
            className={{
              root: rootCls,
              item: selectorItemCls,
              placeholder: selectorPlaceholderCls,
              clear: clearCls,
              input: semanticCls.input,
              suffix: semanticCls.suffix,
            }}
            // Ref
            ref={selectorRef}
            // Icon
            suffixIcon={suffixIcon}
            removeIcon={removeIcon}
            // Active
            activeHelp={!!internalHoverValue}
            allHelp={!!internalHoverValue && hoverSource === 'preset'}
            focused={focused}
            onFocus={onSelectorFocus}
            onBlur={onSelectorBlur}
            onKeyDown={onSelectorKeyDown}
            onSubmit={triggerConfirm}
            // Change
            value={selectorValues}
            maskFormat={maskFormat}
            onChange={onSelectorChange}
            onInputChange={onSelectorInputChange}
            internalPicker={internalPicker}
            // Format
            format={formatList}
            inputReadOnly={inputReadOnly}
            // Disabled
            disabled={!!disabled}
            // Open
            open={mergedOpen}
            onOpenChange={triggerOpen}
            // Click
            onClick={onSelectorClick}
            onClear={onSelectorClear}
            // Invalid
            invalid={submitInvalidate}
            onInvalid={(invalid) => {
              // Only `single` mode support type date.
              // `multiple` mode can not typing.
              onSelectorInvalid(invalid, 0);
            }}
          />
        </PickerTrigger>
      </PickerContext.Provider>
    </ContextIsolator>
  );
}

const RefPicker = React.forwardRef(Picker) as <DateType extends object = any>(
  props: InternalPickerProps<DateType> & React.RefAttributes<PickerRef>,
) => React.ReactElement;

export default RefPicker;
