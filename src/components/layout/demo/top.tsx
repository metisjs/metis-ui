import React from 'react';
import { Layout, Menu } from 'metis-ui';
import ContentPlaceholder from './components/ContentPlaceholder';

const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
  return (
    <Layout>
      <Header className="flex items-center bg-gray-900">
        <div className="me-6 h-8 w-30 min-w-30 rounded-md bg-gray-800" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          items={new Array(15).fill(null).map((_, index) => {
            const key = index + 1;
            return {
              key,
              label: `nav ${key}`,
            };
          })}
          className="w-0 flex-1"
        />
      </Header>
      <Content className="px-12 py-6">
        <ContentPlaceholder />
      </Content>
      <Footer className="text-center">Metis UI ©2025 Created by Metis Lab</Footer>
    </Layout>
  );
};

export default App;
