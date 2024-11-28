import * as React from 'react';
import { useEvent, useMergedState } from 'rc-util';
import { clsx } from '../../_util/classNameUtils';
import { devUseWarning } from '../../_util/warning';
import { ConfigContext } from '../../config-provider';
import { fillShowTimeConfig, getTimeProps } from '../hooks/useTimeConfig';
import useToggleDates from '../hooks/useToggleDates';
import type {
  CellRender,
  Components,
  InternalMode,
  Locale,
  OnPanelChange,
  PanelMode,
  PickerMode,
  SharedPanelProps,
  SharedTimeProps,
} from '../interface';
import PickerContext from '../PickerInput/context';
import useCellRender from '../PickerInput/hooks/useCellRender';
import { fillLocale } from '../PickerInput/hooks/useFilledProps';
import { isSame } from '../utils/dateUtil';
import { pickProps, toArray } from '../utils/miscUtil';
import { PickerHackContext } from './context';
import DatePanel from './DatePanel';
import DateTimePanel from './DateTimePanel';
import DecadePanel from './DecadePanel';
import MonthPanel from './MonthPanel';
import QuarterPanel from './QuarterPanel';
import TimePanel from './TimePanel';
import WeekPanel from './WeekPanel';
import YearPanel from './YearPanel';

const DefaultComponents: Components = {
  date: DatePanel,
  datetime: DateTimePanel,
  week: WeekPanel,
  month: MonthPanel,
  quarter: QuarterPanel,
  year: YearPanel,
  decade: DecadePanel,
  time: TimePanel,
};

export interface PickerPanelRef {
  nativeElement: HTMLDivElement;
}

export interface BasePickerPanelProps<DateType extends object = any>
  extends Pick<
      SharedPanelProps<DateType>,
      // MISC
      | 'generateConfig'
      | 'className'

      // Disabled
      | 'disabledDate'
      | 'minDate'
      | 'maxDate'

      // Icon
      | 'prevIcon'
      | 'nextIcon'
      | 'superPrevIcon'
      | 'superNextIcon'
    >,
    SharedTimeProps<DateType>,
    Pick<React.HTMLAttributes<HTMLDivElement>, 'tabIndex'> {
  // Style
  prefixCls?: string;

  locale: Locale;

  // Value
  onSelect?: (date: DateType) => void;

  // Panel control
  defaultPickerValue?: DateType | null;
  pickerValue?: DateType | null;
  onPickerValueChange?: (date: DateType) => void;

  // Mode
  mode?: PanelMode;
  /**
   * Compatible with origin API.
   * Not mean the PickerPanel `onChange` event.
   */
  onPanelChange?: OnPanelChange<DateType>;
  picker?: PickerMode;

  // Time
  showTime?: true | SharedTimeProps<DateType>;

  // Week
  /**
   * Only worked in `date` mode. Show the current week
   */
  showWeek?: boolean;

  // Cell
  cellRender?: CellRender<DateType>;

  // Hover
  /** @private Used for Picker passing */
  hoverValue: DateType[] | null;
  /** @private Used for Picker passing */
  hoverRangeValue?: [start: DateType, end: DateType];
  /** @private Used for Picker passing */
  onHover?: (date: DateType) => void;

  // Components
  components?: Components;

  /** @private This is internal usage. Do not use in your production env */
  hideHeader?: boolean;
}

export interface SinglePickerPanelProps<DateType extends object = any>
  extends BasePickerPanelProps<DateType> {
  multiple?: false;

  defaultValue?: DateType | null;
  value?: DateType | null;
  onChange?: (date: DateType) => void;
}

export type PickerPanelProps<DateType extends object = any> = BasePickerPanelProps<DateType> & {
  /** multiple selection. Not support time or datetime picker */
  multiple?: boolean;

  defaultValue?: DateType | DateType[] | null;
  value?: DateType | DateType[] | null;
  onChange?: (date: DateType | DateType[] | null) => void;
};

