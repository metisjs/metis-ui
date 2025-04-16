import React from 'react';
import { Layout, Menu } from 'metis-ui';
import ContentPlaceholder from './components/ContentPlaceholder';

const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
  return (
    <Layout>
      <Header className="sticky top-0 z-1 flex w-full items-center bg-gray-900">
        <div className="me-6 h-8 w-30 min-w-30 rounded-md bg-gray-800" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          items={new Array(3).fill(null).map((_, index) => ({
            key: String(index + 1),
            label: `nav ${index + 1}`,
          }))}
        />
      </Header>
      <Content className="px-6 pt-12">
        <ContentPlaceholder className="h-90" />
      </Content>
      <Footer className="text-center">Metis UI ©2025 Created by Metis Lab</Footer>
    </Layout>
  );
};

export default App;
