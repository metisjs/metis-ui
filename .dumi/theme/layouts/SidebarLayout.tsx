import type { PropsWithChildren } from 'react';
import React from 'react';
import CommonHelmet from '../common/CommonHelmet';

const SidebarLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <main className="">
      <CommonHelmet />
      {children}
      {/* <Sidebar />
      <Content>{children}</Content> */}
    </main>
  );
};

export default SidebarLayout;
