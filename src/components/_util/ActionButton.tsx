import * as React from 'react';
import useState from '@rc-component/util/es/hooks/useState';
import type { ButtonProps, ButtonType } from '../button';
import Button from '../button';

export interface ActionButtonProps {
  type?: ButtonType;
  actionFn?: (...args: any[]) => any | PromiseLike<any>;
  close?: (...args: any[]) => void;
  autoFocus?: boolean;
  prefixCls: string;
  buttonProps?: ButtonProps;
  emitEvent?: boolean;
  quitOnNullishReturnValue?: boolean;
  children?: React.ReactNode;

  /**
   * Do not throw if is await mode
   */
  isSilent?: () => boolean;
}

function isThenable<T>(thing?: PromiseLike<T>): boolean {
  return !!thing?.then;
}

const ActionButton: React.FC<ActionButtonProps> = (props) => {
  const {
    type,
    children,
    prefixCls,
    buttonProps,
    close,
    autoFocus,
    emitEvent,
    isSilent,
    quitOnNullishReturnValue,
    actionFn,
  } = props;

  const clickedRef = React.useRef<boolean>(false);
  const buttonRef = React.useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const [loading, setLoading] = useState<ButtonProps['loading']>(false);

  const onInternalClose = (...args: any[]) => {
    close?.(...args);
  };

  React.useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    if (autoFocus) {
      timeoutId = setTimeout(() => {
        buttonRef.current?.focus();
      });
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  const handlePromiseOnOk = (returnValueOfOnOk?: PromiseLike<any>) => {
    if (!isThenable(returnValueOfOnOk)) {
      return;
    }
    setLoading(true);
    returnValueOfOnOk!.then(
      (...args: any[]) => {
        setLoading(false, true);
        onInternalClose(...args);
        clickedRef.current = false;
      },
      (e: Error) => {
        setLoading(false, true);
        clickedRef.current = false;

        // Do not throw if is `await` mode
        if (isSilent?.()) {
          return;
        }

        return Promise.reject(e);
      },
    );
  };

  const onClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (clickedRef.current) {
      return;
    }
    clickedRef.current = true;
    if (!actionFn) {
      onInternalClose();
      return;
    }
    let returnValueOfOnOk: PromiseLike<any>;
    if (emitEvent) {
      returnValueOfOnOk = actionFn(e);
      if (quitOnNullishReturnValue && !isThenable(returnValueOfOnOk)) {
        clickedRef.current = false;
        onInternalClose(e);
        return;
      }
    } else if (actionFn.length) {
      returnValueOfOnOk = actionFn(close);
      clickedRef.current = false;
    } else {
      returnValueOfOnOk = actionFn();
      if (!isThenable(returnValueOfOnOk)) {
        onInternalClose();
        return;
      }
    }
    handlePromiseOnOk(returnValueOfOnOk);
  };

  return (
    <Button
      type={type}
      onClick={onClick}
      loading={loading}
      prefixCls={prefixCls}
      {...buttonProps}
      ref={buttonRef}
    >
      {children}
    </Button>
  );
};

export default ActionButton;
