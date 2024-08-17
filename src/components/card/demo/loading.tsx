import React, { useState } from 'react';
import { Cog6ToothOutline, EllipsisHorizontalOutline, PencilSquareOutline } from '@metisjs/icons';
import { Avatar, Card, Skeleton, Switch } from 'metis-ui';

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
          <Cog6ToothOutline key="setting" className="h-4 w-4" />,
          <PencilSquareOutline key="edit" className="h-4 w-4" />,
          <EllipsisHorizontalOutline key="ellipsis" className="h-4 w-4" />,
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
