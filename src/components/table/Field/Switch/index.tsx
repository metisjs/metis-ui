import React, { useMemo } from 'react';
import { useIntl } from '@ant-design/pro-provider';
// 兼容代码-----------
import { FieldLabel } from '@ant-design/pro-utils';
import type { SwitchProps } from 'antd';
import { Switch } from 'antd';
import omit from 'rc-util/lib/omit';
import type { ProFieldFC } from '../../index';
import 'antd/lib/switch/style';

//------------

/**
 * 评分组件
 *
 * @param
 */
const FieldSwitch: ProFieldFC<{ text: boolean; editorProps?: SwitchProps }> = (
  { text, mode, render, light, label, renderFormItem, editorProps },
  ref,
) => {
  const intl = useIntl();
  const dom = useMemo(() => {
    if (text === undefined || text === null || `${text}`.length < 1) return '-';
    return text
      ? (editorProps?.checkedChildren ?? intl.getMessage('switch.open', '打开'))
      : (editorProps?.unCheckedChildren ?? intl.getMessage('switch.close', '关闭'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorProps?.checkedChildren, editorProps?.unCheckedChildren, text]);

  if (mode === 'read') {
    if (render) {
      return render(text, <>{dom}</>);
    }
    return dom ?? '-';
  }
  if (mode === 'edit' || mode === 'update') {
    const editDom = (
      <Switch
        ref={ref}
        size={light ? 'small' : undefined}
        {...omit(editorProps, ['value'])}
        checked={editorProps?.checked ?? editorProps?.value}
      />
    );
    if (light) {
      const { disabled, bordered } = editorProps;
      return (
        <FieldLabel
          label={label}
          disabled={disabled}
          bordered={bordered}
          downIcon={false}
          value={
            <div
              style={{
                paddingLeft: 8,
              }}
            >
              {editDom}
            </div>
          }
          allowClear={false}
        />
      );
    }

    if (renderFormItem) {
      return renderFormItem(text, editDom);
    }
    return editDom;
  }
  return null;
};

export default React.forwardRef(FieldSwitch);
