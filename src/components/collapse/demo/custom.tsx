import type { CSSProperties } from 'react';
import React from 'react';
import { MinusOutline, PlusOutline } from '@metisjs/icons';
import type { CollapseProps } from 'metis-ui';
import { Collapse } from 'metis-ui';

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const getItems: (panelStyle: CSSProperties) => CollapseProps['items'] = (panelStyle) => [
  {
    key: '1',
    label: 'This is panel header 1',
    children: <p>{text}</p>,
    style: panelStyle,
  },
  {
    key: '2',
    label: 'This is panel header 2',
    children: <p>{text}</p>,
    style: panelStyle,
  },
  {
    key: '3',
    label: 'This is panel header 3',
    children: <p>{text}</p>,
    style: panelStyle,
  },
];

const App: React.FC = () => {
  const panelStyle: React.CSSProperties = {
    marginBottom: 24,
    border: 'none',
  };

  return (
    <Collapse
      bordered={false}
      defaultActiveKey={['1']}
      expandIcon={({ isActive }) => (isActive ? <PlusOutline /> : <MinusOutline />)}
      items={getItems(panelStyle)}
    />
  );
};

export default App;
