import React from 'react';
import { useIntl, useLocation } from 'dumi';
import Link from '../../theme/common/Link';
import * as utils from '../../theme/utils';

const Homepage: React.FC = () => {
  const { pathname } = useLocation();
  const intl = useIntl();

  const isZhCN = utils.isZhCN(pathname);

  return (
    <section className="text-text mt-14 px-30 pt-24 2xl:px-10 2xl:pt-16">
      <div className="relative">
        <h1 className="text-6xl font-medium tracking-tighter text-balance lg:text-4xl lg:font-normal xl:text-5xl">
          {intl.formatMessage({ id: 'app.banner.title' })}
        </h1>
        <div className="relative mt-10 sm:mt-4">
          <p className="max-w-(--breakpoint-md) px-2 text-lg/7 font-medium text-gray-600 max-sm:px-4 dark:text-gray-400">
            {intl.formatMessage({ id: 'app.banner.desc' })}
          </p>
        </div>
        <div className="relative mt-10 flex gap-4 sm:mt-4">
          <Link
            className="z-1 inline-block rounded-4xl bg-black px-4 py-2 text-sm/6 font-semibold text-white hover:bg-gray-800 max-sm:hidden dark:bg-gray-700 dark:hover:bg-gray-600"
            to={utils.getLocalizedPathname('/components/button', isZhCN)}
          >
            Get started
          </Link>
        </div>
      </div>
      <div className="text-text-quaternary bg-fill-quinary border-border-secondary mt-30 rounded-4xl border-2 border-dashed py-60 text-center text-7xl">
        文档建设中,可以先看看组件...
        <div>
          <Link
            className="z-1 inline-block rounded-4xl bg-black px-4 py-2 text-sm/6 font-semibold text-white hover:bg-gray-800 max-sm:hidden dark:bg-gray-700 dark:hover:bg-gray-600"
            to={utils.getLocalizedPathname('/components/button', isZhCN)}
          >
            Go Components
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Homepage;
