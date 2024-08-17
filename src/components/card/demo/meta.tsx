import React from 'react';
import { Cog6ToothOutline, EllipsisHorizontalOutline, PencilSquareOutline } from '@metisjs/icons';
import { Avatar, Card } from 'metis-ui';

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
      <Cog6ToothOutline key="setting" className="h-4 w-4" />,
      <PencilSquareOutline key="edit" className="h-4 w-4" />,
      <EllipsisHorizontalOutline key="ellipsis" className="h-4 w-4" />,
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
