import React, { useState } from 'react';
import { Mentions } from 'metis-ui';
import type { MentionsProps } from 'metis-ui';

const MOCK_DATA = {
  '@': ['tom', 'zombiej', 'minm'],
  '#': ['1.0', '2.0', '3.0'],
};

type PrefixType = keyof typeof MOCK_DATA;

const App: React.FC = () => {
  const [prefix, setPrefix] = useState<PrefixType>('@');

  const onSearch: MentionsProps['onSearch'] = (_, newPrefix) => {
    setPrefix(newPrefix as PrefixType);
  };

  return (
    <Mentions
      className="w-full"
      placeholder="input @ to mention people, # to mention tag"
      prefix={['@', '#']}
      onSearch={onSearch}
      options={(MOCK_DATA[prefix] || []).map((value) => ({
        key: value,
        value,
        label: value,
      }))}
    />
  );
};

export default App;
