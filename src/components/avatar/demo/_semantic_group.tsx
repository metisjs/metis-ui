import React from 'react';
import { PaperAirplaneSolid, UserSolid } from '@metisjs/icons';
import { Avatar } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const App: React.FC = () => (
  <SemanticPreview
    semantics={[
      { name: 'root' },
      { name: 'item', children: [{ name: 'children' }] },
      { name: 'max', children: [{ name: 'children' }] },
    ]}
  >
    <Avatar.Group maxCount={3} maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
      <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=2" />
      <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
      <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserSolid />} />
      <Avatar style={{ backgroundColor: '#1890ff' }} icon={<PaperAirplaneSolid />} />
    </Avatar.Group>
  </SemanticPreview>
);

export default App;
