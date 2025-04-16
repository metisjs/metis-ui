import React from 'react';
import {
  BookmarkOutline,
  BugAntOutline,
  CalendarOutline,
  DocumentDuplicateOutline,
  FilmOutline,
  FolderOutline,
  HomeOutline,
  UsersOutline,
} from '@metisjs/icons';
import type { MenuProps } from 'metis-ui';
import { Layout, Menu } from 'metis-ui';
import ContentPlaceholder from './components/ContentPlaceholder';

const { Header, Content, Footer, Sider } = Layout;

const items: MenuProps['items'] = [
  HomeOutline,
  CalendarOutline,
  BookmarkOutline,
  DocumentDuplicateOutline,
  FolderOutline,
  UsersOutline,
  BugAntOutline,
  FilmOutline,
].map((icon, index) => ({
  key: String(index + 1),
  icon: React.createElement(icon),
  label: `nav ${index + 1}`,
}));

const App: React.FC = () => {
  return (
    <Layout hasSider className="bg-gray-50 dark:bg-gray-950">
      <Sider className="sticky top-0 bottom-0 left-0 h-screen overflow-auto bg-gray-900">
        <div className="m-4 h-8 rounded-md bg-gray-800" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']} items={items} />
      </Sider>
      <Layout>
        <Header className="bg-white p-0 dark:bg-white/10" />
        <Content className="mx-4 mt-6 rounded-lg p-6 dark:bg-white/10">
          <ContentPlaceholder className="h-300" />
        </Content>
        <Footer className="text-center">Metis UI ©2025 Created by Metis Lab</Footer>
      </Layout>
    </Layout>
  );
};

export default App;
