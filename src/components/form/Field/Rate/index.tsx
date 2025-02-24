import React from 'react';
import type { FieldFC } from '..';
import type { RateProps } from '../../../rate';
import Rate from '../../../rate';

/**
 * 评分组件
 */
const FieldRate: FieldFC<{
  text: number;
  editorProps?: Partial<RateProps>;
}> = ({ text, mode, render, renderEditor, editorProps }, ref) => {
  if (mode === 'read') {
    const dom = <Rate allowHalf disabled ref={ref} {...editorProps} value={text} />;
    if (render) {
      return render(text, <>{dom}</>);
    }
    return dom;
  }
  if (mode === 'edit') {
    const dom = <Rate allowHalf ref={ref} {...editorProps} />;
    if (renderEditor) {
      return renderEditor(text, dom);
    }
    return dom;
  }
  return null;
};

export default React.forwardRef(FieldRate);
