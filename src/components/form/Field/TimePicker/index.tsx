import React from 'react';
import { mergeSemanticCls } from '@util/classNameUtils';
import type { Dayjs } from 'dayjs';
import type { FieldFC } from '..';
import dayjsGenerateConfig from '../../../date-picker/generate/config/dayjs';
import { getTimeProps } from '../../../date-picker/hooks/useTimeConfig';
import { useFieldFormat } from '../../../date-picker/PickerInput/hooks/useFieldFormat';
import { fillLocale, parseDate } from '../../../date-picker/PickerInput/hooks/useFilledProps';
import { formatValue } from '../../../date-picker/utils/dateUtil';
import { getRowFormat } from '../../../date-picker/utils/miscUtil';
import { useLocale } from '../../../locale';
import type { TimePickerProps } from '../../../time-picker';
import TimePicker from '../../../time-picker';

export type FieldTimePickerProps = {
  text: string | number;
  format?: TimePickerProps['format'];
  editorProps?: Partial<TimePickerProps>;
};

/**
 * 时间选择组件
 */
const FieldTimePicker: FieldFC<FieldTimePickerProps> = (
  { text, mode, format, render, renderEditor, editorProps },
  ref,
) => {
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
    const parsed = parseDate<Dayjs>(text, dayjsGenerateConfig, locale, stringFormatList);

    const dom = formatValue(parsed, {
      locale,
      format: formatList[0],
      generateConfig: dayjsGenerateConfig,
    });
    if (render) {
      return render(text, <>{dom}</>);
    }
    return dom;
  }
  if (mode === 'edit') {
    const dom = (
      <TimePicker
        ref={ref}
        format={format}
        {...editorProps}
        className={mergeSemanticCls('w-full', editorProps?.className)}
      />
    );
    if (renderEditor) {
      return renderEditor(text, dom);
    }
    return dom;
  }
  return null;
};

export default React.forwardRef(FieldTimePicker);
