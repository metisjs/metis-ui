import React from 'react';
import { Watermark } from 'metis-ui';

const App: React.FC = () => (
  <Watermark content={['Metis UI', 'Happy Working']}>
    <div style={{ height: 500 }} />
  </Watermark>
);

export default App;
