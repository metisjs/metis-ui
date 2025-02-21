import React from 'react';
import { EyeOutline, EyeSlashOutline } from '@metisjs/icons';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import type { FieldFC } from '..';
import type { PasswordProps } from '../../../input';
import Input from '../../../input';
import Space from '../../../space';

/**
 * 密码组件
 */
const FieldPassword: FieldFC<{
  text: string;
  open?: boolean;
  onOpenChange?: (visible: boolean) => void;
  editorProps?: Partial<PasswordProps>;
}> = ({ text, mode, render, renderEditor, editorProps, ...rest }, ref) => {
  const [open, setOpen] = useMergedState<boolean>(() => rest.open || false, {
    value: rest.open,
    onChange: rest.onOpenChange,
  });

  if (mode === 'read') {
    let dom = <>-</>;
    if (text) {
      dom = (
        <Space>
          <span ref={ref}>{open ? text : '********'}</span>
          <a onClick={() => setOpen(!open)}>{open ? <EyeOutline /> : <EyeSlashOutline />}</a>
        </Space>
      );
    }
    if (render) {
      return render(text, dom);
    }
    return dom;
  }
  if (mode === 'edit') {
    const dom = <Input.Password ref={ref} {...editorProps} />;
    if (renderEditor) {
      return renderEditor(text, dom);
    }
    return dom;
  }
  return null;
};

export default React.forwardRef(FieldPassword);
