import React from 'react';
import { clsx, Layout, Space } from 'metis-ui';

const { Header, Footer, Sider, Content } = Layout;

const headerCls = clsx('h-16 bg-indigo-400 text-center leading-16 text-white');

const contentCls = clsx('min-h-30 bg-indigo-600 text-center leading-30 text-white');

const siderCls = clsx('bg-indigo-500 text-center leading-30 text-white');

const footerCls = clsx('bg-indigo-400 text-center text-white');

const App: React.FC = () => (
  <Space vertical block size={[0, 48]}>
    <Layout>
      <Header className={headerCls}>Header</Header>
      <Content className={contentCls}>Content</Content>
      <Footer className={footerCls}>Footer</Footer>
    </Layout>
    <Layout>
      <Header className={headerCls}>Header</Header>
      <Layout hasSider>
        <Sider className={siderCls}>Sider</Sider>
        <Content className={contentCls}>Content</Content>
      </Layout>
      <Footer className={footerCls}>Footer</Footer>
    </Layout>
    <Layout>
      <Header className={headerCls}>Header</Header>
      <Layout hasSider>
        <Content className={contentCls}>Content</Content>
        <Sider className={siderCls}>Sider</Sider>
      </Layout>
      <Footer className={footerCls}>Footer</Footer>
    </Layout>
    <Layout>
      <Sider className={siderCls}>Sider</Sider>
      <Layout>
        <Header className={headerCls}>Header</Header>
        <Content className={contentCls}>Content</Content>
        <Footer className={footerCls}>Footer</Footer>
      </Layout>
    </Layout>
  </Space>
);

export default App;
