import {
  CalendarOutline,
  ChevronLeftOutline,
  ChevronRightOutline,
  HomeOutline,
  UsersOutline,
} from '@metisjs/icons';
import { Button, Layout, Menu } from 'metis-ui';
import React, { useState } from 'react';

const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
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
        <Header className="bg-neutral-bg-container p-0">
          <Button
            type="text"
            icon={collapsed ? <ChevronRightOutline /> : <ChevronLeftOutline />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content className="mx-4 my-6 min-h-[280px] bg-neutral-bg-container p-6">Content</Content>
      </Layout>
    </Layout>
  );
};

export default App;
