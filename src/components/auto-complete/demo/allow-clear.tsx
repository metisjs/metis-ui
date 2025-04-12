import React, { useState } from 'react';
import { XMarkOutline } from '@metisjs/icons';
import { AutoComplete } from 'metis-ui';

const mockVal = (str: string, repeat = 1) => ({
  value: str.repeat(repeat),
});

const App: React.FC = () => {
  const [options, setOptions] = useState<{ value: string }[]>([]);

  const getPanelValue = (searchText: string) =>
    !searchText ? [] : [mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 3)];

  return (
    <>
      <AutoComplete
        options={options}
        onSearch={(text) => setOptions(getPanelValue(text))}
        placeholder="UnClearable"
        allowClear
        className="w-52"
      />
      <br />
      <br />
      <AutoComplete
        options={options}
        onSearch={(text) => setOptions(getPanelValue(text))}
        placeholder="Customized clear icon"
        allowClear={{ clearIcon: <XMarkOutline className="size-4" /> }}
        className="w-52"
      />
    </>
  );
};

export default App;
