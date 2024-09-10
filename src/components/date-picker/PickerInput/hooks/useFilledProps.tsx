import * as React from 'react';
import { CalendarOutline, ClockOutline } from '@metisjs/icons';
import { useZIndex } from '../../../_util/hooks/useZIndex';
import type { SomeRequired } from '../../../_util/type';
import { ConfigContext } from '../../../config-provider';
import DisabledContext from '../../../config-provider/DisabledContext';
import useSize from '../../../config-provider/hooks/useSize';
import { FormItemInputContext } from '../../../form/context';
import type { ValidateStatus } from '../../../form/FormItem';
import useVariant from '../../../form/hooks/useVariant';
import { useLocale } from '../../../locale';
import useSelectIcons from '../../../select/hooks/useIcons';
import { useCompactItemContext } from '../../../space/Compact';
import { fillShowTimeConfig, getTimeProps } from '../../hooks/useTimeConfig';
import type {
  DisabledDate,
  FilledLocale,
  FormatType,
  InternalMode,
  Locale,
  PickerMode,
} from '../../interface';
import { fillTimeFormat } from '../../utils/dateUtil';
import { toArray } from '../../utils/miscUtil';
import type { InternalRangePickerProps } from '../RangePicker';
import useDisabledBoundary from './useDisabledBoundary';
import { useFieldFormat } from './useFieldFormat';
import useInputReadOnly from './useInputReadOnly';
import useInvalidate from './useInvalidate';

type UseInvalidate<DateType extends object = any> = typeof useInvalidate<DateType>;

type PickedProps<DateType extends object = any> = Pick<
  InternalRangePickerProps<DateType>,
  | 'generateConfig'
  | 'picker'
  | 'order'
  | 'components'
  | 'allowClear'
  | 'needConfirm'
  | 'format'
  | 'inputReadOnly'
  | 'disabledDate'
  | 'minDate'
  | 'maxDate'
  | 'defaultOpenValue'
  | 'getPopupContainer'
  | 'size'
  | 'status'
  | 'variant'
  | 'popupZIndex'
  | 'disabled'
> & {
  prefixCls?: string;
  locale?: Locale;
  multiple?: boolean;
  // RangePicker showTime definition is different with Picker
  showTime?: any;
  value?: any;
  defaultValue?: any;
  pickerValue?: any;
  defaultPickerValue?: any;
  removeIcon?: React.ReactNode;
};

type ExcludeBooleanType<T> = T extends boolean ? never : T;

type GetGeneric<T> = T extends PickedProps<infer U> ? U : never;

type ToArrayType<T, DateType> = T extends any[] ? T : DateType[];

function useList<T>(value: T | T[], fillMode = false) {
  const values = React.useMemo(() => {
    const list = (value ? toArray(value) : value) as T[];

    if (fillMode && list) {
      list[1] = list[1] || list[0];
    }

    return list;
  }, [value, fillMode]);
  return values;
}

