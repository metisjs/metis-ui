import React, { useContext, useImperativeHandle, useRef } from 'react';
import { objectToMap, proFieldParsingText, useStyle } from '@ant-design/pro-utils';
import type { RadioGroupProps } from 'antd';
import { ConfigProvider, Form, Radio, Spin } from 'antd';
import classNames from 'classnames';
import type { ProFieldFC } from '../../index';
import type { FieldSelectProps } from '../Select';
import { useFieldFetchData } from '../Select';
// 兼容代码-----------
import 'antd/lib/radio/style';

//------------

export type GroupProps = {
  options?: RadioGroupProps['options'];
  radioType?: RadioGroupProps['optionType'];
} & FieldSelectProps;

/**
 * 单选组件
 *
 * @param param0
 * @param ref
 */
const FieldRadio: ProFieldFC<GroupProps> = (
  { radioType, renderFormItem, mode, render, ...rest },
  ref,
) => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const layoutClassName = getPrefixCls('pro-field-radio');
  const [loading, options, fetchData] = useFieldFetchData(rest);
  const radioRef = useRef();
  const status = Form.Item?.useStatus?.();

  useImperativeHandle(
    ref,
    () => ({
      ...(radioRef.current || {}),
      fetchData: (keyWord: string) => fetchData(keyWord),
    }),
    [fetchData],
  );

  // css
  const { wrapSSR, hashId } = useStyle('FieldRadioRadio', (token) => {
    return {
      [`.${layoutClassName}-error`]: {
        span: {
          color: token.colorError,
        },
      },
      [`.${layoutClassName}-warning`]: {
        span: {
          color: token.colorWarning,
        },
      },
      [`.${layoutClassName}-vertical`]: {
        [`${token.antCls}-radio-wrapper`]: {
          display: 'flex',
          marginInlineEnd: 0,
        },
      },
    };
  });

  if (loading) {
    return <Spin size="small" />;
  }

  if (mode === 'read') {
    const optionsValueEnum = options?.length
      ? options?.reduce((pre: any, cur) => {
          return { ...pre, [(cur.value as any) ?? '']: cur.label };
        }, {})
      : undefined;
    const dom = (
      <>{proFieldParsingText(rest.text, objectToMap(rest.valueEnum || optionsValueEnum))}</>
    );

    if (render) {
      return render(rest.text, { mode, ...rest.editorProps }, dom) ?? null;
    }
    return dom;
  }

  if (mode === 'edit') {
    const dom = wrapSSR(
      <Radio.Group
        ref={radioRef}
        optionType={radioType}
        {...rest.editorProps}
        className={classNames(
          rest.editorProps?.className,
          {
            [`${layoutClassName}-error`]: status?.status === 'error',
            [`${layoutClassName}-warning`]: status?.status === 'warning',
          },
          hashId,
          `${layoutClassName}-${rest.editorProps.layout || 'horizontal'}`,
        )}
        options={options}
      />,
    );
    if (renderFormItem) {
      return (
        renderFormItem(rest.text, { mode, ...rest.editorProps, options, loading }, dom) ?? null
      );
    }
    return dom;
  }

  return null;
};

export default React.forwardRef(FieldRadio);
