import omit from '@rc-component/util/es/omit';
import getValue from '@rc-component/util/es/utils/get';
import { isNil } from '@util/isNil';
import type { AnyObject } from '@util/type';
import type { Dayjs } from 'dayjs';
import dayjsGenerateConfig from '../../date-picker/generate/config/dayjs';
import type { InternalMode, Locale } from '../../date-picker/interface';
import { parseDate } from '../../date-picker/PickerInput/hooks/useFilledProps';
import { getFormatList, isSameOrAfter, isSameOrBefore } from '../../date-picker/utils/dateUtil';
import { toNumber } from '../../form/Field/Percent';
import type { FieldValueType } from '../../form/interface';
import type { FilterState } from '../hooks/useFilter';
import type {
  ColumnFilter,
  ColumnFilterItem,
  FilterValue,
  InternalColumnType,
  Key,
} from '../interface';

export function fillFilterProps<RecordType extends AnyObject>(
  filter: InternalColumnType<any>['filter'],
): Exclude<ColumnFilter<RecordType>, boolean> {
  return !filter || filter === true ? {} : filter;
}

export function flattenKeys(filters?: ColumnFilterItem[]) {
  let keys: FilterValue = [];
  (filters || []).forEach(({ value, children }) => {
    keys.push(value);
    if (children) {
      keys = [...keys, ...flattenKeys(children)];
    }
  });
  return keys;
}

export const EXCLUDE_TYPES = [
  'index',
  'indexBorder',
  'avatar',
  'password',
  'image',
  'action',
  'slider',
  'rate',
];

export function isFilterableWithValueType(column: InternalColumnType<any>) {
  const { filter, valueType = 'text' } = column;
  return (
    typeof valueType !== 'function' &&
    !EXCLUDE_TYPES.includes(typeof valueType === 'object' ? valueType.type : valueType) &&
    (filter === true || (typeof filter === 'object' && !filter.items && !filter.dropdown))
  );
}

export function isFilterable(column: InternalColumnType<any>) {
  const { filter } = column;
  const mergedFilter = typeof filter === 'boolean' ? {} : { ...filter };

  return mergedFilter.items?.length || mergedFilter.dropdown || isFilterableWithValueType(column);
}

const numInRange = (num: number | string, range: [number | undefined, number | undefined]) => {
  const [min, max] = range;

  const parsed =
    typeof num === 'string' && (num as string).includes('%')
      ? toNumber((num as string).replace('%', ''))
      : toNumber(num);

  if (!isNil(min) && !isNil(max)) {
    return parsed >= min && parsed <= max;
  }
  if (!isNil(min)) {
    return parsed >= min;
  }
  if (!isNil(max)) {
    return parsed <= max;
  }

  return true;
};

const valueTypeToDatePickerMode = (valueType: FieldValueType): InternalMode => {
  const traverseMap: Record<string, InternalMode> = {
    date: 'date',
    dateWeek: 'week',
    dateMonth: 'month',
    dateQuarter: 'quarter',
    dateYear: 'year',
    dateTime: 'datetime',
    fromNow: 'datetime',
    time: 'time',
    dateRange: 'date',
    dateWeekRange: 'week',
    dateMonthRange: 'month',
    dateQuarterRange: 'quarter',
    dateYearRange: 'year',
    dateTimeRange: 'datetime',
    timeRange: 'time',
  };

  return traverseMap[valueType];
};

const dateInRange = (
  date: string | number,
  range: [string | undefined, string | undefined],
  picker: InternalMode,
  formatList: string[],
  locale: Locale,
) => {
  const parsed = parseDate<Dayjs>(date, dayjsGenerateConfig, locale, formatList);
  const min = parseDate<Dayjs>(range[0]!, dayjsGenerateConfig, locale, formatList);
  const max = parseDate<Dayjs>(range[1]!, dayjsGenerateConfig, locale, formatList);

  if (min && min) {
    return (
      isSameOrBefore(dayjsGenerateConfig, locale, parsed, max, picker) &&
      isSameOrAfter(dayjsGenerateConfig, locale, parsed, min, picker)
    );
  }
  if (min) {
    return isSameOrAfter(dayjsGenerateConfig, locale, parsed, min, picker);
  }
  if (max) {
    return isSameOrBefore(dayjsGenerateConfig, locale, parsed, max, picker);
  }

  return true;
};

