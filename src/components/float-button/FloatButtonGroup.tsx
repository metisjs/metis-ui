import React, { useContext } from 'react';
import { DocumentTextOutline, XMarkOutline } from '@metisjs/icons';
import { clsx, mergeSemanticCls } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
import useEvent from 'rc-util/lib/hooks/useEvent';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import { useZIndex } from '../_util/hooks/useZIndex';
import { devUseWarning } from '../_util/warning';
import type { ConfigConsumerProps } from '../config-provider/context';
import { ConfigContext } from '../config-provider/context';
import Transition from '../transition';
import { FloatButtonGroupProvider } from './context';
import FloatButton, { floatButtonPrefixCls } from './FloatButton';
import type { FloatButtonGroupProps } from './interface';

const FloatButtonGroup: React.FC<Readonly<FloatButtonGroupProps>> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    style,
    shape = 'circle',
    type = 'default',
    placement = 'top',
    icon = <DocumentTextOutline />,
    closeIcon,
    description,
    trigger,
    children,
    onOpenChange,
    open: customOpen,
    onClick: onTriggerButtonClick,
    ...floatButtonProps
  } = props;

  const { getPrefixCls } = useContext<ConfigConsumerProps>(ConfigContext);

  const mergedCloseIcon = closeIcon ?? <XMarkOutline />;

  const prefixCls = getPrefixCls(floatButtonPrefixCls, customizePrefixCls);

  const groupPrefixCls = `${prefixCls}-group`;

  const isMenuMode = trigger && ['click', 'hover'].includes(trigger);
  const isValidPlacement = placement && ['top', 'left', 'right', 'bottom'].includes(placement);

  const semanticCls = useSemanticCls(className);

  const groupCls = clsx(
    groupPrefixCls,
    {
      [`${groupPrefixCls}-${shape}`]: shape,
      [`${groupPrefixCls}-${shape}-shadow`]: !isMenuMode,
      [`${groupPrefixCls}-${placement}`]: isMenuMode && isValidPlacement, // 只有菜单模式才支持弹出方向
    },
    'fixed bottom-12 end-6 z-[1000] flex h-auto min-h-10 min-w-10 flex-col items-center justify-center',
    !isMenuMode && {
      'gap-4 rounded-full': shape === 'circle',
      'divide-y divide-border-tertiary rounded-md shadow-xl outline outline-1 outline-border-tertiary first:*:rounded-t-md last:*:rounded-b-md':
        shape === 'square',
    },
    semanticCls.root,
  );

  const wrapperCls = clsx(
    `${groupPrefixCls}-wrap`,
    'absolute z-[-1] flex items-center justify-center',
    {
      'bottom-14 flex-col': placement === 'top',
      'top-14 flex-col': placement === 'bottom',
      'right-14': placement === 'left',
      'left-14': placement === 'right',
    },
    {
      'gap-4 rounded-full': shape === 'circle',
      'divide-border-tertiary rounded-md shadow-xl outline outline-1 outline-border-tertiary first:*:rounded-t-md last:*:rounded-b-md':
        shape === 'square',
    },
    shape === 'square' && {
      'divide-y': placement === 'top' || placement === 'bottom',
      'divide-x': placement === 'left' || placement === 'right',
    },
    semanticCls.wrapper,
  );

  // ============================ zIndex ============================
  const [zIndex] = useZIndex('FloatButton', style?.zIndex as number);

  const mergedStyle: React.CSSProperties = { ...style, zIndex };

  const [open, setOpen] = useMergedState(false, { value: customOpen });

  const floatButtonGroupRef = React.useRef<HTMLDivElement>(null);

  // ========================== Open ==========================
  const hoverTrigger = trigger === 'hover';
  const clickTrigger = trigger === 'click';

  const triggerOpen = useEvent((nextOpen: boolean) => {
    if (open !== nextOpen) {
      setOpen(nextOpen);
      onOpenChange?.(nextOpen);
    }
  });

  // ===================== Trigger: Hover =====================
  const onMouseEnter: React.MouseEventHandler<HTMLDivElement> = () => {
    if (hoverTrigger) {
      triggerOpen(true);
    }
  };

  const onMouseLeave: React.MouseEventHandler<HTMLDivElement> = () => {
    if (hoverTrigger) {
      triggerOpen(false);
    }
  };

  // ===================== Trigger: Click =====================
  const onInternalTriggerButtonClick: FloatButtonGroupProps['onClick'] = (e) => {
    if (clickTrigger) {
      triggerOpen(!open);
    }
    onTriggerButtonClick?.(e);
  };

  React.useEffect(() => {
    if (clickTrigger) {
      const onDocClick = (e: MouseEvent) => {
        // Skip if click on the group
        if (floatButtonGroupRef.current?.contains(e.target as Node)) {
          return;
        }
        triggerOpen(false);
      };
      document.addEventListener('click', onDocClick, { capture: true });
      return () => document.removeEventListener('click', onDocClick, { capture: true });
    }
  }, [clickTrigger]);

  // ======================== Warning =========================
  if (process.env.NODE_ENV !== 'production') {
    const warning = devUseWarning('FloatButton.Group');

    warning(
      !('open' in props) || !!trigger,
      'usage',
      '`open` need to be used together with `trigger`',
    );
  }

  const translates = {
    'translate-y-10': placement === 'top',
    '-translate-y-10': placement === 'bottom',
    'translate-x-10': placement === 'left',
    '-translate-x-10': placement === 'right',
  };

  // ========================= Render =========================
  return (
    <FloatButtonGroupProvider value={shape}>
      <div
        ref={floatButtonGroupRef}
        className={groupCls}
        style={mergedStyle}
        // Hover trigger
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {isMenuMode ? (
          <>
            <Transition
              visible={open}
              appear={false}
              enter="duration-300 ease-in-out transition-all"
              enterFrom={clsx('opacity-0', translates)}
              enterTo="opacity-100 translate-y-0 translate-x-0"
              leave="duration-300 ease-in-out transition-all"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo={clsx('opacity-0', translates)}
            >
              {({ className: transitionCls }) => (
                <div className={clsx(transitionCls, wrapperCls)}>{children}</div>
              )}
            </Transition>
            <FloatButton
              type={type}
              icon={open ? mergedCloseIcon : icon}
              description={description}
              aria-label={props['aria-label']}
              className={mergeSemanticCls(`${groupPrefixCls}-trigger`, semanticCls.trigger)}
              onClick={onInternalTriggerButtonClick}
              {...floatButtonProps}
              // @ts-ignore
              _GROUP_TRIGGER={true}
            />
          </>
        ) : (
          children
        )}
      </div>
    </FloatButtonGroupProvider>
  );
};

export default FloatButtonGroup;
