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

/**
 * 日期选择组件
 */
const FieldDatePicker: FieldFC<{
  text: string | number;
  format?: DatePickerProps['format'];
  picker: DatePickerProps['picker'];
  editorProps?: Partial<DatePickerProps>;
}> = ({ text, mode, render, renderEditor, picker = 'date', format, editorProps }, ref) => {
  const [locale] = useLocale('DatePicker');
  const [, localeTimeProps] = getTimeProps({
    ...editorProps,
    picker,
    format,
    locale,
  });
  const mergedLocale = fillLocale(locale, localeTimeProps);
  const [formatList] = useFieldFormat<Dayjs>(picker, mergedLocale, format);

  const stringFormatList = React.useMemo(
    () =>
      formatList.map((format) =>
        typeof format === 'function' ? getRowFormat(picker, locale) : format,
      ) as string[],
    [formatList, picker, locale],
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
    const dom = <DatePicker ref={ref} format={format} picker={picker} {...editorProps} />;
    if (renderEditor) {
      return renderEditor(text, dom);
    }
    return dom;
  }

  return null;
};
export default React.forwardRef(FieldDatePicker);
