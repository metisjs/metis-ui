import React from 'react';
import type { FieldFC } from '..';
import Segmented, { normalizeOptions, type SegmentedProps } from '../../../segmented';
import Spin from '../../../spin';
import { fieldParsingOptions, fieldParsingText } from '../util';

/**
 * Segmented
 */
const FieldSegmented: FieldFC<{
  text: string;
  emptyText?: React.ReactNode;
  editorProps?: Partial<SegmentedProps>;
}> = (props, ref) => {
  const { mode, render, renderEditor, editorProps, emptyText = '-', loading, ...rest } = props;
  const options = normalizeOptions(editorProps?.options ?? []);

  if (loading) {
    return <Spin size="small" />;
  }

  if (mode === 'read') {
    const optionsValueEnum = options?.length
      ? options.reduce((pre: any, cur) => {
          return { ...pre, [(cur.value as any) ?? '']: cur.label };
        }, {})
      : undefined;

    const dom = <>{fieldParsingText(rest.text, rest.valueEnum || optionsValueEnum)}</>;

    if (render) {
      return render(rest.text, <>{dom}</>) ?? emptyText;
    }
    return dom;
  }
  if (mode === 'edit') {
    const dom = (
      <Segmented ref={ref} options={fieldParsingOptions(rest.valueEnum) ?? []} {...editorProps} />
    );

    if (renderEditor) {
      return renderEditor(rest.text, dom);
    }
    return dom;
  }
  return null;
};

export default React.forwardRef(FieldSegmented);
