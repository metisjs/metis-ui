import React, { useContext, useState, type FC } from 'react';
import {
  ComputerDesktopOutline,
  EllipsisVerticalOutline,
  MoonSparklesOutline,
  SunOutline,
  XMarkOutline,
} from '@metisjs/icons';
import { FormattedMessage, useLocation, useSiteData } from 'dumi';
import { clsx, Segmented } from 'metis-ui';
import Link from '../../common/Link';
import SiteContext from '../../SiteContext';
import * as utils from '../../utils';
import GithubIcon from './GithubIcon';
import LangSwitch from './LangSwitch';
import Logo from './Logo';
import Navigation from './Navigation';
import SearchBar from './SearchBar';
import ThemeSwitch, { ThemeName } from './ThemeSwitch';

const Header: FC = () => {
  const { pkg } = useSiteData();
  const { theme, updateSiteConfig } = useContext(SiteContext);
  const { pathname, search } = useLocation();
  const [showMenu, setShowMenu] = useState(false);

  const isZhCN = utils.isZhCN(pathname);
  const isHomePage =
    ['', '/'].some((path) => path === pathname) ||
    ['/index'].some((path) => pathname.startsWith(path));

  console.log(showMenu);

  return (
    <header
      className={clsx(
        'fixed inset-x-0 top-0 z-10 border-b border-gray-950/5 bg-white backdrop-blur-2xl dark:border-white/10 dark:bg-gray-950',
        isHomePage && 'bg-white/50 backdrop-blur-2xl dark:bg-gray-950/50',
      )}
    >
      <div className="flex h-14 items-center justify-between gap-8 px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Logo />
          <div
            className="text-text flex items-center gap-0.5 rounded-2xl bg-gray-950/5 py-0.5 pr-1.5 pl-2.5 text-xs/5 font-medium tabular-nums hover:bg-gray-950/7.5 dark:bg-white/10 dark:hover:bg-white/12.5"
            aria-label="Select version of library"
          >
            v{pkg.version}
          </div>
        </div>
        <div className="flex items-center gap-2.5 md:gap-6">
          {!showMenu && <SearchBar />}
          <Navigation />
          <a
            href="https://plus.metisui.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary-bg relative mx-2 -skew-x-12 rounded px-4 py-1 text-sm font-medium md:mx-0"
          >
            <span className="inline-block skew-x-12">Plus</span>
          </a>
          <div className="hidden h-6 w-px bg-gray-950/10 md:block dark:bg-white/10"></div>
          <div className="hidden items-center gap-4 md:flex">
            <LangSwitch />
            <ThemeSwitch />
            <a aria-label="GitHub repository" href="https://github.com/metisjs/metis-ui">
              <GithubIcon />
            </a>
          </div>
          <button
            type="button"
            className="relative inline-grid size-7 place-items-center rounded-md text-gray-950 hover:bg-gray-950/5 md:hidden dark:text-white dark:hover:bg-white/10"
            aria-label="Navigation"
            onClick={() => setShowMenu((prev) => !prev)}
          >
            {!showMenu ? (
              <EllipsisVerticalOutline className="size-4" />
            ) : (
              <XMarkOutline className="size-4" />
            )}
          </button>
        </div>
      </div>
      {showMenu && (
        <div className="absolute inset-0 top-[57px] z-99999 h-[calc(100vh-56px)] bg-white focus:outline-none md:hidden dark:bg-gray-950">
          <div
            className="grid grid-cols-1 gap-1 px-1 pb-1 *:rounded-lg *:px-3 *:py-2 *:text-xl/9 *:font-medium *:text-gray-950 *:data-active:bg-gray-950/5 sm:px-3 sm:pb-3 *:dark:text-white *:dark:hover:bg-white/10"
            onClick={() => setShowMenu(false)}
          >
            <Link to={utils.getLocalizedPathname('/docs/introduce', isZhCN, search)}>
              <FormattedMessage id="app.nav.docs" />
            </Link>
            <Link
              to={utils.getLocalizedPathname('/components/button', isZhCN, search)}
              className=""
            >
              <FormattedMessage id="app.nav.components" />
            </Link>
            <a href="https://github.com/metisjs/metis-ui">GitHub</a>
          </div>
          <div className="mt-4 flex items-center justify-between gap-6 px-6">
            <LangSwitch className="scale-135" />
            <Segmented
              value={theme}
              options={[
                { value: 'light', icon: <SunOutline className="size-5" /> },
                { value: 'dark', icon: <MoonSparklesOutline className="size-5" /> },
                { value: 'system', icon: <ComputerDesktopOutline className="size-5" /> },
              ]}
              onChange={(value) => {
                updateSiteConfig({ theme: value as ThemeName });
              }}
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
