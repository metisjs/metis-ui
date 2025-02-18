import React from 'react';
import { useIntl } from '@ant-design/pro-provider';
import { Input } from 'antd';
import omit from 'rc-util/lib/omit';
import type { ProFieldFC } from '../../index';
import FieldTextAreaReadonly from './readonly';
// 兼容代码-----------
import 'antd/lib/input/style';

//------------
/**
 * 最基本的组件，就是个普通的 Input.TextArea
 *
 * @param
 */
const FieldTextArea: ProFieldFC<{
  text: string;
}> = (props, ref) => {
  const { text, mode, render, renderFormItem, editorProps } = props;
  const intl = useIntl();

  if (mode === 'read') {
    const dom = <FieldTextAreaReadonly {...props} ref={ref} />;
    if (render) {
      return render(text, { mode, ...(omit(editorProps, ['showCount']) as any) }, dom);
    }
    return dom;
  }
  if (mode === 'edit' || mode === 'update') {
    const dom = (
      <Input.TextArea
        ref={ref}
        rows={3}
        onKeyPress={(e) => {
          if (e.key === 'Enter') e.stopPropagation();
        }}
        placeholder={intl.getMessage('tableForm.inputPlaceholder', '请输入')}
        {...editorProps}
      />
    );
    if (renderFormItem) {
      return renderFormItem(text, dom);
    }
    return dom;
  }
  return null;
};

export default React.forwardRef(FieldTextArea);
