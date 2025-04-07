import React from 'react';
import { Layout, Menu } from 'metis-ui';

const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
  return (
    <Layout className="layout">
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" />
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
        />
      </Header>
      <Content className="px-12 py-6">
        <div className="bg-white p-4 dark:bg-gray-950">Content</div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Metis UI ©2023 Created by Metis</Footer>
    </Layout>
  );
};

export default App;
