import React from 'react';
import { Button, Drawer } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const App: React.FC = () => (
  <SemanticPreview
    semantics={[
      { name: 'root' },
      { name: 'mask' },
      { name: 'content' },
      { name: 'header' },
      { name: 'close' },
      { name: 'body' },
      { name: 'footer' },
    ]}
  >
    <Drawer
      closable
      destroyOnClose
      title={<p>Loading Drawer</p>}
      placement="right"
      open
      footer={
        <>
          <Button>Cancel</Button>
          <Button type="primary">Submit</Button>
        </>
      }
      getContainer={false}
    >
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Drawer>
  </SemanticPreview>
);

export default App;
