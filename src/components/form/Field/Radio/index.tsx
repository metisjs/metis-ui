import React from 'react';
import type { FieldFC } from '..';
import type { RadioGroupProps } from '../../../radio';
import Radio from '../../../radio';
import { fieldParsingOptions, fieldParsingText } from '../util';

/**
 * 单选组件
 */
const FieldRadio: FieldFC<{
  text: string | number;
  editorProps?: Partial<RadioGroupProps>;
}> = ({ text, renderEditor, mode, render, editorProps, valueEnum }, ref) => {
  const options = editorProps?.options;

  if (mode === 'read') {
    const optionsValueEnum = options?.length
      ? options?.reduce((pre: any, cur: any) => {
          return { ...pre, [(cur.value as any) ?? '']: cur.label };
        }, {})
      : undefined;

    const dom = fieldParsingText(text, valueEnum || optionsValueEnum);

    if (render) {
      return render(text, <>{dom}</>) ?? null;
    }
    return <div className="flex flex-wrap items-center gap-3">{dom}</div>;
  }

  if (mode === 'edit') {
    const dom = <Radio.Group ref={ref} options={fieldParsingOptions(valueEnum)} {...editorProps} />;
    if (renderEditor) {
      return renderEditor(text, dom) ?? null;
    }
    return dom;
  }

  return null;
};

export default React.forwardRef(FieldRadio);
