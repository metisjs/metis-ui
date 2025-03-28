import type { CSSProperties, FC, HTMLAttributes, ReactElement, ReactNode } from 'react';
import React, { Children, useContext, useMemo } from 'react';
import { clsx, type SemanticClassName } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
import { cloneElement } from '@util/reactNode';
import { ConfigContext } from '../config-provider';
import { ListContext } from './context';

export interface ListItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  className?: SemanticClassName<{
    actions?: string;
    extra?: string;
    meta?: ListItemMetaProps['className'];
  }>;
  children?: ReactNode;
  prefixCls?: string;
  style?: CSSProperties;
  extra?: ReactNode;
  actions?: ReactNode[];
}

export interface ListItemMetaProps {
  avatar?: ReactNode;
  className?: SemanticClassName<{
    content?: string;
    title?: string;
    description?: string;
    avatar?: string;
  }>;
  children?: ReactNode;
  description?: ReactNode;
  prefixCls?: string;
  style?: CSSProperties;
  title?: ReactNode;
}

export const Meta: FC<ListItemMetaProps> = ({
  prefixCls: customizePrefixCls,
  className,
  avatar,
  title,
  description,
  ...others
}) => {
  const { getPrefixCls } = useContext(ConfigContext);
  const { metaClassName: contextClassName } = useContext(ListContext);

  const semanticCls = useSemanticCls([contextClassName, className]);

  const prefixCls = getPrefixCls('list', customizePrefixCls);

  const rootCls = clsx(`${prefixCls}-item-meta`, 'flex w-0 flex-1 gap-x-4', semanticCls.root);

  const contentCls = clsx(
    `${prefixCls}-item-meta-content`,
    'flex-1 overflow-hidden',
    semanticCls.content,
  );

  const titleCls = clsx(
    `${prefixCls}-item-meta-title`,
    'truncate font-semibold leading-6 [&_a]:text-text [&_a]:transition-colors [&_a]:hover:text-primary',
    semanticCls.title,
  );

  const descriptionCls = clsx(
    `${prefixCls}-item-meta-description truncate`,
    'mt-1 text-text-tertiary',
    semanticCls.description,
  );

  const avatarCls = clsx(
    `${prefixCls}-item-meta-avatar`,
    'inline-flex items-center',
    semanticCls.avatar,
  );

  const content = (
    <div className={contentCls}>
      {title && <h4 className={titleCls}>{title}</h4>}
      {description && <div className={descriptionCls}>{description}</div>}
    </div>
  );

  return (
    <div {...others} className={rootCls}>
      {avatar && <div className={avatarCls}>{avatar}</div>}
      {(title || description) && content}
    </div>
  );
};

const InternalItem = React.memo(
  React.forwardRef<HTMLDivElement, ListItemProps>((props, ref) => {
    const { prefixCls: customizePrefixCls, children, actions, extra, className, ...others } = props;

    const { bordered, itemClassName: contextClassName } = useContext(ListContext);
    const { getPrefixCls } = useContext(ConfigContext);
    const prefixCls = getPrefixCls('list', customizePrefixCls);

    const semanticCls = useSemanticCls(className);
    const contextSemanticCls = useSemanticCls(contextClassName);

    const isItemContainsTextNodeAndNotSingular = useMemo(() => {
      let result = false;
      Children.forEach(children as ReactElement, (element) => {
        if (typeof element === 'string') {
          result = true;
        }
      });
      return result && Children.count(children) > 1;
    }, [children]);

    const rootCls = clsx(
      `${prefixCls}-item`,
      {
        [`${prefixCls}-item-no-flex`]: !isItemContainsTextNodeAndNotSingular,
      },
      'relative flex items-center justify-between gap-x-6 py-5',
      { 'px-6': bordered },
      contextSemanticCls.root,
      semanticCls.root,
    );

    const actionsCls = clsx(
      `${prefixCls}-item-action`,
      'relative flex gap-4',
      contextSemanticCls.actions,
      semanticCls.actions,
    );

    const actionSplitCls = clsx(
      `${prefixCls}-item-action-split`,
      'absolute -end-2 top-1/2 h-3 w-px -translate-y-1/2 bg-border-secondary',
    );

    const actionsContent = actions && actions.length > 0 && (
      <ul className={actionsCls} key="actions">
        {actions.map((action: ReactNode, i: number) => (
          <li key={`${prefixCls}-item-action-${i}`} className="relative">
            {action}
            {i !== actions.length - 1 && <em className={actionSplitCls} />}
          </li>
        ))}
      </ul>
    );

    return (
      <div {...(others as any)} ref={ref} className={rootCls}>
        {[children, actionsContent, cloneElement(extra, { key: 'extra' })]}
      </div>
    );
  }),
);

export type ListItemTypeProps = typeof InternalItem & {
  Meta: typeof Meta;
};

const Item = InternalItem as ListItemTypeProps;

Item.Meta = Meta;

export default Item;
