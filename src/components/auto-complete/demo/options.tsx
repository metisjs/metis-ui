import React from 'react';
import { AutoComplete } from 'metis-ui';

const App: React.FC = () => {
  const [options, setOptions] = React.useState<{ value: string }[]>([]);
  const handleSearch = (value: string) => {
    setOptions(() => {
      if (!value || value.includes('@')) {
        return [];
      }
      return ['gmail.com', '163.com', 'qq.com'].map((domain) => ({
        label: `${value}@${domain}`,
        value: `${value}@${domain}`,
      }));
    });
  };
  return (
    <AutoComplete
      onSearch={handleSearch}
      placeholder="input here"
      options={options}
      className="w-52"
    />
  );
};

export default App;
