import * as React from 'react';
import Portal from '@rc-component/portal';
import ContextIsolator from '@util/ContextIsolator';
import { useZIndex } from '@util/hooks/useZIndex';
import ZIndexContext from '@util/ZIndexContext';
import useLayoutEffect from 'rc-util/es/hooks/useLayoutEffect';
import { ConfigContext } from '../config-provider';
import type { DrawerProps } from './interface';
import Panel from './Panel';

const Drawer: React.FC<DrawerProps> = (props) => {
  const {
    open = false,
    prefixCls: customizedPrefixCls,
    placement = 'right',
    autoFocus = true,
    keyboard = true,
    width = 448,
    height = 448,
    mask = true,
    maskClosable = true,
    getContainer: customizeGetContainer,
    forceRender,
    afterOpenChange,
    destroyOnClose,
    ...restProps
  } = props;

  const { getPrefixCls, getPopupContainer } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('drawer', customizedPrefixCls);

  const getContainer =
    customizeGetContainer === undefined && getPopupContainer
      ? () => getPopupContainer(document.body)
      : customizeGetContainer;

  const [animatedVisible, setAnimatedVisible] = React.useState(false);

  // ============================= Open =============================
  const [mounted, setMounted] = React.useState(false);

  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  const mergedOpen = mounted ? open : false;

  // ============================ Focus =============================
  const popupRef = React.useRef<HTMLDivElement>(null);

  const lastActiveRef = React.useRef<HTMLElement>();
  useLayoutEffect(() => {
    if (mergedOpen) {
      lastActiveRef.current = document.activeElement as HTMLElement;
    }
  }, [mergedOpen]);

  // ============================= Open =============================
  const internalAfterOpenChange: DrawerProps['afterOpenChange'] = (nextVisible) => {
    setAnimatedVisible(nextVisible);
    afterOpenChange?.(nextVisible);

    if (
      !nextVisible &&
      lastActiveRef.current &&
      !popupRef.current?.contains(lastActiveRef.current)
    ) {
      lastActiveRef.current?.focus({ preventScroll: true });
    }
  };

  // ============================ zIndex ============================
  const [zIndex, contextZIndex] = useZIndex('Drawer', restProps.zIndex);

  // ============================ Render ============================
  if (!forceRender && !animatedVisible && !mergedOpen && destroyOnClose) {
    return null;
  }

  const drawerPopupProps = {
    ...restProps,
    open: mergedOpen,
    prefixCls,
    placement,
    autoFocus,
    keyboard,
    width,
    height,
    mask,
    maskClosable,
    zIndex,
    inline: getContainer === false,
    afterOpenChange: internalAfterOpenChange,
    ref: popupRef,
  };

  return (
    <ContextIsolator form space>
      <ZIndexContext.Provider value={contextZIndex}>
        <Portal
          open={mergedOpen || forceRender || animatedVisible}
          autoDestroy={false}
          getContainer={getContainer}
          autoLock={mask && (mergedOpen || animatedVisible)}
        >
          <Panel {...drawerPopupProps} />
        </Portal>
      </ZIndexContext.Provider>
    </ContextIsolator>
  );
};

if (process.env.NODE_ENV !== 'production') {
  Drawer.displayName = 'Drawer';
}

export default Drawer;
