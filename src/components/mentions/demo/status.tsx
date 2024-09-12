import React from 'react';
import { Mentions, Space } from 'metis-ui';
import type { GetProp, MentionsProps } from 'metis-ui';

type MentionsOptionProps = GetProp<MentionsProps, 'options'>[number];

const onChange = (value: string) => {
  console.log('Change:', value);
};

const onSelect = (option: MentionsOptionProps) => {
  console.log('select', option);
};

const App: React.FC = () => {
  const options = [
    {
      value: 'tom',
      label: 'tom',
    },
    {
      value: 'jack',
      label: 'jack',
    },
    {
      value: 'minm',
      label: 'minm',
    },
  ];

  return (
    <Space direction="vertical">
      <Mentions
        onChange={onChange}
        onSelect={onSelect}
        defaultValue="@tom"
        status="error"
        options={options}
      />
      <Mentions
        onChange={onChange}
        onSelect={onSelect}
        defaultValue="@tom"
        status="warning"
        options={options}
      />
    </Space>
  );
};

export default App;
