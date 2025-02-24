import React from 'react';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { formatValue } from 'metis-ui/es/date-picker/utils/dateUtil';
import type { FieldFC } from '..';
import type { DatePickerProps } from '../../../date-picker';
import DatePicker from '../../../date-picker';
import dayjsGenerateConfig from '../../../date-picker/generate/config/dayjs';
import { getTimeProps } from '../../../date-picker/hooks/useTimeConfig';
import { useFieldFormat } from '../../../date-picker/PickerInput/hooks/useFieldFormat';
import { fillLocale, parseDate } from '../../../date-picker/PickerInput/hooks/useFilledProps';
import { getRowFormat } from '../../../date-picker/utils/miscUtil';
import { useLocale } from '../../../locale';
import Tooltip from '../../../tooltip';

dayjs.extend(relativeTime);

/**
 * 与当前的时间进行比较
 */
const FieldFromNow: FieldFC<{
  text: string;
  format?: DatePickerProps['format'];
  editorProps?: Partial<DatePickerProps>;
}> = ({ text, mode, render, renderEditor, format, editorProps }, ref) => {
  const [locale] = useLocale('DatePicker');
  const [, localeTimeProps] = getTimeProps({
    ...editorProps,
    picker: 'datetime',
    showTime: true,
    format,
    locale,
  });
  const mergedLocale = fillLocale(locale, localeTimeProps);
  const [formatList] = useFieldFormat<Dayjs>('datetime', mergedLocale, format);
  const stringFormatList = React.useMemo(
    () =>
      formatList.map((format) =>
        typeof format === 'function' ? getRowFormat('datetime', locale) : format,
      ) as string[],
    [formatList, locale],
  );

  if (mode === 'read') {
    const parsed = parseDate<Dayjs>(text, dayjsGenerateConfig, locale, stringFormatList);

    const dom = (
      <Tooltip
        title={formatValue(parsed, {
          locale,
          format: formatList[0],
          generateConfig: dayjsGenerateConfig,
        })}
      >
        {dayjs(text).fromNow()}
      </Tooltip>
    );
    if (render) {
      return render(text, <>{dom}</>);
    }
    return <>{dom}</>;
  }
  if (mode === 'edit') {
    const dom = <DatePicker ref={ref} showTime format={format} {...editorProps} />;
    if (renderEditor) {
      return renderEditor(text, dom);
    }
    return dom;
  }
  return null;
};

export default React.forwardRef(FieldFromNow);
