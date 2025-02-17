﻿import type { CSSProperties, ReactNode } from 'react';
import React from 'react';
import Badge from '../../badge';
import Space from '../../space';
import type { ColumnValueEnumMap, ColumnValueEnumObj } from '../interface';

/**
 * 获取类型的 type
 *
 * @param obj
 */
function getType(obj: any) {
  // @ts-ignore
  const type = Object.prototype.toString
    .call(obj)
    .match(/^\[object (.*)\]$/)[1]
    .toLowerCase();
  if (type === 'string' && typeof obj === 'object') return 'object'; // Let "new String('')" return 'object'
  if (obj === null) return 'null'; // PhantomJS has type "DOMWindow" for null
  if (obj === undefined) return 'undefined'; // PhantomJS has type "DOMWindow" for undefined
  return type;
}

type StatusProps = {
  className?: string;
  style?: CSSProperties;
  children?: React.ReactNode;
};

export const FieldBadgeColor: React.FC<StatusProps & { color: string }> = ({ color, children }) => (
  <Badge color={color} text={children} />
);

export const objectToMap = (
  value: ColumnValueEnumMap | ColumnValueEnumObj | undefined,
): ColumnValueEnumMap => {
  if (getType(value) === 'map') {
    return value as ColumnValueEnumMap;
  }
  return new Map(Object.entries(value || {}));
};

const FieldStatus: {
  success: React.FC<StatusProps>;
  error: React.FC<StatusProps>;
  processing: React.FC<StatusProps>;
  default: React.FC<StatusProps>;
  warning: React.FC<StatusProps>;
} = {
  success: ({ children }) => <Badge status="success" text={children} />,
  error: ({ children }) => <Badge status="error" text={children} />,
  default: ({ children }) => <Badge status="default" text={children} />,
  processing: ({ children }) => <Badge status="processing" text={children} />,
  warning: ({ children }) => <Badge status="warning" text={children} />,
};

type FieldStatusType = 'success' | 'warning' | 'error' | 'default' | 'processing';

/**
 * 转化 text 和 valueEnum 通过 type 来添加 Status
 *
 * @param text
 * @param valueEnum
 */
export const fieldParsingText = (
  text: string | number | (string | number)[],
  valueEnumParams: ColumnValueEnumMap | ColumnValueEnumObj,
  key?: number | string,
): React.ReactNode => {
  if (Array.isArray(text)) {
    return (
      <Space key={key} split="," size={2} wrap>
        {text.map((value, index) =>
          // @ts-ignore
          fieldParsingText(value, valueEnumParams, index),
        )}
      </Space>
    );
  }

  const valueEnum = objectToMap(valueEnumParams);

  if (!valueEnum.has(text) && !valueEnum.has(`${text}`)) {
    // @ts-ignore
    return text?.label || text;
  }

  const domText = (valueEnum.get(text) || valueEnum.get(`${text}`)) as unknown as {
    text: ReactNode;
    status: FieldStatusType;
    color?: string;
  };

  if (!domText) {
    // @ts-ignore
    return <React.Fragment key={key}>{text?.label || text}</React.Fragment>;
  }

  const { status, color } = domText;

  const Status = FieldStatus[status];
  if (Status) {
    return <Status key={key}>{domText.text}</Status>;
  }

  if (color) {
    return (
      <FieldBadgeColor key={key} color={color}>
        {domText.text}
      </FieldBadgeColor>
    );
  }

  return (
    <React.Fragment key={key}>{domText.text || (domText as any as React.ReactNode)}</React.Fragment>
  );
};
