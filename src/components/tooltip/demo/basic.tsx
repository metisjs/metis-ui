import { Tooltip } from 'metis-ui';
import React from 'react';

const App: React.FC = () => (
  <Tooltip title="prompt text">
    <span>Tooltip will show on mouse enter.</span>
  </Tooltip>
);

export default App;
