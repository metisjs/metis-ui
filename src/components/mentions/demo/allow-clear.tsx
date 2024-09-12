import React, { useState } from 'react';
import { XMarkOutline } from '@metisjs/icons';
import { Mentions } from 'metis-ui';

const App: React.FC = () => {
  const [value, setValue] = useState('hello world');
  return (
    <>
      <Mentions value={value} onChange={setValue} allowClear />
      <br />
      <br />
      <Mentions value={value} onChange={setValue} allowClear={{ clearIcon: <XMarkOutline /> }} />
      <br />
      <br />
      <Mentions value={value} onChange={setValue} allowClear rows={3} />
    </>
  );
};

export default App;
