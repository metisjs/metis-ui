import React, { useEffect, useRef } from 'react';
import { Helmet, useIntl, useLocation, useOutlet, useSiteData } from 'dumi';
import Header from '../slots/Header';
import IndexLayout from './IndexLayout';
import SidebarLayout from './SidebarLayout';

const DocLayout: React.FC = () => {
  const outlet = useOutlet();
  const { formatMessage } = useIntl();
  const location = useLocation();
  const { pathname, hash } = location;
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null!);
  const { loading } = useSiteData();

  useEffect(() => {
    const nprogressHiddenStyle = document.getElementById('nprogress-style');
    timerRef.current = setTimeout(() => {
      nprogressHiddenStyle?.remove();
    }, 0);
    return () => clearTimeout(timerRef.current);
  }, []);

  // handle hash change or visit page hash from Link component, and jump after async chunk loaded
  useEffect(() => {
    const id = hash.replace('#', '');
    if (id) {
      document.getElementById(decodeURIComponent(id))?.scrollIntoView();
    }
  }, [loading, hash]);

  const content = React.useMemo<React.ReactNode>(() => {
    if (
      ['', '/'].some((path) => path === pathname) ||
      ['/index'].some((path) => pathname.startsWith(path))
    ) {
      return (
        <IndexLayout
          title={formatMessage({ id: 'app.title' })}
          desc={formatMessage({ id: 'app.description' })}
        >
          {outlet}
        </IndexLayout>
      );
    }
    return <SidebarLayout>{outlet}</SidebarLayout>;
  }, [pathname, outlet]);

  return (
    <>
      <Helmet encodeSpecialCharacters={false}>
        <meta property="og:description" content={formatMessage({ id: 'app.title' })} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/logo.png" />
      </Helmet>
      <Header />
      {content}
    </>
  );
};

export default DocLayout;
