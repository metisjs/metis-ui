import React, { useContext } from 'react';
import warning from '@util/warning';
import { render as reactRender, unmount as reactUnmount } from 'rc-util/lib/React/render';
import ConfigProvider, { ConfigContext, globalConfig } from '../config-provider';
import type { ConfirmModalProps } from './ConfirmModal';
import ConfirmModal from './ConfirmModal';
import destroyFns from './destroyFns';
import type { ModalFuncProps } from './interface';
import { getConfirmLocale } from './locale';

let defaultRootPrefixCls = '';

function getRootPrefixCls() {
  return defaultRootPrefixCls;
}

type ConfigUpdate = ModalFuncProps | ((prevConfig: ModalFuncProps) => ModalFuncProps);

export type ModalFunc = (props: ModalFuncProps) => {
  destroy: () => void;
  update: (configUpdate: ConfigUpdate) => void;
};

export type ModalStaticFunctions = Record<NonNullable<ModalFuncProps['type']>, ModalFunc>;

const ConfirmModalWrapper: React.FC<ConfirmModalProps> = (props) => {
  const { prefixCls: customizePrefixCls, getContainer } = props;
  const runtimeLocale = getConfirmLocale();

  const config = useContext(ConfigContext);
  const rootPrefixCls = getRootPrefixCls() || config.getPrefixCls();
  // because Modal.config set rootPrefixCls, which is different from other components
  const prefixCls = customizePrefixCls || `${rootPrefixCls}-modal`;

  let mergedGetContainer = getContainer;
  if (mergedGetContainer === false) {
    mergedGetContainer = undefined;

    if (process.env.NODE_ENV !== 'production') {
      warning(
        false,
        'Modal',
        'Static method not support `getContainer` to be `false` since it do not have context env.',
      );
    }
  }

  return (
    <ConfirmModal
      {...props}
      rootPrefixCls={rootPrefixCls}
      prefixCls={prefixCls}
      locale={config.locale?.Modal ?? runtimeLocale}
      getContainer={mergedGetContainer}
    />
  );
};

export default function confirm(config: ModalFuncProps) {
  const global = globalConfig();

  const container = document.createDocumentFragment();
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  let currentConfig = { ...config, close, open: true } as any;
  let timeoutId: ReturnType<typeof setTimeout>;

  function destroy(...args: any[]) {
    const triggerCancel = args.some((param) => param?.triggerCancel);
    if (triggerCancel) {
      config.onCancel?.(() => {}, ...args.slice(1));
    }
    for (let i = 0; i < destroyFns.length; i++) {
      const fn = destroyFns[i];
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      if (fn === close) {
        destroyFns.splice(i, 1);
        break;
      }
    }

    reactUnmount(container);
  }

  function render(props: any) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      const rootPrefixCls = global.getPrefixCls(undefined, getRootPrefixCls());

      const dom = <ConfirmModalWrapper {...props} />;

      reactRender(
        <ConfigProvider prefixCls={rootPrefixCls}>
          {global.holderRender ? global.holderRender(dom) : dom}
        </ConfigProvider>,
        container,
      );
    });
  }

  function close(...args: any[]) {
    currentConfig = {
      ...currentConfig,
      open: false,
      afterClose: () => {
        if (typeof config.afterClose === 'function') {
          config.afterClose();
        }
        // @ts-ignore
        destroy.apply(this, args);
      },
    };

    // Legacy support
    if (currentConfig.visible) {
      delete currentConfig.visible;
    }

    render(currentConfig);
  }

  function update(configUpdate: ConfigUpdate) {
    if (typeof configUpdate === 'function') {
      currentConfig = configUpdate(currentConfig);
    } else {
      currentConfig = {
        ...currentConfig,
        ...configUpdate,
      };
    }
    render(currentConfig);
  }

  render(currentConfig);

  destroyFns.push(close);

  return {
    destroy: close,
    update,
  };
}

export function withWarn(props: ModalFuncProps): ModalFuncProps {
  return {
    ...props,
    type: 'warning',
  };
}

export function withInfo(props: ModalFuncProps): ModalFuncProps {
  return {
    ...props,
    type: 'info',
  };
}

export function withSuccess(props: ModalFuncProps): ModalFuncProps {
  return {
    ...props,
    type: 'success',
  };
}

export function withError(props: ModalFuncProps): ModalFuncProps {
  return {
    ...props,
    type: 'error',
  };
}

export function withConfirm(props: ModalFuncProps): ModalFuncProps {
  return {
    ...props,
    type: 'confirm',
  };
}

export function modalGlobalConfig({ rootPrefixCls }: { rootPrefixCls: string }) {
  warning(false, 'Modal', 'Modal.config is deprecated. Please use ConfigProvider.config instead.');
  defaultRootPrefixCls = rootPrefixCls;
}
