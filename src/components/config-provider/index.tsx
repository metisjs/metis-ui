import * as React from 'react';
import useMemo from 'rc-util/lib/hooks/useMemo';
import { merge } from 'rc-util/lib/utils/set';
import ValidateMessagesContext from '../form/validateMessagesContext';
import type { Locale } from '../locale';
import LocaleProvider, { METIS_MARK } from '../locale';
import defaultLocale from '../locale/zh_CN';
import type {
  ButtonConfig,
  ConfigConsumerProps,
  FormConfig,
  InputConfig,
  PaginationConfig,
  PopupOverflow,
  RequestConfig,
  RouteConfig,
  SpaceConfig,
  Variant,
} from './context';
import { ConfigConsumer, ConfigContext, Variants } from './context';
import type { RenderEmptyHandler } from './defaultRenderEmpty';
import { DisabledContextProvider } from './DisabledContext';
import useConfig from './hooks/useConfig';
import type { SizeType } from './SizeContext';
import { SizeContextProvider } from './SizeContext';

export type { Variant };

export { Variants };

export { ConfigConsumer, ConfigContext, type ConfigConsumerProps, type RenderEmptyHandler };

// These props is used by `useContext` directly in sub component
const PASSED_PROPS: Exclude<keyof ConfigConsumerProps, 'rootPrefixCls' | 'getPrefixCls'>[] = [
  'getTargetContainer',
  'getPopupContainer',
  'renderEmpty',
  'button',
  'input',
  'pagination',
  'route',
  'request',
  'form',
];

export interface ConfigProviderProps {
  getTargetContainer?: () => HTMLElement | Window;
  getPopupContainer?: (triggerNode?: HTMLElement) => HTMLElement;
  prefixCls?: string;
  children?: React.ReactNode;
  renderEmpty?: RenderEmptyHandler;
  variant?: Variant;
  form?: FormConfig;
  button?: ButtonConfig;
  input?: InputConfig;
  pagination?: PaginationConfig;
  locale?: Locale;
  componentSize?: SizeType;
  componentDisabled?: boolean;
  space?: SpaceConfig;
  /**
   * @descCN 设置 `false` 时关闭虚拟滚动。
   * @descEN Close the virtual scrolling when setting `false`.
   * @default true
   */
  virtual?: boolean;
  popupMatchSelectWidth?: boolean;
  popupOverflow?: PopupOverflow;
  route?: RouteConfig;
  request?: RequestConfig;
}

interface ProviderChildrenProps extends ConfigProviderProps {
  parentContext: ConfigConsumerProps;
}

type holderRenderType = (children: React.ReactNode) => React.ReactNode;

export const defaultPrefixCls = 'metis';

let globalPrefixCls: string;
let globalHolderRender: holderRenderType | undefined;

function getGlobalPrefixCls() {
  return globalPrefixCls || defaultPrefixCls;
}

interface GlobalConfigProps {
  prefixCls?: string;
  holderRender?: holderRenderType;
}

const setGlobalConfig = (props: GlobalConfigProps) => {
  const { prefixCls, holderRender } = props;
  if (prefixCls !== undefined) {
    globalPrefixCls = prefixCls;
  }
  if ('holderRender' in props) {
    globalHolderRender = holderRender;
  }
};

export const globalConfig = () => ({
  getPrefixCls: (suffixCls?: string, customizePrefixCls?: string) => {
    if (customizePrefixCls) {
      return customizePrefixCls;
    }
    return suffixCls ? `${getGlobalPrefixCls()}-${suffixCls}` : getGlobalPrefixCls();
  },
  getRootPrefixCls: () => {
    // If Global prefixCls provided, use this
    if (globalPrefixCls) {
      return globalPrefixCls;
    }

    // Fallback to default prefixCls
    return getGlobalPrefixCls();
  },
  holderRender: globalHolderRender,
});

