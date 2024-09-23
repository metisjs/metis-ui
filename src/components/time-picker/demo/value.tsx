import React, { useState } from 'react';
import { TimePicker } from 'metis-ui';

const App: React.FC = () => {
  const [value, setValue] = useState<string | null>(null);

  const onChange = (time: string) => {
    setValue(time);
  };

  return <TimePicker value={value} onChange={onChange} />;
};

export default App;
