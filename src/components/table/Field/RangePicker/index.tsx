import React from 'react';
import type { Dayjs } from 'dayjs';
import type { FieldFC } from '..';
import type { RangePickerProps } from '../../../date-picker';
import DatePicker from '../../../date-picker';
import dayjsGenerateConfig from '../../../date-picker/generate/config/dayjs';
import { getTimeProps } from '../../../date-picker/hooks/useTimeConfig';
import { useFieldFormat } from '../../../date-picker/PickerInput/hooks/useFieldFormat';
import { fillLocale, parseDate } from '../../../date-picker/PickerInput/hooks/useFilledProps';
import { formatValue } from '../../../date-picker/utils/dateUtil';
import { getRowFormat } from '../../../date-picker/utils/miscUtil';
import { useLocale } from '../../../locale';

/**
 * 日期范围选择组件
 */
const FieldRangePicker: FieldFC<{
  text: string[];
  format?: RangePickerProps['format'];
  showTime?: boolean;
  picker?: RangePickerProps['picker'];
  editorProps?: Partial<RangePickerProps>;
}> = (
  { text, mode, render, renderEditor, showTime, picker = 'date', format, editorProps },
  ref,
) => {
  const [startText, endText] = Array.isArray(text) ? text : [];

  const [locale] = useLocale('DatePicker');
  const mergedPicker = showTime ? 'datetime' : picker;
  const [, localeTimeProps] = getTimeProps({
    picker: mergedPicker,
    format,
    ...editorProps,
    showTime,
    locale,
  });
  const mergedLocale = fillLocale(locale, localeTimeProps);
  const [formatList] = useFieldFormat<Dayjs>(mergedPicker, mergedLocale, format);

  const stringFormatList = React.useMemo(
    () =>
      formatList.map((format) =>
        typeof format === 'function' ? getRowFormat(mergedPicker, locale) : format,
      ) as string[],
    [formatList, mergedPicker, locale],
  );

  if (mode === 'read') {
    const parsedStartText = parseDate<Dayjs>(
      startText,
      dayjsGenerateConfig,
      locale,
      stringFormatList,
    );
    const parsedEndText = parseDate<Dayjs>(endText, dayjsGenerateConfig, locale, stringFormatList);

    const dom = (
      <div ref={ref} className="flex flex-wrap items-center gap-2">
        <div>
          {formatValue(parsedStartText, {
            locale,
            format: formatList[0],
            generateConfig: dayjsGenerateConfig,
          }) || '-'}
        </div>
        <div>
          {formatValue(parsedEndText, {
            locale,
            format: formatList[0],
            generateConfig: dayjsGenerateConfig,
          }) || '-'}
        </div>
      </div>
    );
    if (render) {
      return render(text, <span>{dom}</span>);
    }
    return dom;
  }

  if (mode === 'edit') {
    const dom = (
      <DatePicker.RangePicker ref={ref} format={format} showTime={showTime} {...editorProps} />
    );
    if (renderEditor) {
      return renderEditor(text, dom);
    }
    return dom;
  }
  return null;
};

export default React.forwardRef(FieldRangePicker);
