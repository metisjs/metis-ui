import React from 'react';
import { EnvelopeSolid, PhoneSolid } from '@metisjs/icons';
import { Avatar, Card, Space } from 'metis-ui';

const { Meta } = Card;

const App: React.FC = () => (
  <Card
    style={{ width: 300 }}
    cover={
      <img
        alt="example"
        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
      />
    }
    actions={[
      <Space key="email" size={12}>
        <EnvelopeSolid className="h-5 w-5" />
        <span className="font-medium text-text">Email</span>
      </Space>,
      <Space key="call" size={12}>
        <PhoneSolid className="h-5 w-5" />
        <span className="font-medium text-text">Call</span>
      </Space>,
    ]}
  >
    <Meta
      avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
      title="Card title"
      description="This is the description"
    />
  </Card>
);

export default App;
