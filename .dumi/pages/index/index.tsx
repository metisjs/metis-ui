import React from 'react';
import { useIntl, useLocation } from 'dumi';
import Link from '../../theme/common/Link';
import * as utils from '../../theme/utils';
import ComponentsBlock from './ComponentsBlock';

const Homepage: React.FC = () => {
  const { pathname } = useLocation();
  const intl = useIntl();

  const isZhCN = utils.isZhCN(pathname);

  return (
    <div>
      <section className="text-text relative mt-14 px-30 pt-24 pb-60 2xl:px-10 2xl:pt-16">
        <div className="banner-bg"></div>
        <h1 className="max-w-[1280px] text-6xl font-medium tracking-tighter text-balance lg:text-4xl lg:font-normal xl:text-5xl">
          {intl.formatMessage({ id: 'app.banner.title' })}
        </h1>
        <div className="relative mt-10 max-w-[1280px] sm:mt-4">
          <p className="max-w-(--breakpoint-md) px-2 text-lg/7 font-medium text-gray-600 max-sm:px-4 dark:text-gray-400">
            {intl.formatMessage({ id: 'app.banner.desc' })}
          </p>
        </div>
        <div className="relative mt-10 flex gap-4 sm:mt-8 sm:flex-col">
          <Link
            className="z-1 inline-block rounded-4xl bg-black px-4 py-2 text-sm/6 font-semibold text-white hover:bg-gray-800 max-sm:hidden sm:text-center dark:bg-gray-700 dark:hover:bg-gray-600"
            to={utils.getLocalizedPathname('/components/button', isZhCN)}
          >
            Get started
          </Link>
        </div>
        <div className="mt-24 bg-gray-950/5 p-2 dark:bg-white/10">
          <div className="h-148 overflow-hidden rounded-2xl bg-gray-50 ring ring-gray-950/5 sm:h-100 dark:bg-white/5">
            <ComponentsBlock />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
