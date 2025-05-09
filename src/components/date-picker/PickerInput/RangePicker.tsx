import * as React from 'react';
import { useEvent, useMergedState } from '@rc-component/util';
import useLayoutEffect from '@rc-component/util/es/hooks/useLayoutEffect';
import omit from '@rc-component/util/es/omit';
import pickAttrs from '@rc-component/util/es/pickAttrs';
import type { SemanticClassName } from '@util/classNameUtils';
import { clsx } from '@util/classNameUtils';
import ContextIsolator from '@util/ContextIsolator';
import useSemanticCls from '@util/hooks/useSemanticCls';
import { getStatusClassNames } from '@util/statusUtils';
import type { PartialWith } from '@util/type';
import { devUseWarning } from '@util/warning';
import type {
  BaseInfo,
  DateValue,
  DisabledDate,
  InternalMode,
  OnOpenChange,
  OpenConfig,
  PanelMode,
  PickerMode,
  RangePickerRef,
  RangeTimeProps,
  SelectorProps,
  SharedHTMLAttrs,
  SharedPanelProps,
  SharedPickerProps,
  ValueDate,
} from '../interface';
import type { PickerPanelProps } from '../PickerPanel';
import PickerTrigger from '../PickerTrigger';
import { pickTriggerProps } from '../PickerTrigger/util';
import { fillIndex, getFromDate, getRangePlaceholder, toArray } from '../utils/miscUtil';
import PickerContext from './context';
import useCellRender from './hooks/useCellRender';
import useFieldsInvalidate from './hooks/useFieldsInvalidate';
import useFilledProps from './hooks/useFilledProps';
import useOpen from './hooks/useOpen';
import usePickerRef from './hooks/usePickerRef';
import useRangeActive from './hooks/useRangeActive';
import useRangeDisabledDate from './hooks/useRangeDisabledDate';
import useRangePickerValue from './hooks/useRangePickerValue';
import useRangeValue, { useInnerValue } from './hooks/useRangeValue';
import useShowNow from './hooks/useShowNow';
import type { PopupShowTimeConfig } from './Popup';
import Popup from './Popup';
import type { PresetPanelClassName } from './Popup/PresetPanel';
import RangeSelector, { type SelectorIdType } from './Selector/RangeSelector';

function separateConfig<T>(config: T | [T, T] | null | undefined, defaultConfig: T): [T, T] {
  const singleConfig = config ?? defaultConfig;

  if (Array.isArray(singleConfig)) {
    return singleConfig;
  }

  return [singleConfig, singleConfig];
}

export type RangeValueType<DateType> = [
  start: DateType | null | undefined,
  end: DateType | null | undefined,
];

/** Used for change event, it should always be not undefined */
export type NoUndefinedRangeValueType<DateType> = [start: DateType | null, end: DateType | null];

