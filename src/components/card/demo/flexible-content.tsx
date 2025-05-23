import React from 'react';
import { Card } from 'metis-ui';

const { Meta } = Card;

const App: React.FC = () => (
  <Card
    hoverable
    className="w-60"
    cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
  >
    <Meta title="Europe Street beat" description="www.instagram.com" />
  </Card>
);

export default App;