function PickerPanel<DateType extends object = any>(
  props: PickerPanelProps<DateType>,
  ref: React.Ref<PickerPanelRef>,
) {
  const {
    locale,
    generateConfig,

    // Style
    prefixCls,
    className,
    tabIndex = 0,

    // Value
    multiple,
    defaultValue,
    value,
    onChange,
    onSelect,

    // Picker control
    defaultPickerValue,
    pickerValue,
    onPickerValueChange,

    // Mode
    mode,
    onPanelChange,
    picker = 'date',
    showTime,

    // Hover
    hoverValue,
    hoverRangeValue,

    // Cell
    cellRender,

    // Components
    components = {},

    hideHeader,
  } = props;

  const { getPrefixCls } = React.useContext(ConfigContext);
  const rootPrefixCls = getPrefixCls();
  const mergedPrefixCls = React.useContext(PickerContext)?.prefixCls || prefixCls || rootPrefixCls;
  // ========================== Refs ==========================
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useImperativeHandle(ref, () => ({
    nativeElement: rootRef.current!,
  }));

  // ========================== Time ==========================
  // Auto `format` need to check `showTime.showXXX` first.
  // And then merge the `locale` into `mergedShowTime`.
  const [timeProps, localeTimeProps, showTimeFormat, propFormat] = getTimeProps(props);

  // ========================= Locale =========================
  const filledLocale = fillLocale(locale, localeTimeProps);

  // ========================= Picker =========================
  const internalPicker: InternalMode = picker === 'date' && showTime ? 'datetime' : picker;

  // ======================== ShowTime ========================
  const mergedShowTime = React.useMemo(
    () => fillShowTimeConfig(internalPicker, showTimeFormat, propFormat, timeProps, filledLocale),
    [internalPicker, showTimeFormat, propFormat, timeProps, filledLocale],
  );

  // ========================== Now ===========================
  const now = generateConfig.getNow();

  // ========================== Mode ==========================
  const [mergedMode, setMergedMode] = useMergedState<PanelMode>(picker, {
    value: mode,
    postState: (val) => val || 'date',
  });

  const internalMode: InternalMode =
    mergedMode === 'date' && mergedShowTime ? 'datetime' : mergedMode;

  // ========================= Toggle =========================
  const toggleDates = useToggleDates(generateConfig, locale, internalPicker);

  // ========================= Value ==========================
  // >>> Real value
  // Interactive with `onChange` event which only trigger when the `mode` is `picker`
  const [innerValue, setMergedValue] = useMergedState(defaultValue, {
    value,
  });

  const mergedValue = React.useMemo(() => {
    // Clean up `[null]`
    const values = toArray(innerValue).filter((val) => val);
    return multiple ? values : values.slice(0, 1);
  }, [innerValue, multiple]);

  // Sync value and only trigger onChange event when changed
  const triggerChange = useEvent((nextValue: DateType[] | null) => {
    setMergedValue(nextValue);

    if (
      onChange &&
      (nextValue === null ||
        mergedValue.length !== nextValue.length ||
        mergedValue.some(
          (ori, index) => !isSame(generateConfig, locale, ori, nextValue[index], internalPicker),
        ))
    ) {
      onChange?.(multiple ? nextValue : (nextValue?.[0] ?? null));
    }
  });

  // >>> CalendarValue
  // CalendarValue is a temp value for user operation
  // which will only trigger `onCalendarChange` but not `onChange`
  const onInternalSelect = useEvent((newDate: DateType) => {
    onSelect?.(newDate);

    if (mergedMode === picker) {
      const nextValues = multiple ? toggleDates(mergedValue, newDate) : [newDate];

      triggerChange(nextValues);
    }
  });

  // >>> PickerValue
  // PickerValue is used to control the current displaying panel
  const [mergedPickerValue, setInternalPickerValue] = useMergedState(
    defaultPickerValue || mergedValue[0] || now,
    {
      value: pickerValue,
    },
  );

  React.useEffect(() => {
    if (mergedValue[0] && !pickerValue) {
      setInternalPickerValue(mergedValue[0]);
    }
  }, [mergedValue[0]]);

  // Both trigger when manually pickerValue or mode change
  const triggerPanelChange = (viewDate?: DateType, nextMode?: PanelMode) => {
    onPanelChange?.(viewDate || pickerValue!, nextMode || mergedMode);
  };

  const setPickerValue = (nextPickerValue: DateType, triggerPanelEvent = false) => {
    setInternalPickerValue(nextPickerValue);

    onPickerValueChange?.(nextPickerValue);

    if (triggerPanelEvent) {
      triggerPanelChange(nextPickerValue);
    }
  };

  const triggerModeChange = (nextMode: PanelMode, viewDate?: DateType) => {
    setMergedMode(nextMode);

    if (viewDate) {
      setPickerValue(viewDate);
    }

    triggerPanelChange(viewDate, nextMode);
  };

  const onPanelValueSelect = (nextValue: DateType) => {
    onInternalSelect(nextValue);
    setPickerValue(nextValue);

    // Update mode if needed
    if (mergedMode !== picker) {
      const decadeYearQueue: PanelMode[] = ['decade', 'year'];
      const decadeYearMonthQueue: PanelMode[] = [...decadeYearQueue, 'month'];

      const pickerQueue: Partial<Record<PickerMode, PanelMode[]>> = {
        quarter: [...decadeYearQueue, 'quarter'],
        week: [...decadeYearMonthQueue, 'week'],
        date: [...decadeYearMonthQueue, 'date'],
      };

      const queue = pickerQueue[picker] || decadeYearMonthQueue;
      const index = queue.indexOf(mergedMode);
      const nextMode = queue[index + 1];

      if (nextMode) {
        triggerModeChange(nextMode, nextValue);
      }
    }
  };

  // ======================= Hover Date =======================
  const hoverRangeDate = React.useMemo<[DateType, DateType] | null>(() => {
    let start: DateType | undefined;
    let end: DateType | undefined;

    if (Array.isArray(hoverRangeValue)) {
      [start, end] = hoverRangeValue;
    } else {
      start = hoverRangeValue;
    }

    // Return for not exist
    if (!start && !end) {
      return null;
    }

    // Fill if has empty
    start = start || end;
    end = end || start;

    return generateConfig.isAfter(start!, end!) ? [end!, start!] : [start!, end!];
  }, [hoverRangeValue, generateConfig]);

  // ======================= Components =======================
  // >>> cellRender
  const onInternalCellRender = useCellRender(cellRender);

  // ======================= Components =======================
  const PanelComponent = (components[internalMode] ||
    DefaultComponents[internalMode] ||
    DatePanel) as typeof DatePanel;

  // ======================== Context =========================
  const parentHackContext = React.useContext(PickerHackContext);
  const pickerPanelContext = React.useMemo(
    () => ({ ...parentHackContext, hideHeader }),
    [parentHackContext, hideHeader],
  );

  // ======================== Warnings ========================
  if (process.env.NODE_ENV !== 'production') {
    const warning = devUseWarning('DatePicker');
    warning(
      !mergedValue || mergedValue.every((val) => generateConfig.isValidate(val)),
      'usage',
      'Invalidate date pass to `value` or `defaultValue`.',
    );
  }

  // ========================= Style =========================
  const panelCls = clsx(
    `${mergedPrefixCls}-panel`,
    'inline-flex flex-col bg-transparent text-center',
  );

  // ========================= Render =========================
  const panelProps = pickProps(props, [
    // Week
    'showWeek',

    // Icons
    'prevIcon',
    'nextIcon',
    'superPrevIcon',
    'superNextIcon',

    // Disabled
    'disabledDate',
    'minDate',
    'maxDate',

    // Hover
    'onHover',
  ]);

  return (
    <PickerHackContext.Provider value={pickerPanelContext}>
      <div ref={rootRef} tabIndex={tabIndex} className={panelCls}>
        <PanelComponent
          {...panelProps}
          className={className}
          // Time
          showTime={mergedShowTime}
          // MISC
          prefixCls={mergedPrefixCls}
          locale={filledLocale}
          generateConfig={generateConfig}
          // Mode
          onModeChange={triggerModeChange}
          // Value
          pickerValue={mergedPickerValue!}
          onPickerValueChange={(nextPickerValue) => {
            setPickerValue(nextPickerValue, true);
          }}
          value={mergedValue[0]}
          onSelect={onPanelValueSelect}
          values={mergedValue}
          // Render
          cellRender={onInternalCellRender}
          // Hover
          hoverRangeValue={hoverRangeDate}
          hoverValue={hoverValue}
        />
      </div>
    </PickerHackContext.Provider>
  );
}

const RefPanelPicker = React.memo(React.forwardRef(PickerPanel));

// Make support generic
export default RefPanelPicker as <DateType extends object = any>(
  props: PickerPanelProps<DateType> & React.RefAttributes<PickerPanelRef>,
) => React.ReactElement;
