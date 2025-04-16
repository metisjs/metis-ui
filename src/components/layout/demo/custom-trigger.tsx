import React, { useState } from 'react';
import {
  CalendarOutline,
  ChevronLeftOutline,
  ChevronRightOutline,
  HomeOutline,
  UsersOutline,
} from '@metisjs/icons';
import { Button, Layout, Menu } from 'metis-ui';
import ContentPlaceholder from './components/ContentPlaceholder';

const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout className="bg-gray-50 dark:bg-gray-950">
      <Sider trigger={null} collapsible collapsed={collapsed} className="bg-gray-900">
        <div className="m-4 h-8 rounded-md bg-gray-800" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <HomeOutline />,
              label: 'nav 1',
            },
            {
              key: '2',
              icon: <CalendarOutline />,
              label: 'nav 2',
            },
            {
              key: '3',
              icon: <UsersOutline />,
              label: 'nav 3',
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header className="border-border-secondary flex items-center border-b bg-white p-0 dark:bg-white/10">
          <Button
            type="text"
            icon={collapsed ? <ChevronRightOutline /> : <ChevronLeftOutline />}
            onClick={() => setCollapsed(!collapsed)}
            className="ml-2 h-9 w-9 text-base"
          />
        </Header>
        <Content className="m-4 rounded-lg bg-white p-6 dark:bg-white/10">
          <ContentPlaceholder className="h-90" />
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
