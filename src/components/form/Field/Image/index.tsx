import React from 'react';
import type { FieldFC } from '..';
import type { ImageProps } from '../../../image';
import Image from '../../../image';
import type { InputProps } from '../../../input';
import Input from '../../../input';

/**
 * 数字组件
 */
const FieldImage: FieldFC<{
  text: string;
  width?: number;
  height?: number;
  preview?: ImageProps['preview'];
  editorProps?: Partial<InputProps>;
}> = ({ text, mode, render, renderEditor, width, height, preview, editorProps }, ref) => {
  if (mode === 'read') {
    const dom = <Image width={width ?? 32} height={height} preview={preview} src={text} />;
    if (render) {
      return render(text, dom);
    }
    return dom;
  }
  if (mode === 'edit') {
    const dom = <Input ref={ref} {...editorProps} />;
    if (renderEditor) {
      return renderEditor(text, dom);
    }
    return dom;
  }
  return null;
};

export default React.forwardRef(FieldImage);
