import React from 'react';
import { CalendarOutline, FolderOutline, HomeOutline, UsersOutline } from '@metisjs/icons';
import { Layout, Menu } from 'metis-ui';
import ContentPlaceholder from './components/ContentPlaceholder';

const { Header, Content, Footer, Sider } = Layout;

const App: React.FC = () => {
  return (
    <Layout className="bg-gray-50 dark:bg-gray-950">
      <Sider
        breakpoint="lg"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
        className="bg-gray-900"
      >
        <div className="m-4 h-8 rounded-md bg-gray-800" />
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
        <Header className="bg-white p-0 dark:bg-white/10" />
        <Content className="m-4 mb-0 rounded-lg bg-white p-6 dark:bg-white/10">
          <ContentPlaceholder className="h-90" />
        </Content>
        <Footer className="text-center">Metis UI ©2025 Created by Metis Lab</Footer>
      </Layout>
    </Layout>
  );
};

export default App;
