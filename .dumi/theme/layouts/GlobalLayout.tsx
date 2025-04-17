import React, { useCallback } from 'react';
import { useLocale, useOutlet } from 'dumi';
import { ConfigProvider } from 'metis-ui';
import zhCN from 'metis-ui/es/locale/zh_CN';
import useLayoutState from '../../hooks/useLayoutState';
import SiteContext, { SiteContextProps } from '../SiteContext';
import { ThemeName } from '../slots/Header/ThemeSwitch';

type SiteState = Omit<SiteContextProps, 'updateSiteConfig'>;

const GlobalLayout: React.FC = () => {
  const outlet = useOutlet();
  const { id } = useLocale();
  const isCN = id === 'zh-CN';

  const [{ theme }, setSiteState] = useLayoutState<SiteState>(() => ({
    theme: (localStorage.getItem('theme') as ThemeName) ?? 'system',
  }));

  const updateSiteConfig = useCallback((props: SiteState) => {
    setSiteState((prev) => ({ ...prev, ...props }));
    if (props.theme) {
      localStorage.setItem('theme', props.theme);
    }
  }, []);

  const siteContextValue = React.useMemo<SiteContextProps>(
    () => ({
      theme: theme!,
      updateSiteConfig,
    }),
    [theme, updateSiteConfig],
  );

  return (
    <SiteContext.Provider value={siteContextValue}>
      <ConfigProvider theme={theme} locale={isCN ? zhCN : undefined}>
        {outlet}
      </ConfigProvider>
    </SiteContext.Provider>
  );
};

export default GlobalLayout;
