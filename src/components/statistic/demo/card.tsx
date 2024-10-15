import React from 'react';
import { ArrowDownOutline, ArrowUpOutline } from '@metisjs/icons';
import { Card, Statistic } from 'metis-ui';

const App: React.FC = () => (
  <div className="grid grid-cols-2 gap-4">
    <Card bordered={false}>
      <Statistic
        title="Active"
        value={11.28}
        precision={2}
        className={{ content: 'text-error', suffix: 'text-error' }}
        prefix={<ArrowUpOutline />}
        suffix="%"
      />
    </Card>
    <Card bordered={false}>
      <Statistic
        title="Idle"
        value={9.3}
        precision={2}
        className={{ content: 'text-success', suffix: 'text-success' }}
        prefix={<ArrowDownOutline />}
        suffix="%"
      />
    </Card>
  </div>
);

export default App;
