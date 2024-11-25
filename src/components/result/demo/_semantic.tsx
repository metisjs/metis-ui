import React from 'react';
import { Button, Result } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const App: React.FC = () => (
  <SemanticPreview
    semantics={[
      { name: 'root' },
      { name: 'icon' },
      { name: 'image' },
      { name: 'title' },
      { name: 'subTitle' },
      { name: 'content' },
      { name: 'extra' },
    ]}
  >
    {(hover) => (
      <Result
        status={hover?.name === 'image' ? '404' : 'success'}
        title="Successfully Purchased Cloud Server ECS!"
        subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
        extra={[
          <Button type="primary" key="console">
            Go Console
          </Button>,
          <Button key="buy">Buy Again</Button>,
        ]}
      >
        Content
      </Result>
    )}
  </SemanticPreview>
);

export default App;
