import React from 'react';
import { Mentions } from 'metis-ui';
import type { GetProp, MentionsProps } from 'metis-ui';

type MentionsOptionProps = GetProp<MentionsProps, 'options'>[number];

const onChange = (value: string) => {
  console.log('Change:', value);
};

const onSelect = (option: MentionsOptionProps) => {
  console.log('select', option);
};

const App: React.FC = () => (
  <Mentions
    className="w-full"
    onChange={onChange}
    onSelect={onSelect}
    defaultValue="@tom"
    options={[
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
    ]}
  />
);

export default App;
