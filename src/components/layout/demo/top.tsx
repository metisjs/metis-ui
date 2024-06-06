/**
 * description: 最基本的『上-中-下』布局。<br/>一般主导航放置于页面的顶端，从左自右依次为：logo、一级导航项、辅助菜单（用户、设置、通知等）。通常将内容放在固定尺寸（例如：1200px）内，整个页面排版稳定，不受用户终端显示器影响；上下级的结构符合用户上下浏览的习惯，也是较为经典的网站导航模式。页面上下切分的方式提高了主工作区域的信息展示效率，但在纵向空间上会有一些牺牲。此外，由于导航栏水平空间的限制，不适合那些一级导航项很多的信息结构。
 */
import { Layout, Menu } from 'meta-ui';
import React from 'react';

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
        <div className="bg-neutral-bg-container">Content</div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Metis UI ©2023 Created by Metis</Footer>
    </Layout>
  );
};

export default App;
