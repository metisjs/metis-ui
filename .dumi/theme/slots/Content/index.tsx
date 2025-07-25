import React, { useMemo } from 'react';
import { useRouteMeta } from 'dumi';
import { clsx, Space } from 'metis-ui';
import InViewSuspense from './InViewSuspense';
import NavBreadcrumb from './NavBreadcrumb';

const DocAnchor = React.lazy(() => import('./DocAnchor'));
const Footer = React.lazy(() => import('../Footer'));
const PrevAndNext = React.lazy(() => import('../../common/PrevAndNext'));

const Content: React.FC<React.PropsWithChildren> = ({ children }) => {
  const meta = useRouteMeta();

  const debugDemos = useMemo(
    () => meta.toc?.filter((item) => item._debug_demo).map((item) => item.id) || [],
    [meta],
  );

  const showDebug = process.env.NODE_ENV === 'development';

  return (
    <div className="w-full pt-[57px]">
      <NavBreadcrumb />

      <div className="px-4 pt-6 pb-24 sm:px-6 lg:pt-10 lg:pr-10 lg:pl-82 xl:pr-81.5">
        <article className="w-full">
          {meta.frontmatter?.title ? (
            <Space block justify="space-between">
              <h1
                className={clsx(
                  'mt-2 text-3xl font-medium tracking-tight text-gray-950 dark:text-white',
                  {
                    'mb-6': meta.frontmatter.__autoDescription,
                  },
                )}
              >
                <Space>
                  <span>{meta.frontmatter?.title}</span>
                  <span>{meta.frontmatter?.subtitle}</span>
                </Space>
              </h1>
            </Space>
          ) : null}
          {!meta.frontmatter.__autoDescription && (
            <div className="mt-6 text-base/7 text-gray-700 dark:text-gray-400">
              {meta.frontmatter.description}
            </div>
          )}

          <div className="min-h-[calc(100vh-190px)]">{children}</div>
        </article>
        <DocAnchor showDebug={showDebug} debugDemos={debugDemos} />
        <InViewSuspense fallback={null}>
          <PrevAndNext />
        </InViewSuspense>
      </div>
      <Footer className="lg:pl-72" />
    </div>
  );
};

export default Content;
