import React, { useState } from 'react';
import { Cog6ToothOutline } from '@metisjs/icons';
import type { CollapseProps } from 'metis-ui';
import { Collapse, Select } from 'metis-ui';

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

type ExpandIconPosition = 'start' | 'end';

const App: React.FC = () => {
  const [expandIconPosition, setExpandIconPosition] = useState<ExpandIconPosition>('start');

  const onPositionChange = (newExpandIconPosition: ExpandIconPosition) => {
    setExpandIconPosition(newExpandIconPosition);
  };

  const onChange = (key: string | string[]) => {
    console.log(key);
  };

  const genExtra = () => (
    <Cog6ToothOutline
      className="size-4 cursor-pointer"
      onClick={(event) => {
        // If you don't want click extra trigger collapse, you can prevent this:
        event.stopPropagation();
      }}
    />
  );

  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: 'This is panel header 1',
      children: <div>{text}</div>,
      extra: genExtra(),
    },
    {
      key: '2',
      label: 'This is panel header 2',
      children: <div>{text}</div>,
      extra: genExtra(),
    },
    {
      key: '3',
      label: 'This is panel header 3',
      children: <div>{text}</div>,
      extra: genExtra(),
    },
  ];

  return (
    <>
      <Collapse
        defaultActiveKey={['1']}
        onChange={onChange}
        expandIconPosition={expandIconPosition}
        items={items}
      />
      <br />
      <span>Expand Icon Position: </span>
      <Select
        value={expandIconPosition}
        options={[
          { label: 'start', value: 'start' },
          { label: 'end', value: 'end' },
        ]}
        className="ml-2 w-24"
        onChange={onPositionChange}
      ></Select>
    </>
  );
};

export default App;
