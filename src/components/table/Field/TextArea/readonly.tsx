import React, { useContext } from 'react';
import { useStyle } from '@ant-design/pro-utils';
import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import type { ProFieldFC } from '../../index';
// 兼容代码-----------
import 'antd/lib/input/style';
import omit from 'rc-util/lib/omit';

//------------

/**
 * Input.TextArea 只读模式时渲染的组件
 *
 * @param
 */
const FieldTextAreaReadonly: ProFieldFC<{
  text: string;
}> = ({ text, editorProps }, ref) => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const readonlyClassName = getPrefixCls('pro-field-readonly');
  const compClassName = `${readonlyClassName}-textarea`;

  const { wrapSSR, hashId } = useStyle('TextArea', () => {
    return {
      [`.${compClassName}`]: {
        display: 'inline-block',
        lineHeight: '1.5715',
        maxWidth: '100%',
        whiteSpace: 'pre-wrap',
      },
    };
  });

  return wrapSSR(
    <span
      ref={ref}
      className={classNames(hashId, readonlyClassName, compClassName)}
      {...omit(editorProps, ['autoSize', 'classNames', 'styles'])}
    >
      {text ?? '-'}
    </span>,
  );
};

export default React.forwardRef(FieldTextAreaReadonly);
