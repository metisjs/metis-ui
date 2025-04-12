import React, { useState } from 'react';
import { EnvelopeSolid, PhoneSolid } from '@metisjs/icons';
import { Avatar, Card, Skeleton, Space, Switch } from 'metis-ui';

const { Meta } = Card;

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);

  const onChange = (checked: boolean) => {
    setLoading(!checked);
  };

  return (
    <>
      <Switch checked={!loading} onChange={onChange} />
      <Card style={{ width: 300, marginTop: 16 }} loading={loading}>
        <Meta
          avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />}
          title="Card title"
          description="This is the description"
        />
      </Card>
      <Card
        style={{ width: 300, marginTop: 16 }}
        actions={[
          <Space key="email" size={12}>
            <EnvelopeSolid className="size-5" />
            <span className="text-text font-medium">Email</span>
          </Space>,
          <Space key="call" size={12}>
            <PhoneSolid className="size-5" />
            <span className="text-text font-medium">Call</span>
          </Space>,
        ]}
      >
        <Skeleton loading={loading} avatar active>
          <Meta
            avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=2" />}
            title="Card title"
            description="This is the description"
          />
        </Skeleton>
      </Card>
    </>
  );
};

export default App;
