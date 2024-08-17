import React from 'react';
import { UserOutline } from '@metisjs/icons';
import { AutoComplete, Input } from 'metis-ui';

const renderTitle = (title: string) => (
  <span>
    {title}
    <a
      style={{ float: 'right' }}
      href="https://www.google.com/search?q=metis-ui"
      target="_blank"
      rel="noopener noreferrer"
    >
      more
    </a>
  </span>
);

const renderItem = (title: string, count: number) => ({
  value: title,
  label: (
    <div className="flex w-full justify-between">
      {title}
      <span>
        <UserOutline /> {count}
      </span>
    </div>
  ),
});

const options = [
  {
    label: renderTitle('Libraries'),
    options: [renderItem('AntDesign', 10000), renderItem('AntDesign UI', 10600)],
  },
  {
    label: renderTitle('Solutions'),
    options: [renderItem('AntDesign UI FAQ', 60100), renderItem('AntDesign FAQ', 30010)],
  },
  {
    label: renderTitle('Articles'),
    options: [renderItem('AntDesign design language', 100000)],
  },
];

const App: React.FC = () => (
  <AutoComplete
    popupMatchSelectWidth={500}
    options={options}
    size="large"
    className={{
      root: 'w-64',
      popup: '',
    }}
  >
    <Input size="large" placeholder="input here" />
  </AutoComplete>
);

export default App;