export interface BaseRangePickerProps<DateType extends object>
  extends PartialWith<
    Omit<SharedPickerProps<DateType>, 'id' | 'showTime' | 'className'>,
    'prefixCls' | 'locale'
  > {
  className?: SemanticClassName<
    {
      popup?: string;
      input?: string;
      suffix?: string;
      clear?: string;
      item?: string;
      presets?: PresetPanelClassName;
      panel?: SharedPanelProps<any>['className'];
      footer?: string;
    },
    { open?: boolean; disabled: [boolean, boolean] }
  >;

  // Structure
  id?: SelectorIdType;

  separator?: React.ReactNode;

  // Value
  value?: RangeValueType<DateValue<DateType>> | null;
  defaultValue?: RangeValueType<DateValue<DateType>>;
  onChange?: (
    dateStrings: [string, string],
    dates: NoUndefinedRangeValueType<DateType> | null,
  ) => void;
  onCalendarChange?: (
    dateStrings: [string, string],
    dates: NoUndefinedRangeValueType<DateType>,
    info: BaseInfo,
  ) => void;
  onOk?: (values: NoUndefinedRangeValueType<DateType>) => void;

  // Placeholder
  placeholder?: [string, string];

  // Picker Value
  /**
   * Config the popup panel date.
   * Every time active the input to open popup will reset with `defaultPickerValue`.
   *
   * Note: `defaultPickerValue` priority is higher than `value` for the first open.
   */
  defaultPickerValue?: [DateType, DateType] | DateType | null;
  /**
   * Config each start & end field popup panel date.
   * When config `pickerValue`, you must also provide `onPickerValueChange` to handle changes.
   */
  pickerValue?: [DateType, DateType] | DateType | null;
  /**
   * Each popup panel `pickerValue` includes `mode` change will trigger the callback.
   * @param date The changed picker value
   * @param info.source `panel` from the panel click. `reset` from popup open or field typing
   * @param info.mode Next `mode` panel
   */
  onPickerValueChange?: (
    date: RangeValueType<DateType>,
    info: BaseInfo & {
      source: 'reset' | 'panel';
      mode: [PanelMode, PanelMode];
    },
  ) => void;

  // Preset
  presets?: ValueDate<Exclude<RangeValueType<DateType>, null>>[];

  // Control
  disabled?: boolean | [boolean, boolean];
  allowEmpty?: boolean | [boolean, boolean];

  // Time
  showTime?: boolean | RangeTimeProps<DateType>;

  // Mode
  mode?: [startMode: PanelMode, endMode: PanelMode];
  /** Trigger on each `mode` or `pickerValue` changed. */
  onPanelChange?: (
    values: NoUndefinedRangeValueType<DateType>,
    modes: [startMode: PanelMode, endMode: PanelMode],
  ) => void;
}

export interface InternalRangePickerProps<DateType extends object>
  extends BaseRangePickerProps<DateType>,
    Omit<RangeTimeProps<DateType>, 'format' | 'defaultValue' | 'defaultOpenValue'> {}

function getActiveRange(activeIndex: number) {
  return activeIndex === 1 ? 'end' : 'start';
}

