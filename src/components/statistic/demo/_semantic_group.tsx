import React from 'react';
import { Statistic } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const App: React.FC = () => (
  <SemanticPreview
    semantics={[
      { name: 'root' },
      { name: 'content' },
      { name: 'action' },
      { name: 'item', link: './#statistic-1' },
    ]}
  >
    <Statistic.Group
      items={[
        { title: 'Title1', value: 1111.1234, precision: 2 },
        { title: 'Title2', value: 2222.1234, precision: 2, suffix: 'CNY' },
        { title: 'Title3', value: 3333.1234, precision: 0, suffix: 'm' },
        { title: 'Title4', value: 4444.1234, precision: 2 },
        { title: 'Title5', value: 5555.1234, precision: 2, suffix: 'CNY' },
        { title: 'Title6', value: 6666.1234, precision: 2 },
      ]}
    ></Statistic.Group>
  </SemanticPreview>
);

export default App;
