import { CalendarOutline, FolderOutline, HomeOutline, UsersOutline } from '@metisjs/icons';
import { Layout, Menu } from 'metis-ui';
import React from 'react';

const { Header, Content, Footer, Sider } = Layout;

const App: React.FC = () => {
  return (
    <Layout>
      <Sider
        breakpoint="lg"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['4']}
          items={[HomeOutline, FolderOutline, CalendarOutline, UsersOutline].map((icon, index) => ({
            key: String(index + 1),
            icon: React.createElement(icon),
            label: `nav ${index + 1}`,
          }))}
        />
      </Sider>
      <Layout>
        <Header className="bg-container p-0" />
        <Content style={{ margin: '24px 16px 0' }}>
          <div className="min-h-[360px] bg-container p-6">content</div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Metis UI ©2023 Created by Metis</Footer>
      </Layout>
    </Layout>
  );
};

export default App;
