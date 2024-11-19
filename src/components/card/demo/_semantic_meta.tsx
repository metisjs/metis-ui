import React from 'react';
import { Avatar, Card } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const App: React.FC = () => (
  <SemanticPreview
    semantics={[{ name: 'root' }, { name: 'avatar' }, { name: 'title' }, { name: 'description' }]}
  >
    <Card.Meta
      className="w-[300]px"
      avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
      title="Card title"
      description="This is the description"
    />
  </SemanticPreview>
);

export default App;
