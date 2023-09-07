/**
 * description: 无边框模式。
 */
import { Divider, Space, Tag } from 'meta-ui';
import React from 'react';

const App: React.FC = () => (
  <>
    <Space size={[0, 'small']} wrap>
      <Tag bordered={false}>Tag 1</Tag>
      <Tag bordered={false}>Tag 2</Tag>
      <Tag bordered={false} closable>
        Tag 3
      </Tag>
      <Tag bordered={false} closable>
        Tag 4
      </Tag>
    </Space>
    <Divider />
    <Space size={[0, 'small']} wrap>
      <Tag bordered={false} color="processing">
        processing
      </Tag>
      <Tag bordered={false} color="success">
        success
      </Tag>
      <Tag bordered={false} color="error">
        error
      </Tag>
      <Tag bordered={false} color="warning">
        warning
      </Tag>
    </Space>
  </>
);

export default App;