export function fillLocale(
  locale: Locale,
  {
    showHour,
    showMinute,
    showSecond,
    showMillisecond,
    use12Hours,
  }: {
    showHour?: boolean;
    showMinute?: boolean;
    showSecond?: boolean;
    showMillisecond?: boolean;
    use12Hours?: boolean;
  },
): FilledLocale {
  // Not fill `monthFormat` since `locale.shortMonths` handle this
  // Not fill `cellMeridiemFormat` since AM & PM by default
  const {
    // Input Field
    fieldDateTimeFormat,
    fieldDateFormat,
    fieldTimeFormat,
    fieldMonthFormat,
    fieldYearFormat,
    fieldWeekFormat,
    fieldQuarterFormat,

    // Header Format
    yearFormat,
    // monthFormat,

    // Cell format
    cellYearFormat,
    cellQuarterFormat,
    cellDateFormat,

    // cellMeridiemFormat,
  } = locale;

  const timeFormat = fillTimeFormat(showHour, showMinute, showSecond, showMillisecond, use12Hours);

  return {
    ...locale,

    fieldDateTimeFormat: fieldDateTimeFormat || `YYYY-MM-DD ${timeFormat}`,
    fieldDateFormat: fieldDateFormat || 'YYYY-MM-DD',
    fieldTimeFormat: fieldTimeFormat || timeFormat,
    fieldMonthFormat: fieldMonthFormat || 'YYYY-MM',
    fieldYearFormat: fieldYearFormat || 'YYYY',
    fieldWeekFormat: fieldWeekFormat || 'gggg-wo',
    fieldQuarterFormat: fieldQuarterFormat || 'YYYY-[Q]Q',

    yearFormat: yearFormat || 'YYYY',

    cellYearFormat: cellYearFormat || 'YYYY',
    cellQuarterFormat: cellQuarterFormat || '[Q]Q',
    cellDateFormat: cellDateFormat || 'D',
  };
}

/**
 * Align the outer props with unique typed and fill undefined props.
 * This is shared with both RangePicker and Picker. This will do:
 * - Convert `value` & `defaultValue` to array
 * - handle the legacy props fill like `clearIcon` + `allowClear` = `clearIcon`
 */
export default function useFilledProps<
  InProps extends PickedProps,
  DateType extends GetGeneric<InProps>,
  UpdaterProps extends Record<string, any> = object,
