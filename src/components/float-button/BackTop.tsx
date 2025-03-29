import React, { useContext, useEffect, useState } from 'react';
import { ChevronUpOutline } from '@metisjs/icons';
import { clsx } from '@util/classNameUtils';
import { getScroll, scrollTo } from '@util/scroll';
import { composeRef } from 'rc-util/es/ref';
import throttleByAnimationFrame from '../_util/throttleByAnimationFrame';
import type { ConfigConsumerProps } from '../config-provider';
import { ConfigContext } from '../config-provider';
import Transition from '../transition';
import FloatButtonGroupContext from './context';
import FloatButton, { floatButtonPrefixCls } from './FloatButton';
import type {
  BackTopProps,
  FloatButtonElement,
  FloatButtonProps,
  FloatButtonRef,
  FloatButtonShape,
} from './interface';

const BackTop = React.forwardRef<FloatButtonRef, BackTopProps>((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    type = 'default',
    shape = 'circle',
    visibilityHeight = 400,
    icon = <ChevronUpOutline />,
    target,
    onClick,
    duration = 450,
    ...restProps
  } = props;

  const [visible, setVisible] = useState<boolean>(visibilityHeight === 0);

  const internalRef = React.useRef<FloatButtonRef['nativeElement']>(null);

  React.useImperativeHandle(ref, () => ({
    nativeElement: internalRef.current,
  }));

  const getDefaultTarget = (): HTMLElement | Document | Window =>
    internalRef.current?.ownerDocument || window;

  const handleScroll = throttleByAnimationFrame(
    (e: React.UIEvent<HTMLElement, UIEvent> | { target: any }) => {
      const scrollTop = getScroll(e.target);
      setVisible(scrollTop >= visibilityHeight);
    },
  );

  useEffect(() => {
    const getTarget = target || getDefaultTarget;
    const container = getTarget();
    handleScroll({ target: container });
    container?.addEventListener('scroll', handleScroll);
    return () => {
      handleScroll.cancel();
      container?.removeEventListener('scroll', handleScroll);
    };
  }, [target]);

  const scrollToTop: React.MouseEventHandler<FloatButtonElement> = (e) => {
    scrollTo(0, { getContainer: target || getDefaultTarget, duration });
    onClick?.(e);
  };

  const { getPrefixCls } = useContext<ConfigConsumerProps>(ConfigContext);

  const prefixCls = getPrefixCls(floatButtonPrefixCls, customizePrefixCls);

  const groupShape = useContext<FloatButtonShape | undefined>(FloatButtonGroupContext);

  const mergedShape = groupShape || shape;

  const contentProps: FloatButtonProps = {
    prefixCls,
    icon,
    type,
    shape: mergedShape,
    ...restProps,
  };

  return (
    <Transition
      visible={visible}
      appear
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      {({ className: transitionCls }, setRef) => (
        <FloatButton
          ref={composeRef(internalRef, setRef)}
          {...contentProps}
          onClick={scrollToTop}
          className={clsx(className, transitionCls)}
        />
      )}
    </Transition>
  );
});

if (process.env.NODE_ENV !== 'production') {
  BackTop.displayName = 'BackTop';
}

export default BackTop;
