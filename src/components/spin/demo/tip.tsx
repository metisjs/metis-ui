import { Alert, Space, Spin } from 'metis-ui';
import React from 'react';

const contentStyle: React.CSSProperties = {
  padding: 50,
  background: 'rgba(0, 0, 0, 0.05)',
  borderRadius: 4,
};

const content = <div style={contentStyle} />;

const App: React.FC = () => (
  <Space direction="vertical">
    <Space>
      <Spin tip="Loading" size="small">
        {content}
      </Spin>
      <Spin tip="Loading">{content}</Spin>
      <Spin tip="Loading" size="large">
        {content}
      </Spin>
    </Space>
    <Spin tip="Loading...">
      <Alert
        message="Alert message title"
        description="Further details about the context of this alert."
        type="info"
      />
    </Spin>
  </Space>
);

export default App;
