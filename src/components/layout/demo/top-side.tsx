import { CalendarOutline, HomeOutline, UsersOutline } from '@metisjs/icons';
import type { MenuProps } from 'metis-ui';
import { Layout, Menu } from 'metis-ui';
import React from 'react';

const { Header, Content, Footer, Sider } = Layout;

const items1: MenuProps['items'] = ['1', '2', '3'].map((key) => ({
  key,
  label: `nav ${key}`,
}));

const items2: MenuProps['items'] = [HomeOutline, CalendarOutline, UsersOutline].map(
  (icon, index) => {
    const key = String(index + 1);

    return {
      key: `sub${key}`,
      icon: React.createElement(icon),
      label: `subnav ${key}`,

      children: new Array(4).fill(null).map((_, j) => {
        const subKey = index * 4 + j + 1;
        return {
          key: subKey,
          label: `option${subKey}`,
        };
      }),
    };
  },
);

const App: React.FC = () => {
  return (
    <Layout>
      <Header className="flex items-center">
        <div className="demo-logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} items={items1} />
      </Header>
      <Content className="px-12 py-6">
        <Layout className="bg-container py-6">
          <Sider width={200} theme="light">
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%' }}
              items={items2}
              className="border-e-neutral-border border-e"
            />
          </Sider>
          <Content style={{ padding: '0 24px', minHeight: 280 }}>Content</Content>
        </Layout>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Metis UI ©2023 Created by Metis</Footer>
    </Layout>
  );
};

export default App;
