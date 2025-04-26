import type { ReactElement } from 'react';
import * as React from 'react';
import {
  CheckCircleSolid,
  ExclamationTriangleSolid,
  InformationCircleSolid,
  XCircleSolid,
} from '@metisjs/icons';
import pickAttrs from '@rc-component/util/es/pickAttrs';
import { composeRef } from '@rc-component/util/es/ref';
import type { SemanticClassName } from '@util/classNameUtils';
import { clsx } from '@util/classNameUtils';
import type { ClosableType } from '@util/hooks/useClosable';
import useClosable from '@util/hooks/useClosable';
import useSemanticCls from '@util/hooks/useSemanticCls';
import { replaceElement } from '@util/reactNode';
import { ConfigContext } from '../config-provider';
import Transition from '../transition';

export interface AlertRef {
  nativeElement: HTMLDivElement;
}

export interface AlertProps {
  /** Type of Alert styles, options:`success`, `info`, `warning`, `error` */
  type?: 'success' | 'info' | 'warning' | 'error';
  /** Whether Alert can be closed */
  closable?: ClosableType;
  /** Content of Alert */
  message?: React.ReactNode;
  /** Additional content of Alert */
  description?: React.ReactNode;
  /** Callback when close Alert */
  onClose?: React.MouseEventHandler<HTMLButtonElement>;
  /** Trigger when animation ending of Alert */
  afterClose?: () => void;
  /** Whether to show icon */
  showIcon?: boolean;
  /** https://www.w3.org/TR/2014/REC-html5-20141028/dom.html#aria-role-attribute */
  role?: string;
  style?: React.CSSProperties;
  prefixCls?: string;
  className?: SemanticClassName<{
    content?: string;
    message?: string;
    description?: string;
    action?: string;
    close?: string;
    icon?: string;
  }>;
  banner?: boolean;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  onClick?: React.MouseEventHandler<HTMLDivElement>;

  id?: string;
}

const iconMapSolid = {
  success: CheckCircleSolid,
  info: InformationCircleSolid,
  error: XCircleSolid,
  warning: ExclamationTriangleSolid,
};

interface IconNodeProps {
  type: AlertProps['type'];
  icon: AlertProps['icon'];
  className: string;
  description: AlertProps['description'];
}

const IconNode: React.FC<IconNodeProps> = (props) => {
  const { icon, className, type } = props;
  const iconType = iconMapSolid[type!] || null;
  if (icon) {
    return replaceElement(icon, <span className={className}>{icon}</span>, () => ({
      className: clsx(className, {
        [(
          icon as ReactElement<{
            className?: string;
          }>
        ).props.className!]: (
          icon as ReactElement<{
            className?: string;
          }>
        ).props.className,
      }),
    })) as ReactElement;
  }
  return React.createElement(iconType, { className });
};

type CloseIconProps = {
  closable?: ClosableType;
  className: string;
  handleClose: AlertProps['onClose'];
  ariaProps: React.AriaAttributes;
};

const CloseIconNode: React.FC<CloseIconProps> = (props) => {
  const { closable, className, handleClose, ariaProps } = props;
  const [isClosable, closeIcon] = useClosable(closable);
  return isClosable ? (
    <button type="button" onClick={handleClose} className={className} tabIndex={0} {...ariaProps}>
      {closeIcon}
    </button>
  ) : null;
};

