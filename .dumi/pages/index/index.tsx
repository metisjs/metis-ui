import React from 'react';
import { FormattedMessage, useIntl, useLocation } from 'dumi';
import Link from '../../theme/common/Link';
import * as utils from '../../theme/utils';
import ComponentsBlock from './ComponentsBlock';

const Homepage: React.FC = () => {
  const { pathname } = useLocation();
  const intl = useIntl();

  const isZhCN = utils.isZhCN(pathname);

  return (
    <div>
      <section className="text-text relative px-10 pt-30 pb-60 2xl:px-30 2xl:pt-38">
        <div className="banner-bg"></div>
        <h1 className="max-w-[1280px] text-3xl tracking-tighter text-balance max-lg:font-medium max-sm:px-4 sm:text-4xl lg:text-5xl xl:text-7xl">
          {intl.formatMessage({ id: 'app.banner.title' })}
        </h1>
        <div className="relative mt-10 max-w-[1280px] sm:mt-4">
          <p className="max-w-(--breakpoint-md) px-2 text-lg/7 font-medium text-gray-600 max-sm:px-4 dark:text-gray-400">
            {intl.formatMessage({ id: 'app.banner.desc' })}
          </p>
        </div>
        <div className="relative mt-8 flex flex-col gap-4 sm:mt-10 sm:flex-row">
          <Link
            className="z-1 inline-block rounded-4xl bg-black px-6 py-3 text-lg/6 font-semibold text-white hover:bg-gray-800 sm:text-center dark:bg-gray-700 dark:hover:bg-gray-600"
            to={utils.getLocalizedPathname('/docs/introduce', isZhCN)}
          >
            <FormattedMessage id="app.home.getting-started" />
          </Link>
        </div>
        <div className="mt-24 bg-gray-950/5 p-2 dark:bg-white/10">
          <div className="relative h-100 overflow-hidden rounded-2xl bg-gray-100 ring ring-gray-950/5 sm:h-148 dark:bg-white/5">
            <ComponentsBlock />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
