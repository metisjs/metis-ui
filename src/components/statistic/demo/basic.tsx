import React from 'react';
import { Statistic } from 'metis-ui';

const App: React.FC = () => (
  <div className="grid grid-cols-4 gap-4">
    <Statistic title="Active Users" value={112893} />
    <Statistic title="Account Balance" value={112893} precision={2} suffix="CNY" />
    <Statistic title="Active Users" value={112893} tooltip="Some Tips..." />
    <Statistic title="Active Users" value={112893} loading />
  </div>
);

export default App;
