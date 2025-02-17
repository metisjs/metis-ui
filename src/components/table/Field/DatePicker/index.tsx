import React from 'react';
import type { FieldFC } from '..';
import type { DatePickerProps } from '../../../date-picker';
import DatePicker from '../../../date-picker';
import dayjsGenerateConfig from '../../../date-picker/generate/config/dayjs';
import { parseDate } from '../../../date-picker/PickerInput/hooks/useFilledProps';

const formatDate = (text: any, format: any) => {
  if (!text) return '-';
  if (typeof format === 'function') {
    return format(dayjs(text));
  } else {
    return dayjs(text).format((Array.isArray(format) ? format[0] : format) || 'YYYY-MM-DD');
  }
};

/**
 * 日期选择组件
 */
const FieldDatePicker: FieldFC<{
  text: string | number;
  fieldProps?: DatePickerProps;
}> = ({ text, mode, render, renderEditor, fieldProps }, ref) => {
  const { format } = fieldProps ?? {};

  if (mode === 'read') {
    const a = parseDate(text, dayjsGenerateConfig, locale, FORMAT_LIST);

    const dom = formatDate(text, format);
    if (render) {
      return render(text, { mode, ...fieldProps }, <>{dom}</>);
    }
    return <>{dom}</>;
  }

  if (mode === 'edit') {
    const dom = <DatePicker ref={ref} {...fieldProps} />;
    if (renderEditor) {
      return renderEditor(text, { mode, ...fieldProps }, dom);
    }
    return dom;
  }

  return null;
};
export default React.forwardRef(FieldDatePicker);
