import type { ReactNode } from 'react';
import React, { useMemo } from 'react';
import type { FieldFC } from '..';
import type { InputNumberProps } from '../../../input-number';
import InputNumber from '../../../input-number';

function getRealTextWithPrecision(realValue: number, precision: number = 2) {
  return precision >= 0 ? realValue?.toFixed(precision) : realValue;
}

export function toNumber(value: any): number {
  if (typeof value === 'symbol' || value instanceof Symbol) {
    return NaN;
  }

  return Number(value);
}

/**
 * 百分比组件
 */
const FieldPercent: FieldFC<{
  prefix?: ReactNode;
  suffix?: ReactNode;
  text?: number | string;
  precision?: number;
  editorProps?: Partial<InputNumberProps>;
}> = ({ text, prefix, precision, suffix = '%', mode, render, renderEditor, editorProps }, ref) => {
  const realValue = useMemo(
    () =>
      typeof text === 'string' && (text as string).includes('%')
        ? toNumber((text as string).replace('%', ''))
        : toNumber(text),
    [text],
  );

  if (mode === 'read') {
    const dom = (
      <span ref={ref}>
        {prefix && <span>{prefix}</span>}
        {getRealTextWithPrecision(Math.abs(realValue), precision)}
        {suffix && suffix}
      </span>
    );
    if (render) {
      return render(text, dom);
    }
    return dom;
  }
  if (mode === 'edit') {
    const dom = (
      <InputNumber<number | string>
        ref={ref}
        formatter={(value) => {
          if (value && prefix) {
            return `${prefix} ${value}`.replace(/\B(?=(\d{3})+(?!\d)$)/g, ',');
          }
          return value as string;
        }}
        parser={(value) => (value ? value.replace(/.*\s|,/g, '') : '')}
        {...editorProps}
      />
    );
    if (renderEditor) {
      return renderEditor(text, dom);
    }
    return dom;
  }
  return null;
};

export default React.forwardRef(FieldPercent);
