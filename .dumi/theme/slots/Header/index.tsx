import React, { useState, type FC } from 'react';
import { useSiteData } from 'dumi';
import { clsx } from 'metis-ui';
import GithubIcon from './GithubIcon';
import LangSwitch from './LangSwitch';
import Logo from './Logo';
import Navigation from './Navigation';
import SearchBar from './SearchBar';
import ThemeSwitch from './ThemeSwitch';

const Header: FC = () => {
  const { pkg } = useSiteData();
  const { pathname } = location;
  const [showMenu, setShowMenu] = useState(false);

  const isHomePage =
    ['', '/'].some((path) => path === pathname) ||
    ['/index'].some((path) => pathname.startsWith(path));

  return (
    <header
      className={clsx(
        'fixed inset-x-0 top-0 z-10 border-b border-gray-950/5 bg-white backdrop-blur-2xl dark:border-white/10 dark:bg-gray-950',
        isHomePage && 'bg-white/50 backdrop-blur-2xl dark:bg-gray-950/50',
      )}
      onClick={() => setShowMenu(false)}
    >
      <div className="flex h-14 items-center justify-between gap-8 px-6 sm:px-4">
        <div className="flex items-center gap-4">
          <Logo />
          <div
            className="text-text flex items-center gap-0.5 rounded-2xl bg-gray-950/5 py-0.5 pr-1.5 pl-2.5 text-xs/5 font-medium tabular-nums hover:bg-gray-950/7.5 dark:bg-white/10 dark:hover:bg-white/12.5"
            aria-label="Select version of library"
          >
            v{pkg.version}
          </div>
        </div>
        <div className="hidden items-center gap-6 md:flex">
          <SearchBar />
          <Navigation />
          <div className="h-6 w-px bg-gray-950/10 dark:bg-white/10"></div>
          <div className="flex items-center gap-4">
            <LangSwitch />
            <ThemeSwitch />
            <a aria-label="GitHub repository" href="https://github.com/metisjs/metis-ui">
              <GithubIcon />
            </a>
          </div>
        </div>
        <div className="flex items-center gap-2.5 md:hidden"></div>
      </div>
    </header>
  );
};

export default Header;