const Alert = React.forwardRef<AlertRef, AlertProps>((props, ref) => {
  const {
    description,
    prefixCls: customizePrefixCls,
    message,
    banner,
    className,
    style,
    onMouseEnter,
    onMouseLeave,
    onClick,
    afterClose,
    showIcon,
    closable,
    action,
    id,
    ...otherProps
  } = props;

  const [closed, setClosed] = React.useState(false);

  const internalRef = React.useRef<HTMLDivElement>(null);

  React.useImperativeHandle(ref, () => ({
    nativeElement: internalRef.current!,
  }));

  const semanticCls = useSemanticCls(className, 'alert');
  const { getPrefixCls } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('alert', customizePrefixCls);

  const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    setClosed(true);
    props.onClose?.(e);
  };

  const type = React.useMemo<AlertProps['type']>(() => {
    if (props.type !== undefined) {
      return props.type;
    }
    // banner mode defaults to 'warning'
    return banner ? 'warning' : 'info';
  }, [props.type, banner]);

  // banner mode defaults to Icon
  const isShowIcon = banner && showIcon === undefined ? true : showIcon;

  const alertCls = clsx(
    prefixCls,
    `${prefixCls}-${type}`,
    {
      [`${prefixCls}-with-description`]: !!description,
      [`${prefixCls}-no-icon`]: !isShowIcon,
      [`${prefixCls}-banner`]: !!banner,
    },
    'flex gap-3 rounded-md p-4 text-sm',
    !!banner && 'rounded-none',
    {
      'bg-success-bg text-success-active': type === 'success',
      'bg-primary-bg text-primary-active': type === 'info',
      'bg-warning-bg text-warning-active': type === 'warning',
      'bg-error-bg text-error-active': type === 'error',
    },
    semanticCls.root,
  );
  const alertContentCls = clsx(`${prefixCls}-content`, 'min-w-0 flex-1', semanticCls.content);
  const alertMessageCls = clsx(
    `${prefixCls}-message`,
    !!description && 'text-base font-medium',
    semanticCls.message,
  );
  const alertDescriptionCls = clsx(
    `${prefixCls}-description`,
    'mt-2',
    {
      'text-success': type === 'success',
      'text-primary': type === 'info',
      'text-warning': type === 'warning',
      'text-error': type === 'error',
    },
    semanticCls.description,
  );
  const alertActionCls = clsx(`${prefixCls}-action`, semanticCls.action);
  const alertCloseCls = clsx(
    `${prefixCls}-close-icon`,
    '-m-1.5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-md p-1.5 text-xl leading-5',
    {
      'hover:bg-success-bg-hover': type === 'success',
      'hover:bg-primary-bg-hover': type === 'info',
      'hover:bg-warning-bg-hover': type === 'warning',
      'hover:bg-error-bg-hover': type === 'error',
    },
    semanticCls.close,
  );
  const alertIconCls = clsx(
    `${prefixCls}-icon`,
    'text-xl',
    !!description && 'text-2xl',
    {
      'text-success-hover': type === 'success',
      'text-primary-hover': type === 'info',
      'text-warning-hover': type === 'warning',
      'text-error-hover': type === 'error',
    },
    semanticCls.icon,
  );

  const restProps = pickAttrs(otherProps, { aria: true, data: true });

  const mergedAriaProps = React.useMemo<React.AriaAttributes>(() => {
    if (typeof closable === 'object') {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { closeIcon: _, ...ariaProps } = closable;
      return ariaProps;
    }
    return {};
  }, [closable]);

  return (
    <Transition
      visible={!closed}
      appear={false}
      leave="transform duration-[400ms] transition ease-in-out"
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-95"
      afterLeave={afterClose}
    >
      {({ className: transitionClassName, style: transitionStyle }, setRef) => (
        <div
          id={id}
          ref={composeRef(internalRef, setRef)}
          data-show={!closed}
          className={clsx(alertCls, transitionClassName)}
          style={{ ...style, ...transitionStyle }}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onClick={onClick}
          role="alert"
          {...restProps}
        >
          {isShowIcon ? (
            <IconNode
              description={description}
              icon={props.icon}
              className={alertIconCls}
              type={type}
            />
          ) : null}
          <div className={alertContentCls}>
            {message ? <div className={alertMessageCls}>{message}</div> : null}
            {description ? <div className={alertDescriptionCls}>{description}</div> : null}
          </div>
          {action ? <div className={alertActionCls}>{action}</div> : null}
          <CloseIconNode
            closable={closable}
            className={alertCloseCls}
            handleClose={handleClose}
            ariaProps={mergedAriaProps}
          />
        </div>
      )}
    </Transition>
  );
});

if (process.env.NODE_ENV !== 'production') {
  Alert.displayName = 'Alert';
}

export default Alert;
