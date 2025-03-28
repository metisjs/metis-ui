import React, { useState } from 'react';
import { ChatBubbleLeftOutline } from '@metisjs/icons';
import { FloatButton, Segmented } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const App: React.FC = () => {
  const [type, setType] = useState<'Single' | 'Group'>('Single');
  return (
    <SemanticPreview
      semantics={
        type === 'Single'
          ? [{ name: 'root' }, { name: 'content' }, { name: 'icon' }, { name: 'description' }]
          : [
              { name: 'root' },
              { name: 'wrapper' },
              { name: 'trigger', desc: 'A FloatButton className' },
            ]
      }
      extra={<Segmented value={type} options={['Single', 'Group']} onChange={setType} />}
      height={300}
      transform
    >
      {type === 'Single' && (
        <FloatButton shape="square" icon={<ChatBubbleLeftOutline />} description="HELP" />
      )}
      {type === 'Group' && (
        <FloatButton.Group open trigger="click" icon={<ChatBubbleLeftOutline />}>
          <FloatButton />
          <FloatButton icon={<ChatBubbleLeftOutline />} />
        </FloatButton.Group>
      )}
    </SemanticPreview>
  );
};

export default App;
