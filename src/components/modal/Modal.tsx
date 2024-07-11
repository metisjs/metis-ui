import Portal from '@rc-component/portal';
import * as React from 'react';
import { RefContext } from './context';
import Dialog from './Dialog';
import type { ModalProps } from './interfaces';

const Modal: React.FC<ModalProps> = (props) => {
  const {
    visible,
    getContainer,
    forceRender,
    destroyOnClose = false,
    afterClose,
    panelRef,
  } = props;
  const [animatedVisible, setAnimatedVisible] = React.useState<boolean>(visible);

  const refContext = React.useMemo(() => ({ panel: panelRef }), [panelRef]);

  React.useEffect(() => {
    if (visible) {
      setAnimatedVisible(true);
    }
  }, [visible]);

  // Destroy on close will remove wrapped div
  if (!forceRender && destroyOnClose && !animatedVisible) {
    return null;
  }

  return (
    <RefContext.Provider value={refContext}>
      <Portal
        open={visible || forceRender || animatedVisible}
        autoDestroy={false}
        getContainer={getContainer}
        autoLock={visible || animatedVisible}
      >
        <Dialog
          {...props}
          destroyOnClose={destroyOnClose}
          afterClose={() => {
            afterClose?.();
            setAnimatedVisible(false);
          }}
        />
      </Portal>
    </RefContext.Provider>
  );
};

Modal.displayName = 'Modal';

export default Modal;
