import * as React from 'react';
import { CalendarOutline, ClockOutline } from '@metisjs/icons';
import { clsx } from '@util/classNameUtils';
import { useZIndex } from '@util/hooks/useZIndex';
import { cloneElement } from '@util/reactNode';
import type { RequiredWith } from '@util/type';
import { ConfigContext } from '../../../config-provider';
import type { DisabledType } from '../../../config-provider/DisabledContext';
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
  DateValue,
  DisabledDate,
  FilledLocale,
  FormatType,
  GenerateConfig,
  InternalMode,
  Locale,
  PickerMode,
} from '../../interface';
import { fillTimeFormat } from '../../utils/dateUtil';
import { getRowFormat, toArray } from '../../utils/miscUtil';
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
    const list = (value ? toArray(value) : undefined) as T[];

    if (fillMode && list) {
      list[1] = list[1] || list[0];
    }

    return list;
  }, [value, fillMode]);
  return values;
}

export function parseDate<T>(
  value: DateValue<T> | string | number,
  generateConfig: GenerateConfig<T>,
  locale: Locale,
  formatList: string[],
): T | null {
  let parsed: T | null = null;

  if (typeof value === 'string') {
    parsed = generateConfig.locale.parse(locale.locale, value, formatList);
  } else if (typeof value === 'number') {
    parsed = generateConfig.get(value);
  } else {
    parsed = value;
  }

  return parsed && generateConfig.isValidate(parsed) ? parsed : null;
}

function useDate<T>(
  value: DateValue<T> | DateValue<T>[],
  generateConfig: GenerateConfig<T>,
  picker: InternalMode,
  locale: Locale,
  formatList: FormatType<T>[],
) {
  const values = useList<DateValue<T>>(value);

  const stringFormatList = React.useMemo(
    () =>
      formatList.map((format) =>
        typeof format === 'function' ? getRowFormat(picker, locale) : format,
      ) as string[],
    [formatList, picker],
  );

  return React.useMemo(
    () => values?.map((value) => parseDate(value, generateConfig, locale, stringFormatList)),
    [values, generateConfig, stringFormatList],
  );
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
  updater?: (data: { disabled?: [boolean, boolean] | DisabledType }) => UpdaterProps,
): [
  filledProps: Omit<
    RequiredWith<InProps, 'disabledDate' | 'components' | 'locale' | 'prefixCls'>,
    keyof UpdaterProps | 'showTime' | 'value' | 'defaultValue' | 'status' | 'minDate' | 'maxDate'
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
      minDate?: DateType;
      maxDate?: DateType;
    },
  internalPicker: InternalMode,
  complexPicker: boolean,
  formatList: FormatType<DateType>[],
  maskFormat: string | undefined,
  isInvalidateDate: ReturnType<UseInvalidate<DateType>>,
] {
  const {
    prefixCls: customizePrefixCls,
    size: customizeSize,
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
    allowClear = true,

    value,
    defaultValue,
    pickerValue,
    defaultPickerValue,

    getPopupContainer: customizeGetPopupContainer,
  } = props;

  const { getPrefixCls, getPopupContainer } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('picker', customizePrefixCls);
  const { isCompactItem, compactSize, compactItemClassnames } = useCompactItemContext(prefixCls);

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

  const mergedShowTime = React.useMemo(() => {
    const config = fillShowTimeConfig(
      internalPicker,
      showTimeFormat,
      propFormat,
      timeProps,
      mergedLocale,
    );

    if (!config || !config.defaultOpenValue) return config;

    const { defaultOpenValue, format } = config;

    let parsedDefaultOpenValue: DateType | DateType[] | undefined = undefined;
    // RangePicker
    if (Array.isArray(defaultOpenValue)) {
      parsedDefaultOpenValue = (defaultOpenValue as DateValue<DateType>[]).map((v) =>
        parseDate(v, generateConfig, mergedLocale, [format!]),
      );
    } else {
      parsedDefaultOpenValue = parseDate(defaultOpenValue, generateConfig, mergedLocale, [format!]);
    }

    return { ...config, defaultOpenValue: parsedDefaultOpenValue };
  }, [internalPicker, showTimeFormat, propFormat, timeProps, generateConfig]);

  // ======================== Format ========================
  const [formatList, maskFormat] = useFieldFormat<DateType>(internalPicker, mergedLocale, format);

  // ===================== Value =====================
  const values = useDate(value, generateConfig, internalPicker, mergedLocale, formatList);
  const defaultValues = useDate(
    defaultValue,
    generateConfig,
    internalPicker,
    mergedLocale,
    formatList,
  );

  const [mergedMinDate] =
    useDate(minDate, generateConfig, internalPicker, mergedLocale, formatList) ?? [];

  const [mergedMaxDate] =
    useDate(maxDate, generateConfig, internalPicker, mergedLocale, formatList) ?? [];

  // ===================== Disabled =====================
  const disabled = React.useContext(DisabledContext);
  const mergedDisabled = customDisabled ?? disabled;

  // ===================== Size =====================
  const mergedSize = useSize((ctx) => customizeSize ?? compactSize ?? ctx);

  // ======================== Icons =================
  const { clearIcon, removeIcon } = useSelectIcons({
    ...props,
    prefixCls,
    size: mergedSize,
  });

  // ===================== Variant =====================
  const [variant, enableVariantCls] = useVariant(customVariant);

  // ===================== FormItemInput =====================
  const formItemContext = React.useContext(FormItemInputContext);
  const { hasFeedback, status: contextStatus, feedbackIcon } = formItemContext;

  // ===================== Status =====================
  const mergedStatus = customStatus ?? contextStatus;

  // ============================ ZIndex ============================
  const [zIndex] = useZIndex('DatePicker', popupZIndex);

  const suffixIconCls = clsx({
    'text-lg': mergedSize === 'large',
    'text-base': mergedSize === 'middle' || mergedSize === 'small' || mergedSize === 'mini',
  });
  const suffixIcon = (
    <>
      {picker === 'time' ? (
        <ClockOutline className={suffixIconCls} />
      ) : (
        <CalendarOutline className={suffixIconCls} />
      )}
      {hasFeedback &&
        cloneElement(feedbackIcon, (origin) => ({
          ...origin,
          className: clsx(suffixIconCls, origin.className),
        }))}
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
        clearIcon: allowClear ? clearIcon : null,
        removeIcon,
        showTime: mergedShowTime,
        value: values,
        defaultValue: defaultValues,
        minDate: mergedMinDate,
        maxDate: mergedMaxDate,
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
        ...updater?.({ disabled: mergedDisabled }),
      }) as any,
    [props],
  );

  // ======================= ReadOnly =======================
  const mergedInputReadOnly = useInputReadOnly(formatList, inputReadOnly, multiple);

  // ======================= Boundary =======================
  const disabledBoundaryDate = useDisabledBoundary(
    generateConfig,
    mergedLocale,
    disabledDate,
    mergedMinDate,
    mergedMaxDate,
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
