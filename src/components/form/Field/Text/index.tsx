import type { ReactNode } from 'react';
import React from 'react';
import type { FieldFC } from '..';
import type { InputProps } from '../../../input';
import Input from '../../../input';

const FieldText: FieldFC<{
  text: string;
  emptyText?: React.ReactNode;
  prefix?: ReactNode;
  suffix?: ReactNode;
  editorProps?: Partial<InputProps>;
}> = ({ text, mode, render, renderEditor, editorProps, emptyText = '-', prefix, suffix }, ref) => {
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
  if (mode === 'edit') {
    const dom = <Input ref={ref} allowClear suffix={suffix} prefix={prefix} {...editorProps} />;

    if (renderEditor) {
      return renderEditor(text, dom);
    }
    return dom;
  }
  return null;
};

export default React.forwardRef(FieldText);
