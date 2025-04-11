import type { PropsWithChildren } from 'react';
import React from 'react';
import CommonHelmet from '../common/CommonHelmet';
import Content from '../slots/Content';
import Sidebar from '../slots/Sidebar';

const SidebarLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <main className="text-text relative flex text-sm">
      <CommonHelmet />
      <Sidebar />
      <Content>{children}</Content>
    </main>
  );
};

export default SidebarLayout;
