import * as React from 'react';
import { clsx } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
import { DescriptionsContext, type ItemClassNameType } from '.';

function notEmpty(val: any) {
  return val !== undefined && val !== null;
}

export interface CellProps {
  itemPrefixCls: string;
  span: number;
  className?: ItemClassNameType;
  component: string;
  style?: React.CSSProperties;
  bordered?: boolean;
  label?: React.ReactNode;
  content?: React.ReactNode;
  colon?: boolean;
  type?: 'label' | 'content' | 'item';
}

const Cell: React.FC<CellProps> = (props) => {
  const {
    itemPrefixCls,
    component,
    span,
    className,
    style,
    bordered,
    label,
    content,
    colon,
    type,
  } = props;

  const Component = component as keyof JSX.IntrinsicElements;

  const { itemClassName, size } = React.useContext(DescriptionsContext);
  const semanticCls = useSemanticCls([itemClassName, className]);

  if (bordered) {
    return (
      <Component
        className={clsx(
          {
            [`${itemPrefixCls}-item-label`]: type === 'label',
            [`${itemPrefixCls}-item-content`]: type === 'content',
          },
          'border-e border-border-tertiary px-6 py-4 text-start font-normal text-text last:border-e-0',
          {
            'bg-fill-quinary text-text-secondary': type === 'label',
            'table-cell break-words [word-break:break-word]': type === 'content',
          },
          {
            'px-5 py-3': size === 'middle',
            'px-4 py-2': size === 'small',
          },
          type === 'label' && semanticCls.label,
          type === 'content' && semanticCls.content,
          semanticCls.root,
        )}
        style={style}
        colSpan={span}
      >
        {notEmpty(label) && label}
        {notEmpty(content) && content}
      </Component>
    );
  }

  return (
    <Component
      colSpan={span}
      className={clsx(
        `${itemPrefixCls}-item`,
        'pb-4 pe-4 align-top font-normal text-text group-last/row:pb-0',
        {
          'pb-3 pe-3': size === 'middle',
          'pb-2 pe-2': size === 'small',
        },
        semanticCls.root,
      )}
      style={style}
    >
      <div className="flex">
        {(label || label === 0) && (
          <span
            className={clsx(
              `${itemPrefixCls}-item-label`,
              {
                [`${itemPrefixCls}-item-no-colon`]: !colon,
              },
              'inline-flex items-baseline text-text-secondary',
              'after:relative after:me-2.5 after:ms-0.5 after:content-[":"]',
              { 'after:content-["\\a0"]': !colon },
              semanticCls.label,
            )}
          >
            {label}
          </span>
        )}
        {(content || content === 0) && (
          <span
            className={clsx(
              `${itemPrefixCls}-item-content`,
              'inline-flex min-w-4 flex-1 items-baseline break-words [word-break:break-word]',
              semanticCls.content,
            )}
          >
            {content}
          </span>
        )}
      </div>
    </Component>
  );
};

export default Cell;
