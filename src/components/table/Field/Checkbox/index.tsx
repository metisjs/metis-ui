import React from 'react';
import type { FieldFC } from '..';
import type { CheckboxGroupProps } from '../../../checkbox';
import Checkbox from '../../../checkbox';
import { fieldParsingText, objectToMap } from '../../utils/fieldUtil';

/**
 * 多选组件
 */
const FieldCheckbox: FieldFC<{
  text: string | string[];
  fieldProps?: CheckboxGroupProps;
}> = ({ text, renderEditor, mode, render, fieldProps, valueEnum }, ref) => {
  const options = fieldProps?.options;

  if (mode === 'read') {
    const optionsValueEnum = options?.length
      ? options?.reduce((pre: any, cur: any) => {
          return { ...pre, [(cur.value as any) ?? '']: cur.label };
        }, {})
      : undefined;

    const dom = fieldParsingText(text, objectToMap(valueEnum || optionsValueEnum));

    if (render) {
      return render(text, { mode, ...fieldProps }, <>{dom}</>) ?? null;
    }
    return <div className="flex flex-wrap items-center gap-3">{dom}</div>;
  }

  if (mode === 'edit') {
    const dom = <Checkbox.Group ref={ref} {...fieldProps} />;
    if (renderEditor) {
      return renderEditor(text, { mode, ...fieldProps }, dom) ?? null;
    }
    return dom;
  }

  return null;
};

export default React.forwardRef(FieldCheckbox);
