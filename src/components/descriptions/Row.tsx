import * as React from 'react';
import type { InternalDescriptionsItemType } from '.';
import { clsx } from '../_util/classNameUtils';
import Cell from './Cell';

interface CellConfig {
  component: string | [string, string];
  type: 'label' | 'content' | 'item';
  showLabel?: boolean;
  showContent?: boolean;
}

function renderCells(
  items: InternalDescriptionsItemType[],
  { colon, prefixCls, bordered }: RowProps,
  { component, type, showLabel, showContent }: CellConfig,
) {
  return items.map(({ label, content, className, style, span = 1, key }, index) => {
    if (typeof component === 'string') {
      return (
        <Cell
          key={`${type}-${key || index}`}
          className={className}
          style={style}
          span={span}
          colon={colon}
          component={component}
          itemPrefixCls={prefixCls}
          bordered={bordered}
          label={showLabel ? label : null}
          content={showContent ? content : null}
          type={type}
        />
      );
    }

    return [
      <Cell
        key={`label-${key || index}`}
        className={className}
        style={style}
        span={1}
        colon={colon}
        component={component[0]}
        itemPrefixCls={prefixCls}
        bordered={bordered}
        label={label}
        type="label"
      />,
      <Cell
        key={`content-${key || index}`}
        className={className}
        style={style}
        span={span * 2 - 1}
        component={component[1]}
        itemPrefixCls={prefixCls}
        bordered={bordered}
        content={content}
        type="content"
      />,
    ];
  });
}

export interface RowProps {
  prefixCls: string;
  vertical: boolean;
  row: InternalDescriptionsItemType[];
  bordered?: boolean;
  colon: boolean;
  index: number;
  children?: React.ReactNode;
}

const Row: React.FC<RowProps> = (props) => {
  const { prefixCls, vertical, row, index, bordered } = props;

  const rowCls = clsx(`${prefixCls}-row`, 'group/row', {
    'border-b border-border-tertiary': bordered,
  });

  if (vertical) {
    return (
      <>
        <tr key={`label-${index}`} className={rowCls}>
          {renderCells(row, props, {
            component: 'th',
            type: 'label',
            showLabel: true,
          })}
        </tr>
        <tr key={`content-${index}`} className={rowCls}>
          {renderCells(row, props, {
            component: 'td',
            type: 'content',
            showContent: true,
          })}
        </tr>
      </>
    );
  }

  return (
    <tr key={index} className={rowCls}>
      {renderCells(row, props, {
        component: bordered ? ['th', 'td'] : 'td',
        type: 'item',
        showLabel: true,
        showContent: true,
      })}
    </tr>
  );
};

export default Row;