function RangePicker<DateType extends object = any>(
  props: InternalRangePickerProps<DateType>,
  ref: React.Ref<RangePickerRef>,
) {
  // ========================= Prop =========================
  const [filledProps, internalPicker, complexPicker, formatList, maskFormat, isInvalidateDate] =
    useFilledProps(props, ({ disabled }) => {
      const { allowEmpty } = props;

      const mergedDisabled = separateConfig(disabled, false);
      const mergedAllowEmpty = separateConfig(allowEmpty, false);

      return {
        disabled: mergedDisabled,
        allowEmpty: mergedAllowEmpty,
      };
    });

  const {
    // Style
    prefixCls,
    placement,
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
    defaultValue,
    value,
    needConfirm,
    onKeyDown,

    // Disabled
    disabled,
    allowEmpty,
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

    // Picker Value
    defaultPickerValue,
    pickerValue,
    onPickerValueChange,

    // Format
    inputReadOnly,

    suffixIcon,

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
    'allowEmpty' | 'disabled' | 'showTime' | 'value' | 'defaultValue'
  > & {
    disabled: [boolean, boolean];
    allowEmpty: [boolean, boolean];
    picker: PickerMode;
    showTime?: RangeTimeProps<DateType>;
    value?: RangeValueType<DateType>;
    defaultValue?: RangeValueType<DateType>;
    pickerValue?: RangeValueType<DateType>;
    defaultPickerValue?: RangeValueType<DateType>;
    disabledDate: DisabledDate<DateType>;
  };

  // ========================= Refs =========================
  const selectorRef = usePickerRef(ref);

  // ========================= Open =========================
  const [mergedOpen, setMergeOpen] = useOpen(open, defaultOpen, disabled, onOpenChange);

  const triggerOpen: OnOpenChange = (nextOpen, config?: OpenConfig) => {
    // No need to open if all disabled
    if (disabled.some((fieldDisabled) => !fieldDisabled) || !nextOpen) {
      setMergeOpen(nextOpen, config);
    }
  };

  // ======================== Values ========================
  const [mergedValue, setInnerValue, getCalendarValue, triggerCalendarChange, triggerOk] =
    useInnerValue(
      generateConfig,
      locale,
      formatList,
      true,
      false,
      defaultValue,
      value,
      onCalendarChange,
      onOk,
    );

  const calendarValue = getCalendarValue();

  // ======================== Active ========================
  const [
    focused,
    triggerFocus,
    lastOperation,
    activeIndex,
    setActiveIndex,
    nextActiveIndex,
    activeIndexList,
  ] = useRangeActive(disabled, allowEmpty, mergedOpen);

  const onSharedFocus = (event: React.FocusEvent<HTMLElement>, index?: number) => {
    triggerFocus(true);

    onFocus?.(event, {
      range: getActiveRange(index ?? activeIndex),
    });
  };

  const onSharedBlur = (event: React.FocusEvent<HTMLElement>, index?: number) => {
    triggerFocus(false);

    onBlur?.(event, {
      range: getActiveRange(index ?? activeIndex),
    });
  };

  // ======================= ShowTime =======================
  /** Used for Popup panel */
  const mergedShowTime = React.useMemo<
    (PopupShowTimeConfig<DateType> & Pick<RangeTimeProps<DateType>, 'defaultOpenValue'>) | undefined
  >(() => {
    if (!showTime) {
      return undefined;
    }

    const { disabledTime } = showTime;

    const proxyDisabledTime = disabledTime
      ? (date: DateType) => {
          const range = getActiveRange(activeIndex);
          const fromDate = getFromDate(calendarValue, activeIndexList, activeIndex) ?? undefined;
          return disabledTime(date, range, {
            from: fromDate,
          });
        }
      : undefined;

    return { ...showTime, disabledTime: proxyDisabledTime };
  }, [showTime, activeIndex, calendarValue, activeIndexList]);

  // ========================= Mode =========================
  const [modes, setModes] = useMergedState<[PanelMode, PanelMode]>([picker, picker], {
    value: mode,
  });

  const mergedMode = modes[activeIndex] || picker;

  /** Extends from `mergedMode` to patch `datetime` mode */
  const internalMode: InternalMode =
    mergedMode === 'date' && mergedShowTime ? 'datetime' : mergedMode;

  // ====================== PanelCount ======================
  const multiplePanel = internalMode === picker && internalMode !== 'time';

  // ======================= Show Now =======================
  const mergedShowNow = useShowNow(picker, mergedMode, showNow, true);

  // ======================== Value =========================
  const [
    /** Trigger `onChange` by check `disabledDate` */
    flushSubmit,
    /** Trigger `onChange` directly without check `disabledDate` */
    triggerSubmitChange,
  ] = useRangeValue<RangeValueType<DateType>, DateType>(
    filledProps as any,
    mergedValue,
    setInnerValue,
    getCalendarValue,
    triggerCalendarChange,
    disabled,
    formatList,
    focused,
    mergedOpen,
    isInvalidateDate,
  );

  // ===================== DisabledDate =====================
  const mergedDisabledDate = useRangeDisabledDate(
    calendarValue,
    disabled,
    activeIndexList,
    generateConfig,
    locale,
    disabledDate,
  );

  // ======================= Validate =======================
  const [submitInvalidates, onSelectorInvalid] = useFieldsInvalidate(
    calendarValue,
    isInvalidateDate,
    allowEmpty,
  );

  // ===================== Picker Value =====================
  const [currentPickerValue, setCurrentPickerValue] = useRangePickerValue(
    generateConfig,
    locale,
    calendarValue,
    modes,
    mergedOpen,
    activeIndex,
    internalPicker,
    multiplePanel,
    defaultPickerValue,
    pickerValue,
    mergedShowTime?.defaultOpenValue as RangeValueType<DateType>,
    onPickerValueChange,
    minDate,
    maxDate,
  );

  // >>> Mode need wait for `pickerValue`
  const triggerModeChange = useEvent(
    (nextPickerValue: DateType | null, nextMode: PanelMode, triggerEvent?: boolean) => {
      const clone = fillIndex(modes, activeIndex, nextMode);

      if (clone[0] !== modes[0] || clone[1] !== modes[1]) {
        setModes(clone);
      }

      // Compatible with `onPanelChange`
      if (onPanelChange && triggerEvent !== false) {
        const clonePickerValue: RangeValueType<DateType> = [...calendarValue];
        if (nextPickerValue) {
          clonePickerValue[activeIndex] = nextPickerValue;
        }
        onPanelChange(clonePickerValue as NoUndefinedRangeValueType<DateType>, clone);
      }
    },
  );

  // ======================== Change ========================
  const fillCalendarValue = (date: DateType, index: number) =>
    // Trigger change only when date changed
    fillIndex(calendarValue, index, date);

  // ======================== Submit ========================
  /**
   * Trigger by confirm operation.
   * This function has already handle the `needConfirm` check logic.
   * - Selector: enter key
   * - Panel: OK button
   */
  const triggerPartConfirm = (date?: DateType | null, skipFocus?: boolean) => {
    let nextValue = calendarValue;

    if (date) {
      nextValue = fillCalendarValue(date, activeIndex);
    }

    // Get next focus index
    const nextIndex = nextActiveIndex(nextValue);

    // Change calendar value and tell flush it
    triggerCalendarChange(nextValue);
    flushSubmit(activeIndex, nextIndex === null);

    if (nextIndex === null) {
      triggerOpen(false, { force: true });
    } else if (!skipFocus) {
      selectorRef.current?.focus({ index: nextIndex });
    }
  };

  // ======================== Click =========================
  const onSelectorClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    const rootNode = (event.target as HTMLElement).getRootNode();
    if (
      !selectorRef.current?.nativeElement.contains(
        (rootNode as Document | ShadowRoot).activeElement ?? document.activeElement,
      )
    ) {
      // Click to focus the enabled input
      const enabledIndex = disabled.findIndex((d) => !d);
      if (enabledIndex >= 0) {
        selectorRef.current?.focus({ index: enabledIndex });
      }
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
  const [internalHoverValues, setInternalHoverValues] =
    React.useState<RangeValueType<DateType> | null>(null);

  const hoverValues = React.useMemo(() => {
    return internalHoverValues || calendarValue;
  }, [calendarValue, internalHoverValues]);

  // Clean up `internalHoverValues` when closed
  React.useEffect(() => {
    if (!mergedOpen) {
      setInternalHoverValues(null);
    }
  }, [mergedOpen]);

  // ========================================================
  // ==                       Panels                       ==
  // ========================================================
  // Save the offset with active bar position
  const [activeOffset, setActiveOffset] = React.useState(0);

  const onPresetHover = (nextValues: RangeValueType<DateType> | null) => {
    setInternalHoverValues(nextValues);
    setHoverSource('preset');
  };

  const onPresetSubmit = (nextValues: RangeValueType<DateType>) => {
    const passed = triggerSubmitChange(nextValues);

    if (passed) {
      triggerOpen(false, { force: true });
    }
  };

  const onNow = (now: DateType) => {
    triggerPartConfirm(now);
  };

  // ======================== Panel =========================
  const onPanelHover = (date: DateType) => {
    setInternalHoverValues(date ? fillCalendarValue(date, activeIndex) : null);
    setHoverSource('cell');
  };

  // >>> Focus
  const onPanelFocus: React.FocusEventHandler<HTMLElement> = (event) => {
    triggerOpen(true);
    onSharedFocus(event);
  };

  // >>> MouseDown
  const onPanelMouseDown: React.MouseEventHandler<HTMLDivElement> = () => {
    lastOperation('panel');
  };

  // >>> Calendar
  const onPanelSelect: PickerPanelProps<DateType>['onChange'] = (date: DateType) => {
    const clone: RangeValueType<DateType> = fillIndex(calendarValue, activeIndex, date);

    // Only trigger calendar event but not update internal `calendarValue` state
    triggerCalendarChange(clone);

    // >>> Trigger next active if !needConfirm
    // Fully logic check `useRangeValue` hook
    if (!needConfirm && !complexPicker && internalPicker === internalMode) {
      triggerPartConfirm(date);
    }
  };

  // >>> Close
  const onPopupClose = () => {
    // Close popup
    triggerOpen(false);
  };

  // >>> cellRender
  const onInternalCellRender = useCellRender(cellRender, getActiveRange(activeIndex));

  // >>> Value
  const panelValue = calendarValue[activeIndex] || null;

  // >>> invalid
  const isPopupInvalidateDate = useEvent((date: DateType) => {
    return isInvalidateDate(date, {
      activeIndex,
    });
  });

  // ========================================================
  // ==                      Selector                      ==
  // ========================================================

  // ======================== Change ========================
  const onSelectorChange = (date: DateType, index: number) => {
    const clone = fillCalendarValue(date, index);

    triggerCalendarChange(clone);
  };

  const onSelectorInputChange = () => {
    lastOperation('input');
  };

  // ======================= Selector =======================
  const onSelectorFocus: SelectorProps['onFocus'] = (event, index) => {
    lastOperation('input');

    triggerOpen(true, {
      inherit: true,
    });

    // When click input to switch the field, it will not trigger close.
    // Which means it will lose the part confirm and we need fill back.
    if (activeIndex !== index && mergedOpen && !needConfirm && complexPicker) {
      triggerPartConfirm(null, true);
    }

    setActiveIndex(index!);

    onSharedFocus(event, index);
  };

  const onSelectorBlur: SelectorProps['onBlur'] = (event, index) => {
    triggerOpen(false);
    if (!needConfirm && lastOperation() === 'input') {
      const nextIndex = nextActiveIndex(calendarValue);
      flushSubmit(activeIndex, nextIndex === null);
    }

    onSharedBlur(event, index);
  };

  const onSelectorKeyDown: SelectorProps['onKeyDown'] = (event, preventDefault) => {
    if (event.key === 'Tab') {
      triggerPartConfirm(null, true);
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
    [prefixCls, generateConfig, components.input],
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
      triggerPartConfirm(null, true);
    }

    // Submit with complex picker
    if (!mergedOpen && complexPicker && !needConfirm && lastOp === 'panel') {
      triggerOpen(true);
      triggerPartConfirm();
    }
  }, [mergedOpen]);

  // ====================== DevWarning ======================
  if (process.env.NODE_ENV !== 'production') {
    const warning = devUseWarning('DatePicker.RangePicker');
    const isIndexEmpty = (index: number) => {
      return (
        // Value is empty
        !value?.[index] &&
        // DefaultValue is empty
        !defaultValue?.[index]
      );
    };

    if (
      disabled.some(
        (fieldDisabled, index) => fieldDisabled && isIndexEmpty(index) && !allowEmpty[index],
      )
    ) {
      warning(
        false,
        'usage',
        '`disabled` should not set with empty `value`. You should set `allowEmpty` or `value` instead.',
      );
    }
  }

  // ======================== Style ========================
  const semanticCls = useSemanticCls(className, 'datePicker', { open: mergedOpen, disabled });

  const rootCls = clsx(
    {
      [`${prefixCls}-${size}`]: size,
      [`${prefixCls}-${variant}`]: enableVariantCls,
    },
    'group/selector',
    'bg-container text-text outline-border relative inline-flex rounded-md px-3 py-1.5 text-sm leading-6 shadow-xs outline -outline-offset-1',
    'in-[.input-addon]:-mx-3 in-[.input-addon]:bg-transparent in-[.input-addon]:shadow-none in-[.input-addon]:outline-0',
    {
      'rounded-sm px-2 py-0.5': size === 'mini',
      'px-3 py-1': size === 'small',
      'px-3 py-2': size === 'large',
    },
    {
      'bg-container outline': variant === 'outlined',
      'bg-transparent shadow-none outline-0': variant === 'borderless',
      'bg-fill-quinary outline-0': variant === 'filled',
    },
    compactItemClassnames,
    (focused || mergedOpen) && {
      'outline-primary outline-2 -outline-offset-2': variant === 'outlined',
      'outline-0': variant === 'borderless',
      'bg-container outline-primary outline-2 -outline-offset-2': variant === 'filled',
      'z-2': isCompactItem,
    },
    getStatusClassNames(status, variant, focused || mergedOpen),
    disabled.every((i) => i) && {
      'bg-fill-quaternary text-text-tertiary': true,
      'not-allowed bg-fill-quaternary text-text-tertiary outline-border': variant !== 'borderless',
    },
    semanticCls.root,
  );

  const activeBarCls = clsx({
    'bg-warning': status === 'warning',
    'bg-error': status === 'error',
  });

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
      'disabledTime',
    ]);
    return restProps;
  }, [filledProps]);

  const panel = (
    <Popup<any>
      // MISC
      {...panelProps}
      panelClassName={semanticCls.panel}
      presetsClassName={semanticCls.presets}
      footerClassName={semanticCls.footer}
      showNow={mergedShowNow}
      showTime={mergedShowTime}
      // Range
      range
      multiplePanel={multiplePanel}
      activeOffset={activeOffset}
      placement={placement}
      // Disabled
      disabledDate={mergedDisabledDate}
      // Focus
      onFocus={onPanelFocus}
      onBlur={onSharedBlur}
      onPanelMouseDown={onPanelMouseDown}
      // Mode
      picker={picker}
      mode={mergedMode}
      internalMode={internalMode}
      onPanelChange={triggerModeChange}
      // Value
      format={maskFormat}
      value={panelValue}
      isInvalid={isPopupInvalidateDate}
      onSelect={onPanelSelect}
      // PickerValue
      pickerValue={currentPickerValue}
      defaultOpenValue={toArray(showTime?.defaultOpenValue)[activeIndex]}
      onPickerValueChange={setCurrentPickerValue}
      // Hover
      hoverValue={hoverValues}
      onHover={onPanelHover}
      // Submit
      needConfirm={!!needConfirm}
      onSubmit={triggerPartConfirm}
      onOk={triggerOk}
      // Preset
      presets={presets}
      onPresetHover={onPresetHover}
      onPresetSubmit={onPresetSubmit}
      // Now
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
          // Range
          range
          zIndex={popupZIndex}
        >
          <RangeSelector
            // Shared
            {...filledProps}
            placeholder={getRangePlaceholder(locale, picker, placeholder)}
            className={{ root: rootCls, activeBar: activeBarCls }}
            // Ref
            ref={selectorRef}
            // Icon
            suffixIcon={suffixIcon}
            // Active
            activeIndex={focused || mergedOpen ? activeIndex : -1}
            activeHelp={!!internalHoverValues}
            allHelp={!!internalHoverValues && hoverSource === 'preset'}
            focused={focused}
            onFocus={onSelectorFocus}
            onBlur={onSelectorBlur}
            onKeyDown={onSelectorKeyDown}
            onSubmit={triggerPartConfirm}
            // Change
            value={hoverValues}
            maskFormat={maskFormat}
            onChange={onSelectorChange}
            onInputChange={onSelectorInputChange}
            // Format
            format={formatList}
            inputReadOnly={inputReadOnly}
            // Disabled
            disabled={disabled}
            // Open
            open={mergedOpen}
            onOpenChange={triggerOpen}
            // Click
            onClick={onSelectorClick}
            onClear={onSelectorClear}
            // Invalid
            invalid={submitInvalidates}
            onInvalid={onSelectorInvalid}
            // Offset
            onActiveOffset={setActiveOffset}
          />
        </PickerTrigger>
      </PickerContext.Provider>
    </ContextIsolator>
  );
}

const RefRangePicker = React.forwardRef(RangePicker) as <DateType extends object = any>(
  props: InternalRangePickerProps<DateType> & React.RefAttributes<RangePickerRef>,
) => React.ReactElement;

if (process.env.NODE_ENV !== 'production') {
  (RefRangePicker as any).displayName = 'RefRangePicker';
}

export default RefRangePicker;
