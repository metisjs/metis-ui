import React, { useContext } from 'react';
import { DocumentTextOutline } from '@metisjs/icons';
import omit from '@rc-component/util/es/omit';
import { clsx } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
import { useZIndex } from '../_util/hooks/useZIndex';
import { devUseWarning } from '../_util/warning';
import Badge from '../badge';
import type { ConfigConsumerProps } from '../config-provider';
import { ConfigContext } from '../config-provider';
import Tooltip from '../tooltip';
import type BackTop from './BackTop';
import FloatButtonGroupContext from './context';
import type FloatButtonGroup from './FloatButtonGroup';
import type { FloatButtonElement, FloatButtonProps, FloatButtonShape } from './interface';

export const floatButtonPrefixCls = 'float-btn';

const InternalFloatButton = React.forwardRef<FloatButtonElement, FloatButtonProps>((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    style,
    type = 'default',
    shape = 'circle',
    icon,
    description,
    tooltip,
    htmlType = 'button',
    badge = {},
    // @ts-ignore
    _GROUP_TRIGGER,
    ...restProps
  } = props;
  const { getPrefixCls } = useContext<ConfigConsumerProps>(ConfigContext);
  const groupShape = useContext<FloatButtonShape | undefined>(FloatButtonGroupContext);
  const prefixCls = getPrefixCls(floatButtonPrefixCls, customizePrefixCls);

  const mergedShape = groupShape || shape;

  const grouped = !!groupShape;

  const semanticCls = useSemanticCls(className, 'floatButton');

  const rootCls = clsx(
    prefixCls,
    `${prefixCls}-${type}`,
    `${prefixCls}-${mergedShape}`,
    'bg-container text-text outline-border-tertiary hover:bg-fill-quinary hover:text-text fixed end-6 bottom-12 z-1000 h-10 w-10 cursor-pointer text-sm shadow-xl outline backdrop-blur-2xl duration-200 empty:hidden',
    {
      'bg-primary hover:bg-primary-hover text-white outline-0 hover:text-white': type === 'primary',
    },
    {
      'rounded-full': mergedShape === 'circle',
      'h-auto min-h-10 rounded-md': mergedShape === 'square',
    },
    grouped && [
      'static',
      {
        'hover:bg-container rounded-none p-1 shadow-none outline-0 backdrop-blur-2xl':
          mergedShape === 'square' && !_GROUP_TRIGGER,
      },
    ],
    semanticCls.root,
  );

  const contentCls = clsx(
    `${prefixCls}-content`,
    'flex h-full min-h-10 w-full min-w-10 flex-col items-center justify-center p-0.5',
    grouped && {
      'hover:bg-fill-quinary min-h-8 min-w-8 rounded-sm':
        mergedShape === 'square' && !_GROUP_TRIGGER,
    },
    semanticCls.content,
  );

  const iconCls = clsx(`${prefixCls}-icon`, 'inline-flex items-center text-xl', semanticCls.icon);

  const descriptionCls = clsx(`${prefixCls}-description`, 'text-xs', semanticCls.description);

  const badgeCls = {
    root: clsx(
      !badge.dot && {
        '-end-1.5 -top-1.5 origin-center translate-x-0 translate-y-0': mergedShape === 'circle',
        '-end-2.5 -top-2.5 origin-center translate-x-0 translate-y-0': mergedShape === 'square',
      },
      badge.dot && {
        'end-1.5 top-1.5': mergedShape === 'circle',
        'end-0.5 top-0.5': mergedShape === 'square',
      },
    ),
    wrapper: 'w-full h-full',
  };

  // ============================ zIndex ============================
  const [zIndex] = useZIndex('FloatButton', style?.zIndex as number);

  const mergedStyle: React.CSSProperties = { ...style, zIndex };

  // 虽然在 ts 中已经 omit 过了，但是为了防止多余的属性被透传进来，这里再 omit 一遍，以防万一
  const badgeProps = omit(badge, ['title', 'children', 'status', 'text'] as any[]);

  let buttonNode = (
    <div className={contentCls}>
      {icon || description ? (
        <>
          {icon && <div className={iconCls}>{icon}</div>}
          {description && <div className={descriptionCls}>{description}</div>}
        </>
      ) : (
        <div className={iconCls}>
          <DocumentTextOutline />
        </div>
      )}
    </div>
  );

  if ('badge' in props) {
    buttonNode = (
      <Badge {...badgeProps} className={badgeCls}>
        {buttonNode}
      </Badge>
    );
  }

  if ('tooltip' in props) {
    buttonNode = (
      <Tooltip title={tooltip} placement="left">
        {buttonNode}
      </Tooltip>
    );
  }

  if (process.env.NODE_ENV !== 'production') {
    const warning = devUseWarning('FloatButton');

    warning(
      !(shape === 'circle' && description),
      'usage',
      'supported only when `shape` is `square`. Due to narrow space for text, short sentence is recommended.',
    );
  }

  return props.href ? (
    <a ref={ref} {...restProps} className={rootCls} style={mergedStyle}>
      {buttonNode}
    </a>
  ) : (
    // eslint-disable-next-line react/button-has-type
    <button ref={ref} {...restProps} className={rootCls} style={mergedStyle} type={htmlType}>
      {buttonNode}
    </button>
  );
});

type CompoundedComponent = typeof InternalFloatButton & {
  Group: typeof FloatButtonGroup;
  BackTop: typeof BackTop;
};

const FloatButton = InternalFloatButton as CompoundedComponent;

if (process.env.NODE_ENV !== 'production') {
  FloatButton.displayName = 'FloatButton';
}

export default FloatButton;
