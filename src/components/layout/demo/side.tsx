/**
 * description: 侧边两列式布局。页面横向空间有限时，侧边导航可收起。<br/>侧边导航在页面布局上采用的是左右的结构，一般主导航放置于页面的左侧固定位置，辅助菜单放置于工作区顶部。内容根据浏览器终端进行自适应，能提高横向空间的使用率，但是整个页面排版不稳定。侧边导航的模式层级扩展性强，一、二、三级导航项目可以更为顺畅且具关联性的被展示，同时侧边导航可以固定，使得用户在操作和浏览中可以快速的定位和切换当前位置，有很高的操作效率。但这类导航横向页面内容的空间会被牺牲一部分。
 */

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
        <Header className="bg-neutral-bg-container p-0" />
        <Content className="m-4">
          <div className="min-h-[360px] bg-neutral-bg-container p-6">Bill is a cat.</div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Metis UI ©2023 Created by Metis</Footer>
      </Layout>
    </Layout>
  );
};

export default App;
