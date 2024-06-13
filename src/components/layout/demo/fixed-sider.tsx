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
import React from 'react';

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
    <Layout hasSider>
      <Sider
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="demo-logo-vertical" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']} items={items} />
      </Sider>
      <Layout className="site-layout" style={{ marginLeft: 200 }}>
        <Header className="bg-neutral-bg-container p-0" />
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div className="bg-neutral-bg-container p-6 text-center">
            <p>long content</p>
            {
              // indicates very long content
              Array.from({ length: 100 }, (_, index) => (
                <React.Fragment key={index}>
                  {index % 20 === 0 && index ? 'more' : '...'}
                  <br />
                </React.Fragment>
              ))
            }
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Metis UI ©2023 Created by Metis</Footer>
      </Layout>
    </Layout>
  );
};

export default App;
