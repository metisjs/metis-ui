import React from 'react';
import type { StatisticProps } from 'metis-ui';
import { Statistic } from 'metis-ui';
import CountUp from 'react-countup';

const formatter: StatisticProps['formatter'] = (value) => (
  <CountUp end={value as number} separator="," />
);

const App: React.FC = () => (
  <div className="grid grid-cols-2 gap-4">
    <Statistic title="Active Users" value={112893} formatter={formatter} />
    <Statistic title="Account Balance (CNY)" value={112893} precision={2} formatter={formatter} />
  </div>
);

export default App;
