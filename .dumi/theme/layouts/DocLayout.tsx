import React, { useEffect, useRef } from 'react';
import { Helmet, useLocation, useOutlet, useSiteData } from 'dumi';
import IndexLayout from './IndexLayout';

const locales = {
  cn: {
    title: 'Ant Design - 一套企业级 UI 设计语言和 React 组件库',
    description: '基于 Ant Design 设计体系的 React UI 组件库，用于研发企业级中后台产品。',
  },
  en: {
    title: "Ant Design - The world's second most popular React UI framework",
    description:
      'An enterprise-class UI design language and React UI library with a set of high-quality React components, one of best React UI library for enterprises',
  },
};

const DocLayout: React.FC = () => {
  const outlet = useOutlet();
  const location = useLocation();
  const { pathname, search, hash } = location;
  const [locale, lang] = useLocale(locales);
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
        <IndexLayout title={locale.title} desc={locale.description}>
          {outlet}
        </IndexLayout>
      );
    }
    return <SidebarLayout>{outlet}</SidebarLayout>;
  }, [pathname, outlet]);

  return (
    <>
      <Helmet encodeSpecialCharacters={false}>
        <html lang={lang === 'cn' ? 'zh-CN' : lang} />
        <link
          sizes="144x144"
          href="https://gw.alipayobjects.com/zos/antfincdn/UmVnt3t4T0/antd.png"
        />
        <meta property="og:description" content={locale.description} />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://gw.alipayobjects.com/zos/rmsportal/rlpTLlbMzTNYuZGGCVYM.png"
        />
      </Helmet>
      <Header />
      {content}
    </>
  );
};

export default DocLayout;