const dateRangeInRange = (
  date: [string | number, string | number],
  range: [string | undefined, string | undefined],
  picker: InternalMode,
  formatList: string[],
  locale: Locale,
) => {
  const [startText, endText] = Array.isArray(date) ? date : [];
  const start = parseDate<Dayjs>(startText!, dayjsGenerateConfig, locale, formatList);
  const end = parseDate<Dayjs>(endText!, dayjsGenerateConfig, locale, formatList);
  const min = parseDate<Dayjs>(range[0]!, dayjsGenerateConfig, locale, formatList);
  const max = parseDate<Dayjs>(range[1]!, dayjsGenerateConfig, locale, formatList);

  if (min && max) {
    return (
      isSameOrBefore(dayjsGenerateConfig, locale, end, max, picker) &&
      isSameOrAfter(dayjsGenerateConfig, locale, start, min, picker)
    );
  }
  if (min) {
    return isSameOrAfter(dayjsGenerateConfig, locale, start, min, picker);
  }
  if (max) {
    return isSameOrBefore(dayjsGenerateConfig, locale, end, max, picker);
  }

  return true;
};

const getFilterMethodByValueType = <RecordType extends AnyObject = AnyObject>(
  valueType: InternalColumnType<RecordType>['valueType'] = 'text',
  hasValueEnum: boolean,
  path: any[],
  datePickerLocale: Locale,
) => {
  if (typeof valueType === 'function') {
    return null;
  }

  let mergedValueType: FieldValueType = typeof valueType === 'object' ? valueType.type : valueType;
  mergedValueType = mergedValueType === 'text' && hasValueEnum ? 'select' : mergedValueType;
  const valueTypeConfig: any = typeof valueType === 'object' ? omit(valueType, ['type']) : {};

  // 文本类
  if (['text', 'textarea'].includes(mergedValueType)) {
    return (search: [string], record: RecordType) => {
      const value = getValue(record, path as any);
      return value.toString().includes(search[0]);
    };
  }

  // 选项类
  if (
    ['cascader', 'select', 'checkbox', 'radio', 'switch', 'segmented', 'tag'].includes(
      mergedValueType,
    )
  ) {
    return (search: Key[], record: RecordType) => {
      const value = getValue(record, path as any);
      return Array.isArray(value) ? value.some((v) => search.includes(v)) : search.includes(value);
    };
  }

  // 数字类
  if (['money', 'progress', 'percent', 'digit'].includes(mergedValueType)) {
    return (search: [number | undefined, number | undefined], record: RecordType) => {
      const value = getValue(record, path as any);
      return numInRange(value, search);
    };
  }

  const picker = valueTypeToDatePickerMode(mergedValueType);
  const formatList = getFormatList(
    datePickerLocale,
    picker,
    picker === 'datetime' || picker === 'time',
    valueTypeConfig.format,
  );
  // 日期类
  if (
    [
      'date',
      'dateWeek',
      'dateMonth',
      'dateQuarter',
      'dateYear',
      'dateTime',
      'fromNow',
      'time',
    ].includes(mergedValueType)
  ) {
    return (search: [string | undefined, string | undefined], record: RecordType) => {
      const value = getValue(record, path as any);
      return dateInRange(value, search, picker, formatList, datePickerLocale);
    };
  }

  // 日期范围类
  if (
    [
      'dateRange',
      'dateWeekRange',
      'dateMonthRange',
      'dateQuarterRange',
      'dateYearRange',
      'dateTimeRange',
      'timeRange',
    ].includes(mergedValueType)
  ) {
    return (search: [string | undefined, string | undefined], record: RecordType) => {
      const value = getValue(record, path as any);
      return dateRangeInRange(value, search, picker, formatList, datePickerLocale);
    };
  }

  return null;
};

export const getFilterData = <RecordType extends AnyObject = AnyObject>(
  data: RecordType[],
  filterStates: FilterState<RecordType>[],
  childrenColumnName: keyof RecordType,
  datePickerLocale: Locale,
) => {
  const filterData = filterStates.reduce<RecordType[]>((currentData, filterState) => {
    const {
      column: { filter, valueType, dataIndex, valueEnum },
      filteredKeys,
    } = filterState;

    const mergedFilter = !filter || filter === true ? {} : filter;

    const path =
      dataIndex === null || dataIndex === undefined || dataIndex === ''
        ? []
        : Array.isArray(dataIndex)
          ? dataIndex
          : [dataIndex];
    const onFilter =
      getFilterMethodByValueType<RecordType>(valueType, !!valueEnum, path, datePickerLocale) ??
      mergedFilter.onFilter;

    if (onFilter && filteredKeys && filteredKeys.length) {
      return (
        currentData
          // shallow copy
          .map((record) => ({ ...record }))
          .filter((record: any) => {
            if (record[childrenColumnName]) {
              record[childrenColumnName] = getFilterData(
                record[childrenColumnName],
                filterStates,
                childrenColumnName,
                datePickerLocale,
              );
            }

            return onFilter(filteredKeys as any, record);
          })
      );
    }
    return currentData;
  }, data);
  return filterData;
};
