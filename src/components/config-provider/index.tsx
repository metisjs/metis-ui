import * as React from 'react';
import dayjs from 'dayjs';
import useMemo from 'rc-util/es/hooks/useMemo';
import { merge } from 'rc-util/es/utils/set';
import { PREFERS_COLOR_KEY } from '../../plugin/constants';
import ValidateMessagesContext from '../form/validateMessagesContext';
import LocaleProvider, { METIS_MARK } from '../locale';
import defaultLocale from '../locale/en_US';
import type { ConfigConsumerProps, Variant } from './context';
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
const PASSED_PROPS: Exclude<keyof ConfigConsumerProps, 'getPrefixCls'>[] = [
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

export interface ConfigProviderProps extends Omit<ConfigConsumerProps, 'getPrefixCls'> {
  prefixCls?: string;
  children?: React.ReactNode;
  componentSize?: SizeType;
  componentDisabled?: boolean;
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
    affix,
    alert,
    anchor,
    button,
    form,
    locale,
    componentSize,
    space,
    splitter,
    virtual,
    popupMatchSelectWidth,
    popupOverflow,
    parentContext,
    componentDisabled,
    segmented,
    statistic,
    spin,
    calendar,
    carousel,
    cascader,
    collapse,
    checkbox,
    descriptions,
    divider,
    drawer,
    skeleton,
    steps,
    image,
    list,
    mentions,
    modal,
    progress,
    result,
    slider,
    breadcrumb,
    menu,
    pagination,
    input,
    textArea,
    empty,
    badge,
    radio,
    rate,
    switch: SWITCH,
    scrollbar,
    transfer,
    avatar,
    message,
    tag,
    table,
    card,
    tabs,
    timeline,
    upload,
    notification,
    tree,
    colorPicker,
    datePicker,
    rangePicker,
    dropdown,
    tour,
    qrCode,
    variant,
    inputNumber,
    tooltip,
    popConfirm,
    popover,
    route,
    request,
    floatButton,
    theme = 'auto',
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
    getTargetContainer,
    getPopupContainer,
    renderEmpty,
    form,
    affix,
    alert,
    anchor,
    button,
    locale,
    space,
    splitter,
    virtual,
    popupMatchSelectWidth,
    popupOverflow,
    getPrefixCls,
    segmented,
    statistic,
    spin,
    calendar,
    carousel,
    cascader,
    collapse,
    checkbox,
    descriptions,
    divider,
    drawer,
    skeleton,
    steps,
    image,
    input,
    textArea,
    list,
    mentions,
    modal,
    progress,
    result,
    scrollbar,
    slider,
    breadcrumb,
    menu,
    pagination,
    empty,
    badge,
    radio,
    rate,
    switch: SWITCH,
    transfer,
    avatar,
    message,
    tag,
    table,
    card,
    tabs,
    timeline,
    upload,
    notification,
    tree,
    colorPicker,
    datePicker,
    rangePicker,
    dropdown,
    tour,
    qrCode,
    variant,
    inputNumber,
    tooltip,
    popConfirm,
    popover,
    route,
    request,
    floatButton,
    theme,
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

  React.useEffect(() => {
    if (locale?.locale) {
      dayjs.locale(locale.locale);
    } else {
      dayjs.locale(defaultLocale.locale);
    }
  }, [locale?.locale]);

  let childNode = <>{children}</>;

  const themeTarget = React.useRef<HTMLDivElement>(null);
  if (theme !== 'auto') {
    childNode = (
      <div
        ref={themeTarget}
        className={`${getPrefixCls('theme')}`}
        {...{ [PREFERS_COLOR_KEY]: theme }}
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
