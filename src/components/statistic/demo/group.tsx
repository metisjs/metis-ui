import React from 'react';
import { Statistic } from 'metis-ui';

export default () => (
  <Statistic.Group
    items={[
      { title: 'Account Balance1', value: 11111.1234, precision: 2, suffix: 'CNY' },
      { title: 'Account Balance2', value: 22222.1234, precision: 2, suffix: 'CNY' },
      { title: 'Account Balance3', value: 33333.1234, precision: 2, suffix: 'CNY' },
      { title: 'Account Balance4', value: 44444.1234, precision: 2, suffix: 'CNY' },
      { title: 'Account Balance5', value: 55555.1234, precision: 2, suffix: 'CNY' },
    ]}
  ></Statistic.Group>
);
