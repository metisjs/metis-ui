import React, { useMemo } from 'react';
import { mergeSemanticCls } from '@util/classNameUtils';
import omit from 'rc-util/lib/omit';
import type { FieldFC } from '..';
import type { InputNumberProps } from '../../../input-number';
import InputNumber from '../../../input-number';
import type { ProgressProps } from '../../../progress';
import Progress from '../../../progress';
import { toNumber } from '../Percent';

export type FieldProgressProps = {
  text: number | string;
  editorProps?: Partial<InputNumberProps>;
} & Partial<Omit<ProgressProps, 'type'>>;

export function getProgressStatus(text: number): ProgressProps['status'] {
  if (text === 100) {
    return 'success';
  }
  if (text < 0) {
    return 'exception';
  }
  if (text < 100) {
    return 'active';
  }

  return 'normal';
}

/**
 * 进度条组件
 *
 * @param
 */
const FieldProgress: FieldFC<FieldProgressProps> = (
  { text, mode, status, render, renderEditor, editorProps, ...restProps },
  ref,
) => {
  const realValue = useMemo(
    () =>
      typeof text === 'string' && (text as string).includes('%')
        ? toNumber((text as string).replace('%', ''))
        : toNumber(text),
    [text],
  );
  if (mode === 'read') {
    const dom = (
      <Progress
        ref={ref}
        size="small"
        style={{ minWidth: 100, maxWidth: 320 }}
        percent={realValue}
        status={status ?? getProgressStatus(realValue as number)}
        {...omit(restProps, ['valueEnum', 'loading'])}
      />
    );
    if (render) {
      return render(realValue, dom);
    }
    return dom;
  }

  if (mode === 'edit') {
    const dom = (
      <InputNumber
        ref={ref}
        suffix="%"
        value={realValue}
        {...editorProps}
        className={mergeSemanticCls('w-full', editorProps?.className)}
      />
    );
    if (renderEditor) {
      return renderEditor(text, dom);
    }
    return dom;
  }
  return null;
};

export default React.forwardRef(FieldProgress);
