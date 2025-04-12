import React from 'react';
import { EyeOutline } from '@metisjs/icons';
import omit from '@rc-component/util/es/omit';
import type { FieldFC } from '..';
import type { ImageProps } from '../../../image';
import Image from '../../../image';
import type { InputProps } from '../../../input';
import Input from '../../../input';

export type FieldImageProps = {
  text: string;
  width?: number;
  height?: number;
  preview?: ImageProps['preview'];
  editorProps?: Partial<InputProps>;
} & Partial<Omit<ImageProps, 'loading'>>;

/**
 * 数字组件
 */
const FieldImage: FieldFC<FieldImageProps> = (
  { text, mode, render, renderEditor, width = 40, editorProps, ...restProps },
  ref,
) => {
  if (mode === 'read') {
    const dom = (
      <Image
        width={width}
        src={text}
        {...omit(restProps, ['loading', 'valueEnum'])}
        preview={
          restProps.preview === false
            ? restProps.preview
            : {
                mask: <EyeOutline className="size-4" />,
                ...(restProps.preview === true ? {} : restProps.preview),
              }
        }
      />
    );
    if (render) {
      return render(text, dom);
    }
    return dom;
  }
  if (mode === 'edit') {
    const dom = <Input ref={ref} allowClear {...editorProps} />;
    if (renderEditor) {
      return renderEditor(text, dom);
    }
    return dom;
  }
  return null;
};

export default React.forwardRef(FieldImage);
