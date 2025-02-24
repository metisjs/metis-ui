import React from 'react';
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
        style={{
          minWidth: 120,
          ...editorProps?.style,
        }}
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
