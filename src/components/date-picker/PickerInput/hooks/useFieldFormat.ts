import * as React from 'react';
import type { FormatType, InternalMode, Locale, SharedPickerProps } from '../../interface';
import { getRowFormat, toArray } from '../../utils/miscUtil';

export function getFieldFormat<DateType = any>(
  picker: InternalMode,
  locale: Locale,
  format?: SharedPickerProps['format'],
): [formatList: FormatType<DateType>[], maskFormat?: string] {
  const rawFormat = getRowFormat(picker, locale, format);

  const formatList = toArray(rawFormat);

  const firstFormat = formatList[0];
  const maskFormat =
    typeof firstFormat === 'object' && firstFormat.type === 'mask' ? firstFormat.format : undefined;

  return [
    // Format list
    formatList.map((config) =>
      typeof config === 'string' || typeof config === 'function' ? config : config!.format,
    ),
    // Mask Format
    maskFormat,
  ];
}

export function useFieldFormat<DateType = any>(
  picker: InternalMode,
  locale: Locale,
  format?: SharedPickerProps['format'],
): [formatList: FormatType<DateType>[], maskFormat?: string] {
  return React.useMemo(() => getFieldFormat(picker, locale, format), [picker, locale, format]);
}
