/**
 * description: 翻转后如果不够则偏移以供完全的展示。
 */
import { Select } from 'meta-ui';
import React from 'react';

const App: React.FC = () => (
  <Select
    style={{ width: 120, marginTop: '50vh' }}
    options={new Array(100).fill(null).map((_, index) => ({
      value: index,
    }))}
  />
);

export default App;
