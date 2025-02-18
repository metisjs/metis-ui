import React, { useImperativeHandle, useRef } from 'react';
import { objectToMap, proFieldParsingText } from '@ant-design/pro-utils';
import { Segmented, Spin } from 'antd';
import omit from 'rc-util/lib/omit';
import type { ProFieldFC } from '../../index';
import type { FieldSelectProps } from '../Select';
import { useFieldFetchData } from '../Select';
import 'antd/lib/segmented/style';
import 'antd/lib/spin/style';

/**
 * Segmented https://ant.design/components/segmented-cn/
 *
 * @param
 */
const FieldSegmented: ProFieldFC<
  {
    text: string;
    emptyText?: React.ReactNode;
  } & FieldSelectProps
> = (props, ref) => {
  const { mode, render, renderFormItem, editorProps, emptyText = '-', ...rest } = props;

  const inputRef = useRef<HTMLInputElement>();

  const [loading, options, fetchData] = useFieldFetchData(props);

  useImperativeHandle(
    ref,
    () => ({
      ...(inputRef.current || {}),
      fetchData: (keyWord: string) => fetchData(keyWord),
    }),
    [fetchData],
  );

  if (loading) {
    return <Spin size="small" />;
  }

  if (mode === 'read') {
    const optionsValueEnum = options?.length
      ? options?.reduce((pre: any, cur) => {
          return { ...pre, [(cur.value as any) ?? '']: cur.label };
        }, {})
      : undefined;

    const dom = (
      <>{proFieldParsingText(rest.text, objectToMap(rest.valueEnum || optionsValueEnum))}</>
    );

    if (render) {
      return render(rest.text, <>{dom}</>) ?? emptyText;
    }
    return dom;
  }
  if (mode === 'edit' || mode === 'update') {
    const dom = (
      <Segmented
        ref={inputRef}
        {...(omit(editorProps || {}, ['allowClear']) as any)}
        options={options}
      />
    );

    if (renderFormItem) {
      return renderFormItem(rest.text, { mode, ...editorProps, options, loading }, dom);
    }
    return dom;
  }
  return null;
};

export default React.forwardRef(FieldSegmented);
