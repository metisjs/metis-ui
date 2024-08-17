import React from 'react';
import { Scrollbar } from 'metis-ui';
import { Lorem } from './vertical';

const App: React.FC = () => (
  <Scrollbar className="h-[300px] max-w-[600px]">
    <div className="w-[800px]">
      <Lorem />
    </div>
  </Scrollbar>
);

export default App;
