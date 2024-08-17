import React from 'react';
import { Slider } from 'metis-ui';

const App: React.FC = () => {
  return <Slider range defaultValue={[0, 10, 20]} />;
};

export default App;
