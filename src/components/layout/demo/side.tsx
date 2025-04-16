import React, { useState } from 'react';
import {
  CalendarOutline,
  DocumentDuplicateOutline,
  FolderOutline,
  HomeOutline,
  UsersOutline,
} from '@metisjs/icons';
import type { MenuProps } from 'metis-ui';
import { Layout, Menu } from 'metis-ui';
import ContentPlaceholder from './components/ContentPlaceholder';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Option 1', '1', <HomeOutline />),
  getItem('Option 2', '2', <CalendarOutline />),
  getItem('User', 'sub1', <DocumentDuplicateOutline />, [
    getItem('Tom', '3'),
    getItem('Bill', '4'),
    getItem('Alex', '5'),
  ]),
  getItem('Team', 'sub2', <FolderOutline />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
  getItem('Files', '9', <UsersOutline />),
];

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout className="min-h-screen">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        className="bg-gray-900"
      >
        <div className="m-4 h-8 rounded-md bg-gray-800" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
      </Sider>
      <Layout className="bg-transparent">
        <Header className="border-border-secondary border-b p-0 dark:bg-white/10" />
        <Content className="m-4 mb-0 rounded-lg p-6 dark:bg-white/10">
          <ContentPlaceholder className="h-90" />
        </Content>
        <Footer className="text-center">Metis UI ©2025 Created by Metis Lab</Footer>
      </Layout>
    </Layout>
  );
};

export default App;
