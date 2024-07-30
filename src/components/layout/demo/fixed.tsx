import { Layout, Menu } from 'metis-ui';
import React from 'react';

const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
  return (
    <Layout>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="demo-logo" />
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
      <Content className="site-layout px-12 py-6">
        <div className="min-h-[380px] bg-container p-6">Content</div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Metis UI ©2023 Created by Metis</Footer>
    </Layout>
  );
};

export default App;
