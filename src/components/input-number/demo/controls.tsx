import { ArrowSmallDownOutline, ArrowSmallUpOutline } from '@metisjs/icons';
import { InputNumber } from 'metis-ui';
import React from 'react';

const App: React.FC = () => (
  <InputNumber
    controls={{ upIcon: <ArrowSmallUpOutline />, downIcon: <ArrowSmallDownOutline /> }}
  />
);

export default App;
