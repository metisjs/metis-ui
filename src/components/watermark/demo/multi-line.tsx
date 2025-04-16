import React from 'react';
import { Watermark } from 'metis-ui';

const App: React.FC = () => (
  <Watermark content={['Metis UI', 'Happy Working']}>
    <div className="h-125" />
  </Watermark>
);

export default App;
