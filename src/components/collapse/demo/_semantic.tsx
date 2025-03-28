import React from 'react';
import type { CollapseProps } from 'metis-ui';
import { Collapse } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const items: CollapseProps['items'] = [
  {
    key: '1',
    label: 'This is panel header 1',
    children: <p>{text}</p>,
  },
  {
    key: '2',
    label: 'This is panel header 2',
    children: <p>{text}</p>,
  },
  {
    key: '3',
    label: 'This is panel header 3',
    children: <p>{text}</p>,
  },
];

const App: React.FC = () => (
  <SemanticPreview
    semantics={[
      { name: 'root' },
      { name: 'panel', children: [{ name: 'icon' }, { name: 'header' }, { name: 'content' }] },
    ]}
  >
    <Collapse items={items} defaultActiveKey={['1']} />
  </SemanticPreview>
);

export default App;
