import React from 'react';
import { Rate } from 'antd';
import type { ProFieldFC } from '../../index';
// 兼容代码-----------
import 'antd/lib/rate/style';

//------------

/**
 * 评分组件
 *
 * @param
 */
const FieldRate: ProFieldFC<{
  text: string;
}> = ({ text, mode, render, renderFormItem, editorProps }, ref) => {
  if (mode === 'read') {
    const dom = <Rate allowHalf disabled ref={ref} {...editorProps} value={text} />;
    if (render) {
      return render(text, <>{dom}</>);
    }
    return dom;
  }
  if (mode === 'edit' || mode === 'update') {
    const dom = <Rate allowHalf ref={ref} {...editorProps} />;
    if (renderFormItem) {
      return renderFormItem(text, dom);
    }
    return dom;
  }
  return null;
};

export default React.forwardRef(FieldRate);
