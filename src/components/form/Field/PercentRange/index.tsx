import React from 'react';
import { clsx, mergeSemanticCls } from '@util/classNameUtils';
import { isNil } from '@util/isNil';
import type { SafeKey } from '@util/type';
import SeparatorIcon from 'metis-ui/es/date-picker/PickerInput/Selector/SeparatorIcon';
import type { FieldFC } from '..';
import { FieldPercent } from '..';
import type { InputNumberProps } from '../../../input-number';
import type { FieldPercentProps } from '../Percent';

export type FieldPercentRangeProps = {
  text: number[];
  editorProps?: Omit<Partial<InputNumberProps>, 'value' | 'onChange'> & {
    value?: (SafeKey | undefined)[];
    onChange?: (value?: (SafeKey | undefined)[]) => void;
  };
} & Omit<FieldPercentProps, 'text' | 'editorProps'>;

const FieldPercentRange: FieldFC<FieldPercentRangeProps> = (
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
      root: clsx('bg-transparent shadow-none ring-0 focus-within:ring-0'),
      handler: clsx(
        'group-has-[:focus-within]/range:bottom-[2px] group-has-[:focus-within]/range:right-[2px] group-has-[:focus-within]/range:top-[2px] group-has-[:focus-within]/range:w-[calc(1.5rem-1px)]',
      ),
    },
    editorProps?.className,
  );

  const startDom = (
    <FieldPercent
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
    <FieldPercent
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
          'group/range rounded-md bg-container shadow-sm ring-1 ring-inset ring-border focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary',
        )}
      >
        {startDom}
        <div className={clsx('flex h-6 items-center text-lg text-text-quaternary')}>
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

export default React.forwardRef(FieldPercentRange);
