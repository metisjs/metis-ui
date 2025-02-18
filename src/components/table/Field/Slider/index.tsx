import React from 'react';
import { Slider } from 'antd';
import type { ProFieldFC } from '../../index';
// 兼容代码-----------
import 'antd/lib/slider/style';

//------------
/**
 * 评分组件
 *
 * @param
 */
const FieldSlider: ProFieldFC<{
  text: string;
}> = ({ text, mode, render, renderFormItem, editorProps }, ref) => {
  if (mode === 'read') {
    const dom = text;
    if (render) {
      return render(text, <>{dom}</>);
    }
    return <>{dom}</>;
  }
  if (mode === 'edit' || mode === 'update') {
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
    if (renderFormItem) {
      return renderFormItem(text, dom);
    }
    return dom;
  }
  return null;
};

export default React.forwardRef(FieldSlider);
