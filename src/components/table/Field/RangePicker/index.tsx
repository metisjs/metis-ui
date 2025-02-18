import React, { useCallback } from 'react';
import { useIntl } from '@ant-design/pro-provider';
import { compatibleBorder, FieldLabel, parseValueToDay } from '@ant-design/pro-utils';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import type { ProFieldFC, ProFieldLightProps } from '../../index';
// 兼容代码-----------
import 'antd/lib/date-picker/style';

//------------

/**
 * 日期范围选择组件
 *
 * @param
 */
const FieldRangePicker: ProFieldFC<
  {
    text: string[];
    format: string;
    bordered?: boolean;
    showTime?: boolean;
    picker?: 'time' | 'date' | 'week' | 'month' | 'quarter' | 'year';
  } & ProFieldLightProps
> = (
  {
    text,
    mode,
    light,
    label,
    format,
    render,
    picker,
    renderFormItem,
    plain,
    showTime,
    lightLabel,
    bordered,
    editorProps,
  },
  ref,
) => {
  const intl = useIntl();

  const [startText, endText] = Array.isArray(text) ? text : [];
  const [open, setOpen] = React.useState<boolean>(false);
  // antd 改了一下 交互，这里要兼容一下，不然会导致无法选中第二个数据
  const genFormatText = useCallback(
    (formatValue: dayjs.Dayjs) => {
      if (typeof editorProps?.format === 'function') {
        return editorProps?.format?.(formatValue);
      }
      return editorProps?.format || format || 'YYYY-MM-DD';
    },
    [editorProps, format],
  );
  // activePickerIndex for https://github.com/ant-design/ant-design/issues/22158
  const parsedStartText: string = startText
    ? dayjs(startText).format(genFormatText(dayjs(startText)))
    : '';
  const parsedEndText: string = endText ? dayjs(endText).format(genFormatText(dayjs(endText))) : '';

  if (mode === 'read') {
    const dom = (
      <div
        ref={ref}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          alignItems: 'center',
        }}
      >
        <div>{parsedStartText || '-'}</div>
        <div>{parsedEndText || '-'}</div>
      </div>
    );
    if (render) {
      return render(text, <span>{dom}</span>);
    }
    return dom;
  }

  if (mode === 'edit' || mode === 'update') {
    const dayValue = parseValueToDay(editorProps.value) as dayjs.Dayjs[];
    let dom;

    if (light) {
      dom = (
        <FieldLabel
          label={label}
          onClick={() => {
            editorProps?.onOpenChange?.(true);
            setOpen(true);
          }}
          style={
            dayValue
              ? {
                  paddingInlineEnd: 0,
                }
              : undefined
          }
          disabled={editorProps.disabled}
          value={
            dayValue || open ? (
              <DatePicker.RangePicker
                picker={picker}
                showTime={showTime}
                format={format}
                {...compatibleBorder(false)}
                {...editorProps}
                placeholder={
                  editorProps.placeholder ?? [
                    intl.getMessage('tableForm.selectPlaceholder', '请选择'),
                    intl.getMessage('tableForm.selectPlaceholder', '请选择'),
                  ]
                }
                onClear={() => {
                  setOpen(false);
                  editorProps?.onClear?.();
                }}
                value={dayValue}
                onOpenChange={(isOpen) => {
                  if (dayValue) setOpen(isOpen);
                  editorProps?.onOpenChange?.(isOpen);
                }}
              />
            ) : null
          }
          allowClear={false}
          bordered={bordered}
          ref={lightLabel}
          downIcon={dayValue || open ? false : undefined}
        />
      );
    } else {
      dom = (
        <DatePicker.RangePicker
          ref={ref}
          format={format}
          showTime={showTime}
          placeholder={[
            intl.getMessage('tableForm.selectPlaceholder', '请选择'),
            intl.getMessage('tableForm.selectPlaceholder', '请选择'),
          ]}
          {...compatibleBorder(plain === undefined ? true : !plain)}
          {...editorProps}
          value={dayValue}
        />
      );
    }
    if (renderFormItem) {
      return renderFormItem(text, dom);
    }
    return dom;
  }
  return null;
};

export default React.forwardRef(FieldRangePicker);
