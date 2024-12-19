import React from 'react';
import { Button, Popover } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const content = (
  <div>
    <p>Content</p>
    <p>Content</p>
  </div>
);

const App: React.FC = () => (
  <SemanticPreview
    semantics={[
      { name: 'root' },
      { name: 'overlay' },
      { name: 'inner' },
      { name: 'arrow' },
      { name: 'title' },
      { name: 'content' },
    ]}
    rootArgs={[{ name: 'open', type: 'boolean' }]}
  >
    <Popover content={content} title="Title" open getPopupContainer={(node) => node.parentElement!}>
      <Button type="primary">Hover me</Button>
    </Popover>
  </SemanticPreview>
);

export default App;