const ProviderChildren: React.FC<ProviderChildrenProps> = (props) => {
  const {
    children,
    locale,
    componentSize,
    space,
    virtual,
    popupMatchSelectWidth,
    popupOverflow,
    parentContext,
    componentDisabled,
    pagination,
    button,
    input,
    variant,
    route,
    request,
    form,
  } = props;

  // =================================== Context ===================================
  const getPrefixCls = React.useCallback(
    (suffixCls: string, customizePrefixCls?: string) => {
      const { prefixCls } = props;

      if (customizePrefixCls) {
        return customizePrefixCls;
      }

      const mergedPrefixCls = prefixCls || parentContext.getPrefixCls('');

      return suffixCls ? `${mergedPrefixCls}-${suffixCls}` : mergedPrefixCls;
    },
    [parentContext.getPrefixCls, props.prefixCls],
  );

  const baseConfig = {
    locale,
    space,
    virtual,
    popupMatchSelectWidth: popupMatchSelectWidth,
    popupOverflow,
    getPrefixCls,
    button,
    input,
    pagination,
    variant,
    route,
    request,
    form,
  };

  const config: ConfigConsumerProps = {
    ...parentContext,
  };

  (Object.keys(baseConfig) as (keyof typeof baseConfig)[]).forEach((key) => {
    if (baseConfig[key] !== undefined) {
      (config as any)[key] = baseConfig[key];
    }
  });

  // Pass the props used by `useContext` directly with child component.
  // These props should merged into `config`.
  PASSED_PROPS.forEach((propName) => {
    const propValue = props[propName];
    if (propValue) {
      (config as any)[propName] = propValue;
    }
  });

  const memoedConfig = useMemo(
    () => config,
    config,
    (prevConfig, currentConfig) => {
      const prevKeys = Object.keys(prevConfig) as Array<keyof typeof config>;
      const currentKeys = Object.keys(currentConfig) as Array<keyof typeof config>;
      return (
        prevKeys.length !== currentKeys.length ||
        prevKeys.some((key) => prevConfig[key] !== currentConfig[key])
      );
    },
  );

  let childNode = <>{children}</>;

  const validateMessages = React.useMemo(
    () =>
      merge(
        defaultLocale.Form?.defaultValidateMessages || {},
        memoedConfig.locale?.Form?.defaultValidateMessages || {},
        memoedConfig.form?.validateMessages || {},
        form?.validateMessages || {},
      ),
    [memoedConfig, form?.validateMessages],
  );

  if (Object.keys(validateMessages).length > 0) {
    childNode = (
      <ValidateMessagesContext.Provider value={validateMessages}>
        {childNode}
      </ValidateMessagesContext.Provider>
    );
  }

  if (locale) {
    childNode = (
      <LocaleProvider locale={locale} _METIS_MARK__={METIS_MARK}>
        {childNode}
      </LocaleProvider>
    );
  }

  if (componentSize) {
    childNode = <SizeContextProvider size={componentSize}>{childNode}</SizeContextProvider>;
  }

  // =================================== Render ===================================
  if (componentDisabled !== undefined) {
    childNode = (
      <DisabledContextProvider disabled={componentDisabled}>{childNode}</DisabledContextProvider>
    );
  }

  return <ConfigContext.Provider value={memoedConfig}>{childNode}</ConfigContext.Provider>;
};

const ConfigProvider: React.FC<ConfigProviderProps> & {
  /** @private internal Usage. do not use in your production */
  ConfigContext: typeof ConfigContext;
  config: typeof setGlobalConfig;
  useConfig: typeof useConfig;
} = (props) => {
  const context = React.useContext<ConfigConsumerProps>(ConfigContext);
  return <ProviderChildren parentContext={context} {...props} />;
};

ConfigProvider.ConfigContext = ConfigContext;
ConfigProvider.config = setGlobalConfig;
ConfigProvider.useConfig = useConfig;

if (process.env.NODE_ENV !== 'production') {
  ConfigProvider.displayName = 'ConfigProvider';
}

export default ConfigProvider;
