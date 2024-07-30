import {
  CalendarOutline,
  DocumentDuplicateOutline,
  FolderOutline,
  HomeOutline,
  UsersOutline,
} from '@metisjs/icons';
import type { MenuProps } from 'metis-ui';
import { Layout, Menu } from 'metis-ui';
import React, { useState } from 'react';

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
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
      </Sider>
      <Layout>
        <Header className="bg-container p-0" />
        <Content className="m-4">
          <div className="min-h-[360px] bg-container p-6">Bill is a cat.</div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Metis UI ©2023 Created by Metis</Footer>
      </Layout>
    </Layout>
  );
};

export default App;
