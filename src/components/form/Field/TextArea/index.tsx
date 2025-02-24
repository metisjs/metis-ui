import React from 'react';
import type { FieldFC } from '..';
import type { TextAreaProps } from '../../../input';
import Input from '../../../input';

const FieldTextArea: FieldFC<{
  text: string;
  emptyText?: React.ReactNode;
  editorProps?: Partial<TextAreaProps>;
}> = (props, ref) => {
  const { text, mode, render, renderEditor, editorProps, emptyText = '-' } = props;

  if (mode === 'read') {
    const dom = <>{text ?? emptyText}</>;
    if (render) {
      return render(text, dom);
    }
    return dom;
  }
  if (mode === 'edit') {
    const dom = (
      <Input.TextArea
        ref={ref}
        rows={3}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.stopPropagation();
        }}
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

export default React.forwardRef(FieldTextArea);
