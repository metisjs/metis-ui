import React from 'react';
import type { CountdownProps } from 'metis-ui';
import { Statistic } from 'metis-ui';

const { Countdown } = Statistic;

const deadline = Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30; // Dayjs is also OK

const onFinish: CountdownProps['onFinish'] = () => {
  console.log('finished!');
};

const onChange: CountdownProps['onChange'] = (val) => {
  if (typeof val === 'number' && 4.95 * 1000 < val && val < 5 * 1000) {
    console.log('changed!');
  }
};

const App: React.FC = () => (
  <div className="grid grid-cols-2 gap-4">
    <Countdown title="Countdown" value={deadline} onFinish={onFinish} />
    <Countdown title="Million Seconds" value={deadline} format="HH:mm:ss:SSS" />
    <Countdown
      title="Day Level"
      value={deadline}
      format="D 天 H 时 m 分 s 秒"
      className="col-span-2"
    />
    <Countdown title="Countdown" value={Date.now() + 10 * 1000} onChange={onChange} />
  </div>
);

export default App;
