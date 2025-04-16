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
    <Avatar.Group maxCount={3} className={{ max: 'bg-rose-300 text-rose-800' }}>
      <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=2" />
      <Avatar className="bg-yellow-500">K</Avatar>
      <Avatar className="bg-lime-500" icon={<UserSolid />} />
      <Avatar className="bg-sky-500" icon={<PaperAirplaneSolid />} />
    </Avatar.Group>
  </SemanticPreview>
);

export default App;
