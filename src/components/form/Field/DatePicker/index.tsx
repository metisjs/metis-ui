import React from 'react';
import type { Dayjs } from 'dayjs';
import type { FieldFC } from '..';
import type { DatePickerProps } from '../../../date-picker';
import DatePicker from '../../../date-picker';
import dayjsGenerateConfig from '../../../date-picker/generate/config/dayjs';
import { getTimeProps } from '../../../date-picker/hooks/useTimeConfig';
import { useFieldFormat } from '../../../date-picker/PickerInput/hooks/useFieldFormat';
import { fillLocale, parseDate } from '../../../date-picker/PickerInput/hooks/useFilledProps';
import { formatValue } from '../../../date-picker/utils/dateUtil';
import { getRowFormat } from '../../../date-picker/utils/miscUtil';
import { useLocale } from '../../../locale';

export type FieldDatePickerProps = {
  text: string | number;
  format?: DatePickerProps['format'];
  showTime?: boolean;
  picker?: DatePickerProps['picker'];
  editorProps?: Partial<DatePickerProps>;
};

/**
 * 日期选择组件
 */
const FieldDatePicker: FieldFC<FieldDatePickerProps> = (
  { text, mode, render, renderEditor, showTime, picker = 'date', format, editorProps },
  ref,
) => {
  const [locale] = useLocale('DatePicker');
  const mergedPicker = showTime ? 'datetime' : picker;
  const [, localeTimeProps] = getTimeProps({
    picker: mergedPicker,
    format,
    showTime,
    ...editorProps,
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
    const parsed = parseDate<Dayjs>(text, dayjsGenerateConfig, locale, stringFormatList);

    const dom = formatValue(parsed, {
      locale,
      format: formatList[0],
      generateConfig: dayjsGenerateConfig,
    });
    if (render) {
      return render(text, <>{dom}</>);
    }
    return <>{dom}</>;
  }

  if (mode === 'edit') {
    const dom = (
      <DatePicker ref={ref} format={format} showTime={showTime} picker={picker} {...editorProps} />
    );
    if (renderEditor) {
      return renderEditor(text, dom);
    }
    return dom;
  }

  return null;
};
export default React.forwardRef(FieldDatePicker);
