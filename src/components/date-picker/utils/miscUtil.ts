import type { SelectCommonPlacement } from '../../select/interface';
import type { AlignType } from '../../trigger';
import type { InternalMode, Locale, PickerMode, SharedPickerProps } from '../interface';

export function leftPad(str: string | number, length: number, fill: string = '0') {
  let current = String(str);
  while (current.length < length) {
    current = `${fill}${current}`;
  }
  return current;
}

/**
 * Convert `value` to array. Will provide `[]` if is null or undefined.
 */
export function toArray<T>(val?: T | T[] | null): T[] {
  if (val === null || val === undefined) {
    return [];
  }

  return Array.isArray(val) ? val : [val];
}

export function fillIndex<T extends any[]>(ori: T, index: number, value: T[number]): T {
  const clone = [...ori] as T;
  clone[index] = value;

  return clone;
}

/** Pick props from the key list. Will filter empty value */
export function pickProps<T extends Record<string, any>, K extends keyof T>(
  props: T,
  keys?: K[] | readonly K[],
): K extends keyof T ? Pick<T, K> : T {
  const clone = {} as T;

  const mergedKeys = (keys || Object.keys(props)) as (keyof T)[];

  mergedKeys.forEach((key) => {
    if (props[key] !== undefined) {
      clone[key] = props[key];
    }
  });

  return clone as any;
}

export function getRowFormat(
  picker: InternalMode,
  locale: Locale,
  format?: SharedPickerProps['format'],
) {
  if (format) {
    return format;
  }

  switch (picker) {
    // All from the `locale.fieldXXXFormat` first
    case 'time':
      return locale.fieldTimeFormat;
    case 'datetime':
      return locale.fieldDateTimeFormat;
    case 'month':
      return locale.fieldMonthFormat;
    case 'year':
      return locale.fieldYearFormat;
    case 'quarter':
      return locale.fieldQuarterFormat;
    case 'week':
      return locale.fieldWeekFormat;

    default:
      return locale.fieldDateFormat;
  }
}

export function getFromDate<DateType>(
  calendarValues: DateType[],
  activeIndexList: number[],
  activeIndex?: number,
) {
  const mergedActiveIndex =
    activeIndex !== undefined ? activeIndex : activeIndexList[activeIndexList.length - 1];
  const firstValuedIndex = activeIndexList.find((index) => calendarValues[index]);

  return mergedActiveIndex !== firstValuedIndex ? calendarValues[firstValuedIndex!] : undefined;
}

export function getPlaceholder(
  locale: Locale,
  picker?: PickerMode,
  customizePlaceholder?: string,
): string {
  if (customizePlaceholder !== undefined) {
    return customizePlaceholder;
  }

  if (picker === 'year' && locale.yearPlaceholder) {
    return locale.yearPlaceholder;
  }
  if (picker === 'quarter' && locale.quarterPlaceholder) {
    return locale.quarterPlaceholder;
  }
  if (picker === 'month' && locale.monthPlaceholder) {
    return locale.monthPlaceholder;
  }
  if (picker === 'week' && locale.weekPlaceholder) {
    return locale.weekPlaceholder;
  }
  if (picker === 'time' && locale.timePlaceholder) {
    return locale.timePlaceholder;
  }
  return locale.placeholder;
}

export function getRangePlaceholder(
  locale: Locale,
  picker?: PickerMode,
  customizePlaceholder?: [string, string],
) {
  if (customizePlaceholder !== undefined) {
    return customizePlaceholder;
  }

  if (picker === 'year' && locale.rangeYearPlaceholder) {
    return locale.rangeYearPlaceholder;
  }
  if (picker === 'quarter' && locale.rangeQuarterPlaceholder) {
    return locale.rangeQuarterPlaceholder;
  }
  if (picker === 'month' && locale.rangeMonthPlaceholder) {
    return locale.rangeMonthPlaceholder;
  }
  if (picker === 'week' && locale.rangeWeekPlaceholder) {
    return locale.rangeWeekPlaceholder;
  }
  if (picker === 'time' && locale.rangeTimePlaceholder) {
    return locale.rangeTimePlaceholder;
  }
  return locale.rangePlaceholder;
}

export function transPlacement2PopupAlign(placement?: SelectCommonPlacement): AlignType {
  const overflow = {
    adjustX: 1,
    adjustY: 1,
  };
  switch (placement) {
    case 'bottomLeft': {
      return {
        points: ['tl', 'bl'],
        offset: [0, 4],
        overflow,
      };
    }
    case 'bottomRight': {
      return {
        points: ['tr', 'br'],
        offset: [0, 4],
        overflow,
      };
    }
    case 'topLeft': {
      return {
        points: ['bl', 'tl'],
        offset: [0, -4],
        overflow,
      };
    }
    case 'topRight': {
      return {
        points: ['br', 'tr'],
        offset: [0, -4],
        overflow,
      };
    }
    default: {
      return {
        points: ['tl', 'bl'],
        offset: [0, 4],
        overflow,
      };
    }
  }
}
