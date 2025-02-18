import React, { useEffect, useImperativeHandle, useRef } from 'react';
import { useIntl } from '@ant-design/pro-provider';
import { Input } from 'antd';
import type { ProFieldFC } from '../../index';
// 兼容代码-----------
import 'antd/lib/input/style';

//------------

/**
 * 最基本的组件，就是个普通的 Input
 *
 * @param
 */
const FieldText: ProFieldFC<{
  text: string;
  emptyText?: React.ReactNode;
}> = ({ text, mode, render, renderFormItem, editorProps, emptyText = '-' }, ref) => {
  const { autoFocus, prefix = '', suffix = '' } = editorProps || {};

  const intl = useIntl();
  const inputRef = useRef<HTMLInputElement>();

  useImperativeHandle(ref, () => inputRef.current, []);

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  if (mode === 'read') {
    const dom = (
      <>
        {prefix}
        {text ?? emptyText}
        {suffix}
      </>
    );

    if (render) {
      return render(text, dom) ?? emptyText;
    }
    return dom;
  }
  if (mode === 'edit' || mode === 'update') {
    const placeholder = intl.getMessage('tableForm.inputPlaceholder', '请输入');
    const dom = <Input ref={inputRef} placeholder={placeholder} allowClear {...editorProps} />;

    if (renderFormItem) {
      return renderFormItem(text, dom);
    }
    return dom;
  }
  return null;
};

export default React.forwardRef(FieldText);
