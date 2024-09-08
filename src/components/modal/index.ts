import type { ModalStaticFunctions } from './confirm';
import confirm, {
  modalGlobalConfig,
  withConfirm,
  withError,
  withInfo,
  withSuccess,
} from './confirm';
import destroyFns from './destroyFns';
import type { ModalFuncProps } from './interface';
import OriginModal from './Modal';
import useModal from './useModal';

export type { ModalFuncProps, ModalLocale, ModalProps } from './interface';

type ModalType = typeof OriginModal &
  ModalStaticFunctions & {
    useModal: typeof useModal;
    destroyAll: () => void;
    config: typeof modalGlobalConfig;
  };

const Modal = OriginModal as ModalType;

Modal.useModal = useModal;

Modal.info = function infoFn(props: ModalFuncProps) {
  return confirm(withInfo(props));
};

Modal.success = function successFn(props: ModalFuncProps) {
  return confirm(withSuccess(props));
};

Modal.error = function errorFn(props: ModalFuncProps) {
  return confirm(withError(props));
};

Modal.warning = function warningFn(props: ModalFuncProps) {
  return confirm(withError(props));
};

Modal.confirm = function confirmFn(props: ModalFuncProps) {
  return confirm(withConfirm(props));
};

Modal.destroyAll = function destroyAllFn() {
  while (destroyFns.length) {
    const close = destroyFns.pop();
    if (close) {
      close();
    }
  }
};

Modal.config = modalGlobalConfig;

if (process.env.NODE_ENV !== 'production') {
  Modal.displayName = 'Modal';
}

export default Modal;
