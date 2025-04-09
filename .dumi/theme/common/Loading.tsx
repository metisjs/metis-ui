import React from 'react';
import { useLocation } from 'dumi';
import { Skeleton, Spin } from 'metis-ui';

const Loading: React.FC = () => {
  const { pathname } = useLocation();

  if (pathname.startsWith('/components') || pathname.startsWith('/docs')) {
    return (
      <div className="mx-auto mt-20 w-full max-w-[70vw] text-center">
        <Skeleton active paragraph={{ rows: 3 }} />
        <Skeleton active paragraph={{ rows: 4 }} className="mt-8" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Spin size="large" />
    </div>
  );
};

export default Loading;
