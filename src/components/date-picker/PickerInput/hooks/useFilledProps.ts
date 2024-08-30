import * as React from 'react';
import type { SomeRequired } from '../../../_util/type';
import { ConfigContext } from '../../../config-provider';
import useSelectIcons from '../../../select/hooks/useIcons';
import useLocale from '../../hooks/useLocale';
import { fillShowTimeConfig, getTimeProps } from '../../hooks/useTimeConfig';
import type { DisabledDate, FormatType, InternalMode, PickerMode } from '../../interface';
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
  | 'locale'
  | 'picker'
  | 'prefixCls'
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
> & {
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
    SomeRequired<InProps, 'disabledDate' | 'components'>,
    keyof UpdaterProps | 'showTime' | 'value' | 'defaultValue'
  > &
    UpdaterProps & {
      picker: PickerMode;
      showTime?: ExcludeBooleanType<InProps['showTime']>;
      value?: ToArrayType<InProps['value'], DateType>;
      defaultValue?: ToArrayType<InProps['value'], DateType>;
      pickerValue?: ToArrayType<InProps['value'], DateType>;
      defaultPickerValue?: ToArrayType<InProps['value'], DateType>;
      disabledDate: DisabledDate<DateType>;
    },
  internalPicker: InternalMode,
  complexPicker: boolean,
  formatList: FormatType<DateType>[],
  maskFormat: string | undefined,
  isInvalidateDate: ReturnType<UseInvalidate<DateType>>,
] {
  const {
    generateConfig,
    locale,
    picker = 'date',
    prefixCls: customizePrefixCls,
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

    value,
    defaultValue,
    pickerValue,
    defaultPickerValue,
  } = props;

  const { getPrefixCls } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('picker', customizePrefixCls);

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

  // ========================== Time ==========================
  // Auto `format` need to check `showTime.showXXX` first.
  // And then merge the `locale` into `mergedShowTime`.
  const [timeProps, localeTimeProps, showTimeFormat, propFormat] = getTimeProps(props);

  // ======================= Locales ========================
  const mergedLocale = useLocale(locale, localeTimeProps);

  const mergedShowTime = React.useMemo(
    () => fillShowTimeConfig(internalPicker, showTimeFormat, propFormat, timeProps, mergedLocale),
    [internalPicker, showTimeFormat, propFormat, timeProps, mergedLocale],
  );

  // ======================== Icons =========================
  const { clearIcon, removeIcon } = useSelectIcons({
    ...props,
    prefixCls,
  });

  // ======================== Props =========================
  const filledProps = React.useMemo(
    () =>
      ({
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
        ...updater?.(),
      } as any),
    [props],
  );

  // ======================== Format ========================
  const [formatList, maskFormat] = useFieldFormat<DateType>(internalPicker, mergedLocale, format);

  // ======================= ReadOnly =======================
  const mergedInputReadOnly = useInputReadOnly(formatList, inputReadOnly, multiple);

  // ======================= Boundary =======================
  const disabledBoundaryDate = useDisabledBoundary(
    generateConfig,
    locale,
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
