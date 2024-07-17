import { ArrowDownOutline, ArrowUpOutline } from '@metisjs/icons';
import { InputNumber } from 'metis-ui';
import React from 'react';

const App: React.FC = () => (
  <InputNumber controls={{ upIcon: <ArrowUpOutline />, downIcon: <ArrowDownOutline /> }} />
);

export default App;
