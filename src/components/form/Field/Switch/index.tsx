import React, { useMemo } from 'react';
import type { SwitchProps } from 'metis-ui/es/switch';
import type { FieldFC } from '..';
import { useLocale } from '../../../locale';
import Spin from '../../../spin';
import Switch from '../../../switch';
import { fieldParsingText } from '../util';

/**
 * Switch 组件
 */
const FieldSwitch: FieldFC<{ text: boolean; editorProps?: Partial<SwitchProps> }> = (
  { text, mode, render, renderEditor, editorProps, valueEnum, loading },
  ref,
) => {
  const [locale] = useLocale('Switch');
  const dom = useMemo(() => {
    if (text === undefined || text === null || `${text}`.length < 1) return '-';
    return text
      ? (fieldParsingText(true, valueEnum) ??
          fieldParsingText(`true`, valueEnum) ??
          editorProps?.checkedChildren ??
          locale.open)
      : (fieldParsingText(false, valueEnum) ??
          fieldParsingText(`false`, valueEnum) ??
          editorProps?.unCheckedChildren ??
          locale.close);
  }, [editorProps?.checkedChildren, editorProps?.unCheckedChildren, text]);

  if (loading) {
    return <Spin size="small" />;
  }

  if (mode === 'read') {
    if (render) {
      return render(text, <>{dom}</>);
    }
    return dom ?? '-';
  }
  if (mode === 'edit') {
    const dom = <Switch ref={ref} {...editorProps} />;

    if (renderEditor) {
      return renderEditor(text, dom);
    }
    return dom;
  }
  return null;
};

export default React.forwardRef(FieldSwitch);
