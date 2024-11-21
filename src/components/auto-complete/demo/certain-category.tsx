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
    options: [renderItem('Metis', 10000), renderItem('Metis UI', 10600)],
  },
  {
    label: renderTitle('Solutions'),
    options: [renderItem('Metis UI FAQ', 60100), renderItem('Metis FAQ', 30010)],
  },
  {
    label: renderTitle('Articles'),
    options: [renderItem('Metis design language', 100000)],
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
