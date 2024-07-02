import { Slider } from 'metis-ui';
import React from 'react';

const App: React.FC = () => {
  return <Slider range defaultValue={[0, 10, 20]} />;
};

export default App;
