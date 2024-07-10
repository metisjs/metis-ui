import { Button, message } from 'metis-ui';
import React from 'react';

const info = () => {
  message.info('This is a normal message');
};

const App: React.FC = () => (
  <Button type="primary" onClick={info}>
    Info
  </Button>
);

export default App;
