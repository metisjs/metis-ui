import React from 'react';
import { mergeSemanticCls } from '@util/classNameUtils';
import type { FieldFC } from '..';
import type { SliderSingleProps } from '../../../slider';
import Slider from '../../../slider';

/**
 * Slider组件
 */
const FieldSlider: FieldFC<{
  text: string;
  editorProps?: Partial<SliderSingleProps>;
}> = ({ text, mode, render, renderEditor, editorProps }, ref) => {
  if (mode === 'read') {
    const dom = text;
    if (render) {
      return render(text, <>{dom}</>);
    }
    return <>{dom}</>;
  }
  if (mode === 'edit') {
    const dom = (
      <Slider
        ref={ref}
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

export default React.forwardRef(FieldSlider);
