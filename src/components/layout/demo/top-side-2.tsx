import React from 'react';
import { CalendarOutline, HomeOutline, UsersOutline } from '@metisjs/icons';
import type { MenuProps } from 'metis-ui';
import { Layout, Menu } from 'metis-ui';
import ContentPlaceholder from './components/ContentPlaceholder';

const { Header, Content, Sider } = Layout;

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
    <Layout className="dark:bg-gray-950">
      <Header className="flex items-center bg-gray-900">
        <div className="me-6 h-8 w-30 min-w-30 rounded-md bg-gray-800" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          items={items1}
          className="w-0 flex-1"
        />
      </Header>
      <Layout>
        <Sider width={288} theme="light" className="dark:bg-white/10">
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            className="h-full border-r-0"
            items={items2}
          />
        </Sider>
        <Layout className="bg-gray-50 p-6 dark:bg-gray-950">
          <Content className="m-0 min-h-[280px] rounded-lg p-6 dark:bg-white/10">
            <ContentPlaceholder />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default App;
