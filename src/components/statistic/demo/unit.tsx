import React from 'react';
import { HandThumbUpOutline } from '@metisjs/icons';
import { Statistic } from 'metis-ui';

const App: React.FC = () => (
  <div className="grid grid-cols-2 gap-4">
    <Statistic title="Feedback" value={1128} prefix={<HandThumbUpOutline />} />
    <Statistic title="Unmerged" value={93} suffix="/ 100" />
  </div>
);

export default App;
