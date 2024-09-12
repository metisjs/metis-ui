import React from 'react';
import { Mentions } from 'metis-ui';

const options = ['tom', 'zombiej', 'minm'].map((value) => ({
  value,
  key: value,
  label: value,
}));

const App: React.FC = () => (
  <>
    <div style={{ marginBottom: 10 }}>
      <Mentions
        className="w-full"
        placeholder="this is disabled Mentions"
        disabled
        options={options}
      />
    </div>
    <Mentions
      className="w-full"
      placeholder="this is readOnly Mentions"
      readOnly
      options={options}
    />
  </>
);

export default App;
