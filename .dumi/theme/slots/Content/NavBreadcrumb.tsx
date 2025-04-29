import React, { useState } from 'react';
import { Bars3Outline } from '@metisjs/icons';
import { useIntl, useLocation, useRouteMeta } from 'dumi';
import { Breadcrumb, clsx } from 'metis-ui';
import Sidebar from '../Sidebar';

const NavBreadcrumb = () => {
  const { pathname } = useLocation();
  const { formatMessage } = useIntl();
  const { frontmatter } = useRouteMeta();

  const [showMenu, setShowMenu] = useState(false);

  let category = pathname.split('/').filter((item) => item !== '')[0];

  if (category.startsWith('changelog')) {
    category = 'docs';
  }

  return (
    <div className="sticky top-[57px] z-5 flex h-14 w-full items-center border-b border-gray-950/5 bg-white px-4 sm:px-6 lg:hidden dark:border-white/10 dark:bg-gray-950">
      <button
        type="button"
        className="relative -ml-1.5 inline-grid size-7 place-items-center rounded-md text-gray-950 hover:bg-gray-950/5 dark:text-white dark:hover:bg-white/10"
        aria-label="Open navigation menu"
        onClick={() => setShowMenu((prev) => !prev)}
      >
        <Bars3Outline className="size-5" />
      </button>
      <Breadcrumb
        items={[
          {
            title: formatMessage({ id: `app.nav.${category}` }),
          },
          {
            title: `${frontmatter.title} ${frontmatter.subtitle ?? ''}`,
          },
        ]}
        className="ml-4"
      />
      <Sidebar
        className={clsx(
          'fixed top-[114px] left-0 block h-[calc(100vh-57px-57px)] w-full bg-white dark:bg-gray-950',
          { hidden: !showMenu },
        )}
        onChange={() => setShowMenu(false)}
      />
    </div>
  );
};

export default NavBreadcrumb;
