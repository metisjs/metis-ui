import React from 'react';
import type { Dayjs } from 'dayjs';
import type { FieldFC } from '..';
import dayjsGenerateConfig from '../../../date-picker/generate/config/dayjs';
import { getTimeProps } from '../../../date-picker/hooks/useTimeConfig';
import { useFieldFormat } from '../../../date-picker/PickerInput/hooks/useFieldFormat';
import { fillLocale, parseDate } from '../../../date-picker/PickerInput/hooks/useFilledProps';
import { formatValue } from '../../../date-picker/utils/dateUtil';
import { getRowFormat } from '../../../date-picker/utils/miscUtil';
import { useLocale } from '../../../locale';
import type { TimeRangePickerProps } from '../../../time-picker';
import TimePicker from '../../../time-picker';

export type FieldTimeRangePickerProps = {
  text: string[];
  format?: TimeRangePickerProps['format'];
  editorProps?: Partial<TimeRangePickerProps>;
};

/**
 * 时间范围选择组件
 */
const FieldTimeRangePicker: FieldFC<FieldTimeRangePickerProps> = (
  { text, mode, render, renderEditor, format, editorProps },
  ref,
) => {
  const [startText, endText] = Array.isArray(text) ? text : [];

  const [locale] = useLocale('DatePicker');
  const [, localeTimeProps] = getTimeProps({
    picker: 'time',
    format,
    ...editorProps,
    locale,
  });
  const mergedLocale = fillLocale(locale, localeTimeProps);
  const [formatList] = useFieldFormat<Dayjs>('time', mergedLocale, format);

  const stringFormatList = React.useMemo(
    () =>
      formatList.map((format) =>
        typeof format === 'function' ? getRowFormat('time', locale) : format,
      ) as string[],
    [formatList, locale],
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
      <div ref={ref} className="flex flex-wrap items-center gap-1">
        <div>
          {formatValue(parsedStartText, {
            locale,
            format: formatList[0],
            generateConfig: dayjsGenerateConfig,
          }) || '-'}
        </div>
        <div>~</div>
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
    const dom = <TimePicker.RangePicker ref={ref} format={format} {...editorProps} />;
    if (renderEditor) {
      return renderEditor(text, dom);
    }
    return dom;
  }
  return null;
};

export default React.forwardRef(FieldTimeRangePicker);
