import React from 'react';
import type { FieldFC } from '..';
import type { CheckboxGroupProps } from '../../../checkbox';
import Checkbox from '../../../checkbox';
import Spin from '../../../spin';
import { fieldParsingOptions, fieldParsingText } from '../util';

/**
 * 多选组件
 */
const FieldCheckbox: FieldFC<{
  text: string | string[];
  editorProps?: Partial<CheckboxGroupProps>;
}> = ({ text, renderEditor, mode, render, editorProps, valueEnum, loading }, ref) => {
  const options = editorProps?.options;

  if (loading) {
    return <Spin size="small" />;
  }

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
    const dom = (
      <Checkbox.Group ref={ref} options={fieldParsingOptions(valueEnum)} {...editorProps} />
    );
    if (renderEditor) {
      return renderEditor(text, dom) ?? null;
    }
    return dom;
  }

  return null;
};

export default React.forwardRef(FieldCheckbox);
