import React from 'react';
import { Statistic } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const { Countdown } = Statistic;

const deadline = Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30;

const App: React.FC = () => (
  <SemanticPreview
    semantics={[{ name: 'root' }, { name: 'title' }, { name: 'content' }, { name: 'value' }]}
  >
    <Countdown title="Countdown" value={deadline} />
  </SemanticPreview>
);

export default App;
