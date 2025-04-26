import React, { useContext, type FC } from 'react';
import { ComputerDesktopOutline, MoonSparklesOutline, SunOutline } from '@metisjs/icons';
import { useIntl } from 'dumi';
import { clsx, Dropdown } from 'metis-ui';
import { MenuClickEventHandler } from 'metis-ui/es/menu/interface';
import SiteContext from '../../../theme/SiteContext';

export type ThemeName = 'system' | 'light' | 'dark';

const ICON_MAPPING = {
  light: SunOutline,
  dark: MoonSparklesOutline,
  system: ComputerDesktopOutline,
};

const ThemeSwitch: FC = () => {
  const intl = useIntl();
  const { theme, updateSiteConfig } = useContext(SiteContext);
  const Icon = ICON_MAPPING[theme];

  const onThemeChange: MenuClickEventHandler = ({ key }) => {
    updateSiteConfig({ theme: key as ThemeName });
  };

  return (
    <Dropdown
      trigger={['click']}
      menu={{
        items: (['light', 'dark', 'system'] as const).map((c) => {
          const ThemeIcon = ICON_MAPPING[c];
          return {
            key: c,
            label: intl.formatMessage({ id: `header.color.mode.${c === 'system' ? 'auto' : c}` }),
            value: c,
            icon: <ThemeIcon className="-ms-1 size-5" />,
          };
        }),
        selectable: true,
        selectedKeys: [theme],
        onClick: onThemeChange,
      }}
      className={({ open }) => clsx(open && 'text-text')}
    >
      {Icon && (
        <button className="hover:text-text flex items-center text-black/60 dark:text-gray-400">
          <Icon className="size-5" />
        </button>
      )}
    </Dropdown>
  );
};

export default ThemeSwitch;
