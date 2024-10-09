import React from 'react';
import { Tree } from 'metis-ui';
import { fetchChildrenData } from './services';

const App: React.FC = () => (
  <Tree
    request={fetchChildrenData}
    fieldNames={{ key: 'id', title: 'name', leaf: 'aabb' }}
    lazyLoad
  />
);

export default App;
