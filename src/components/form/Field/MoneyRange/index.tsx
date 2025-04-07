import React from 'react';
import { clsx, mergeSemanticCls } from '@util/classNameUtils';
import { isNil } from '@util/isNil';
import type { SafeKey } from '@util/type';
import SeparatorIcon from 'metis-ui/es/date-picker/PickerInput/Selector/SeparatorIcon';
import type { FieldFC } from '..';
import { FieldMoney } from '..';
import type { InputNumberProps } from '../../../input-number';
import type { FieldMoneyProps } from '../Money';

export type FieldMoneyRangeProps = {
  text: number[];
  editorProps?: Omit<Partial<InputNumberProps>, 'value' | 'onChange'> & {
    value?: (SafeKey | undefined)[];
    onChange?: (value?: (SafeKey | undefined)[]) => void;
  };
} & Omit<FieldMoneyProps, 'text' | 'editorProps'>;

const FieldMoneyRange: FieldFC<FieldMoneyRangeProps> = (
  { text, mode, render, renderEditor, editorProps, ...restProps },
  ref,
) => {
  const [startText, endText] = Array.isArray(text) ? text : [];

  const onValueChange = (index: number, val?: number) => {
    let newRange = editorProps?.value ? [...editorProps.value] : [];
    newRange[index] = val;

    editorProps?.onChange?.(newRange.every((item) => isNil(item)) ? [] : newRange);
  };

  const mergedCls = mergeSemanticCls(
    {
      root: clsx('bg-transparent shadow-none outline-0 focus-within:outline-0'),
      handler: clsx(
        'group-has-focus-within/range:top-[2px] group-has-focus-within/range:right-[2px] group-has-focus-within/range:bottom-[2px] group-has-focus-within/range:w-[calc(1.5rem-1px)]',
      ),
    },
    editorProps?.className,
  );

  const startDom = (
    <FieldMoney
      text={startText}
      mode={mode}
      render={render}
      renderEditor={renderEditor}
      editorProps={{
        ...editorProps,
        value: editorProps?.value?.[0],
        onChange: (value: any) => onValueChange(0, value),
        className: mergedCls,
      }}
      {...restProps}
    />
  );
  const endDom = (
    <FieldMoney
      text={endText}
      mode={mode}
      render={render}
      renderEditor={renderEditor}
      editorProps={{
        ...editorProps,
        value: editorProps?.value?.[1],
        onChange: (value: any) => onValueChange(1, value),
        className: mergedCls,
      }}
      {...restProps}
    />
  );

  if (mode === 'read') {
    const dom = (
      <div ref={ref} className="flex flex-wrap items-center gap-1">
        {startText ? startDom : '-'}
        <div>~</div>
        {endText ? endDom : '-'}
      </div>
    );

    if (render) {
      return render(text, dom);
    }
    return dom;
  }

  if (mode === 'edit') {
    const dom = (
      <div
        className={clsx(
          'flex items-center gap-2',
          'group/range bg-container outline-border focus-within:outline-primary rounded-md shadow-xs outline -outline-offset-1 focus-within:outline-2 focus-within:-outline-offset-2',
        )}
      >
        {startDom}
        <div className={clsx('text-text-quaternary flex h-6 items-center text-lg')}>
          <SeparatorIcon />
        </div>
        {endDom}
      </div>
    );
    if (renderEditor) {
      return renderEditor(text, dom);
    }
    return dom;
  }
  return null;
};

export default React.forwardRef(FieldMoneyRange);
