import * as React from 'react';
import useMemo from '@rc-component/util/es/hooks/useMemo';
import { merge } from '@rc-component/util/es/utils/set';
import dayjs from 'dayjs';
import { PREFERS_COLOR_KEY, SYS_DATA_THEME } from '../../plugin/constants';
import ValidateMessagesContext from '../form/validateMessagesContext';
import LocaleProvider, { METIS_MARK } from '../locale';
import defaultLocale from '../locale/en_US';
import type { ConfigConsumerProps, RequestConfig, RouteConfig, Variant } from './context';
import { ConfigConsumer, ConfigContext, Variants } from './context';
import type { RenderEmptyHandler } from './defaultRenderEmpty';
import { DisabledContextProvider } from './DisabledContext';
import useConfig from './hooks/useConfig';
import type { SizeType } from './SizeContext';
import { SizeContextProvider } from './SizeContext';

export type { Variant };

export { Variants };

export { ConfigConsumer, ConfigContext, type ConfigConsumerProps, type RenderEmptyHandler };

export interface ConfigProviderProps
  extends Omit<
    ConfigConsumerProps,
    'getPrefixCls' | 'themeTarget' | 'route' | 'request' | 'theme'
  > {
  prefixCls?: string;
  children?: React.ReactNode;
  componentSize?: SizeType;
  componentDisabled?: boolean;
  route?: RouteConfig;
  request?: RequestConfig;
  theme?: string | { value: string; target: React.RefObject<HTMLElement> };
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
    componentSize,
    parentContext,
    componentDisabled,
    locale,
    form,
    theme,
    ...restProps
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

  const rawTheme = !theme || typeof theme === 'string' ? theme : theme.value;
  const rawThemeTarget = !theme || typeof theme === 'string' ? null : theme.target;
  const parentTheme = parentContext.theme;

  const themeTarget = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (rawTheme) {
      let themeNode = rawThemeTarget?.current;
      if (!themeNode && !parentTheme) {
        themeNode = document.documentElement;
      }
      themeNode?.setAttribute(PREFERS_COLOR_KEY, rawTheme);
    }
  }, [rawTheme, !!parentTheme]);

  const mergedThemeTarget = rawThemeTarget ?? themeTarget;

  const baseConfig = {
    ...restProps,
    locale,
    form,
    theme: rawTheme,
    getPrefixCls,
    themeTarget: mergedThemeTarget,
  };

  const config: ConfigConsumerProps = {
    theme: SYS_DATA_THEME,
    ...parentContext,
  };

  (Object.keys(baseConfig) as (keyof typeof baseConfig)[]).forEach((key) => {
    if (baseConfig[key] !== undefined) {
      (config as any)[key] = baseConfig[key];
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

  React.useEffect(() => {
    if (locale?.locale) {
      dayjs.locale(locale.locale);
    } else {
      dayjs.locale(defaultLocale.locale);
    }
  }, [locale?.locale]);

  let childNode = <>{children}</>;

  if (rawTheme && (!rawThemeTarget || !!parentTheme)) {
    childNode = (
      <div
        ref={themeTarget}
        className={`${getPrefixCls('theme')}`}
        {...{ [PREFERS_COLOR_KEY]: rawTheme }}
      >
        {childNode}
      </div>
    );
  }

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
