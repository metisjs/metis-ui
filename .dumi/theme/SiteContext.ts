import * as React from 'react';
import { ThemeName } from './slots/Header/ThemeSwitch';

export interface SiteContextProps {
  theme: ThemeName;
  updateSiteConfig: (props: Partial<SiteContextProps>) => void;
}

const SiteContext = React.createContext<SiteContextProps>({
  theme: 'auto',
  updateSiteConfig: () => {},
});

export default SiteContext;
