import React from 'react';
import type { FieldFC } from '..';
import type { InputNumberProps } from '../../../input-number';
import InputNumber from '../../../input-number';

export type FieldDigitProps = {
  text: number;
  precision?: number;
  editorProps?: Partial<InputNumberProps>;
};

/**
 * 数字组件
 */
const FieldDigit: FieldFC<FieldDigitProps> = (
  { text, mode, render, renderEditor, precision, editorProps },
  ref,
) => {
  if (mode === 'read') {
    let fractionDigits = {} as Record<string, any> as any;
    if (precision || editorProps?.precision) {
      fractionDigits = {
        minimumFractionDigits: Number(precision ?? editorProps?.precision),
        maximumFractionDigits: Number(precision ?? editorProps?.precision),
      };
    }
    const digit = new Intl.NumberFormat(undefined, fractionDigits).format(Number(text) as number);

    const dom = !editorProps?.stringMode ? (
      <span ref={ref}>
        {editorProps?.formatter?.(digit, { userTyping: false, input: digit }) || digit}
      </span>
    ) : (
      <span>{text}</span>
    );

    if (render) {
      return render(text, dom);
    }
    return dom;
  }

  if (mode === 'edit') {
    const dom = <InputNumber<number | string> ref={ref} precision={precision} {...editorProps} />;
    if (renderEditor) {
      return renderEditor(text, dom);
    }
    return dom;
  }
  return null;
};

export default React.forwardRef(FieldDigit);