>(
  props: InProps,
  updater?: () => UpdaterProps,
): [
  filledProps: Omit<
    SomeRequired<InProps, 'disabledDate' | 'components' | 'locale' | 'prefixCls'>,
    keyof UpdaterProps | 'showTime' | 'value' | 'defaultValue' | 'status'
  > &
    UpdaterProps & {
      picker: PickerMode;
      showTime?: ExcludeBooleanType<InProps['showTime']>;
      value?: ToArrayType<InProps['value'], DateType>;
      defaultValue?: ToArrayType<InProps['value'], DateType>;
      pickerValue?: ToArrayType<InProps['value'], DateType>;
      defaultPickerValue?: ToArrayType<InProps['value'], DateType>;
      disabledDate: DisabledDate<DateType>;
      isCompactItem: boolean;
      compactItemClassnames: string;
      enableVariantCls: boolean;
      status: ValidateStatus;
    },
  internalPicker: InternalMode,
  complexPicker: boolean,
  formatList: FormatType<DateType>[],
  maskFormat: string | undefined,
  isInvalidateDate: ReturnType<UseInvalidate<DateType>>,
] {
  const {
    prefixCls: customizePrefixCls,
    size: customizeSize = 'middle',
    status: customStatus,
    variant: customVariant,
    disabled: customDisabled,
    generateConfig,
    locale,
    picker = 'date',
    order = true,
    components = {},
    needConfirm,
    multiple,
    format,
    inputReadOnly,
    disabledDate,
    minDate,
    maxDate,
    showTime,
    popupZIndex,

    value,
    defaultValue,
    pickerValue,
    defaultPickerValue,

    getPopupContainer: customizeGetPopupContainer,
  } = props;

  const { getPrefixCls, getPopupContainer } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('picker', customizePrefixCls);
  const { isCompactItem, compactSize, compactItemClassnames } = useCompactItemContext(prefixCls);

  const values = useList(value);
  const defaultValues = useList(defaultValue);
  const pickerValues = useList(pickerValue);
  const defaultPickerValues = useList(defaultPickerValue);

  // ======================== Picker ========================
  /** Almost same as `picker`, but add `datetime` for `date` with `showTime` */
  const internalPicker: InternalMode = picker === 'date' && showTime ? 'datetime' : picker;

  /** The picker is `datetime` or `time` */
  const multipleInteractivePicker = internalPicker === 'time' || internalPicker === 'datetime';
  const complexPicker = multipleInteractivePicker || multiple;
  const mergedNeedConfirm = needConfirm ?? multipleInteractivePicker;

  // ======================= Locales ========================
  const [contextLocale] = useLocale('DatePicker');
  let mergedLocale = { ...contextLocale, ...locale };

  // ========================== Time ==========================
  // Auto `format` need to check `showTime.showXXX` first.
  // And then merge the `locale` into `mergedShowTime`.
  const [timeProps, localeTimeProps, showTimeFormat, propFormat] = getTimeProps({
    ...props,
    locale: mergedLocale,
  });

  mergedLocale = fillLocale(mergedLocale, localeTimeProps);

  const mergedShowTime = React.useMemo(
    () => fillShowTimeConfig(internalPicker, showTimeFormat, propFormat, timeProps, mergedLocale),
    [internalPicker, showTimeFormat, propFormat, timeProps, mergedLocale],
  );

  // ======================== Icons =========================
  const { clearIcon, removeIcon } = useSelectIcons({
    ...props,
    prefixCls,
  });

  // ===================== Disabled =====================
  const disabled = React.useContext(DisabledContext);
  const mergedDisabled = customDisabled ?? disabled;

  // ===================== Size =====================
  const mergedSize = useSize((ctx) => customizeSize ?? compactSize ?? ctx);

  // ===================== Variant =====================
  const [variant, enableVariantCls] = useVariant(customVariant);

  // ===================== FormItemInput =====================
  const formItemContext = React.useContext(FormItemInputContext);
  const { hasFeedback, status: contextStatus, feedbackIcon } = formItemContext;

  // ===================== Status =====================
  const mergedStatus = customStatus ?? contextStatus;

  // ============================ ZIndex ============================
  const [zIndex] = useZIndex('DatePicker', popupZIndex);

  const suffixIcon = (
    <>
      {picker === 'time' ? <ClockOutline /> : <CalendarOutline />}
      {hasFeedback && feedbackIcon}
    </>
  );

  // ======================== Props =========================
  const filledProps = React.useMemo(
    () =>
      ({
        suffixIcon,
        ...props,
        prefixCls,
        locale: mergedLocale,
        picker,
        order,
        components,
        clearIcon,
        removeIcon,
        showTime: mergedShowTime,
        value: values,
        defaultValue: defaultValues,
        pickerValue: pickerValues,
        defaultPickerValue: defaultPickerValues,
        isCompactItem,
        compactItemClassnames,
        size: mergedSize,
        variant,
        enableVariantCls,
        status: mergedStatus,
        popupZIndex: zIndex,
        disabled: mergedDisabled,
        getPopupContainer: customizeGetPopupContainer || getPopupContainer,
        ...updater?.(),
      }) as any,
    [props],
  );

  // ======================== Format ========================
  const [formatList, maskFormat] = useFieldFormat<DateType>(internalPicker, mergedLocale, format);

  // ======================= ReadOnly =======================
  const mergedInputReadOnly = useInputReadOnly(formatList, inputReadOnly, multiple);

  // ======================= Boundary =======================
  const disabledBoundaryDate = useDisabledBoundary(
    generateConfig,
    mergedLocale,
    disabledDate,
    minDate,
    maxDate,
  );

  // ====================== Invalidate ======================
  const isInvalidateDate = useInvalidate(
    generateConfig,
    picker,
    disabledBoundaryDate,
    mergedShowTime,
  );

  // ======================== Merged ========================
  const mergedProps = React.useMemo(
    () => ({
      ...filledProps,
      needConfirm: mergedNeedConfirm,
      inputReadOnly: mergedInputReadOnly,
      disabledDate: disabledBoundaryDate,
    }),
    [filledProps, mergedNeedConfirm, mergedInputReadOnly, disabledBoundaryDate],
  );

  return [mergedProps, internalPicker, !!complexPicker, formatList, maskFormat, isInvalidateDate];
}