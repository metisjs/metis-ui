import * as React from 'react';
import { SemanticClassName, clsx, getSemanticCls } from '../_util/classNameUtils';
import { ConfigContext } from '../config-provider';
import useSize from '../config-provider/hooks/useSize';
import Skeleton from '../skeleton';

export type CardSize = 'default' | 'small';

export interface CardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title' | 'className'> {
  prefixCls?: string;
  title?: React.ReactNode;
  extra?: React.ReactNode;
  bordered?: boolean;
  style?: React.CSSProperties;
  loading?: boolean;
  hoverable?: boolean;
  children?: React.ReactNode;
  id?: string;
  className?: SemanticClassName<'header' | 'body' | 'extra' | 'title' | 'actions' | 'cover'>;
  size?: CardSize;
  cover?: React.ReactNode;
  actions?: React.ReactNode[];
}

const ActionNode: React.FC<{
  actionClasses: string;
  actions: React.ReactNode[];
}> = (props) => {
  const { actionClasses, actions = [] } = props;
  return (
    <ul className={actionClasses}>
      {actions.map<React.ReactNode>((action, index) => {
        const key = `action-${index}`;
        return (
          <li
            className="py-3 text-center text-text-tertiary"
            style={{ width: `${100 / actions.length}%` }}
            key={key}
          >
            <span
              className={clsx(
                'relative block cursor-pointer border-r border-border-secondary hover:text-primary',
                // last item
                actions.length - 1 === index && 'border-r-0',
              )}
            >
              {action}
            </span>
          </li>
        );
      })}
    </ul>
  );
};

const Card = React.forwardRef<HTMLDivElement, CardProps>((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    extra,
    title,
    loading,
    bordered = true,
    size: customizeSize,
    cover,
    actions,
    children,
    hoverable,
    ...restProps
  } = props;

  const { getPrefixCls } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('card', customizePrefixCls);
  const semanticCLs = getSemanticCls(className);

  const loadingBlock = (
    <Skeleton loading active paragraph={{ rows: 4 }} title={false}>
      {children}
    </Skeleton>
  );

  let head: React.ReactNode;
  const mergedSize = useSize(customizeSize);

  if (title || extra) {
    const headClasses = clsx(
      `${prefixCls}-head`,
      'flex items-center justify-between border-b border-border-secondary px-6 py-4',
      semanticCLs.header,
    );
    const titleClasses = clsx(
      `${prefixCls}-head-title`,
      'flex-1 truncate text-base font-semibold',
      semanticCLs.title,
    );
    const extraClasses = clsx(`${prefixCls}-extra`, semanticCLs.extra);
    head = (
      <div className={headClasses}>
        {title && <div className={titleClasses}>{title}</div>}
        {extra && <div className={extraClasses}>{extra}</div>}
      </div>
    );
  }
  const coverClasses = clsx(`${prefixCls}-cover`, '-mx-[1px] -mt-[1px]', semanticCLs.cover);
  const coverDom = cover ? (
    <div className={coverClasses}>
      {React.isValidElement<HTMLButtonElement>(cover)
        ? React.cloneElement(cover, { className: clsx('block w-full', cover.props.className) })
        : cover}
    </div>
  ) : null;
  const bodyClasses = clsx(`${prefixCls}-body`, 'p-6', semanticCLs.body);
  const body = <div className={bodyClasses}>{loading ? loadingBlock : children}</div>;

  const actionClasses = clsx(
    `${prefixCls}-actions`,
    'flex border-t border-border-secondary',
    semanticCLs.actions,
  );
  const actionDom = actions?.length ? (
    <ActionNode actionClasses={actionClasses} actions={actions} />
  ) : null;

  const classString = clsx(
    prefixCls,
    {
      [`${prefixCls}-loading`]: loading,
      [`${prefixCls}-bordered`]: bordered,
      [`${prefixCls}-hoverable`]: hoverable,
      [`${prefixCls}-${mergedSize}`]: mergedSize,
    },
    'overflow-hidden rounded-lg border border-border-secondary bg-container text-sm text-text',
    {
      'border-0 shadow': !bordered,
      'hover:shadow-lg': hoverable,
    },
    semanticCLs.root,
  );

  return (
    <div ref={ref} {...restProps} className={classString}>
      {head}
      {coverDom}
      {body}
      {actionDom}
    </div>
  );
});

export default Card;
