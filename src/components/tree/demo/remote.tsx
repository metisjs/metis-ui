import React from 'react';
import { Tree } from 'metis-ui';
import { fetchData } from './services';

const App: React.FC = () => <Tree request={fetchData} fieldNames={{ key: 'id', title: 'name' }} />;

export default App;
