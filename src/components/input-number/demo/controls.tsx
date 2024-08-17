import React from 'react';
import { ArrowSmallDownOutline, ArrowSmallUpOutline } from '@metisjs/icons';
import { InputNumber } from 'metis-ui';

const App: React.FC = () => (
  <InputNumber
    controls={{ upIcon: <ArrowSmallUpOutline />, downIcon: <ArrowSmallDownOutline /> }}
  />
);

export default App;
