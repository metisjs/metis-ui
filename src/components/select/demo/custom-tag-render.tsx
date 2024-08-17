import React from 'react';
import { Select, Tag } from 'metis-ui';
import type { CustomTagProps } from 'metis-ui/es/select';

const options = [
  { value: '#f50' },
  { value: '#2db7f5' },
  { value: '#87d068' },
  { value: '#108ee9' },
];

const tagRender = (props: CustomTagProps) => {
  const { label, value, closable, onClose } = props;
  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Tag
      color={value}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginRight: 3 }}
    >
      {label}
    </Tag>
  );
};

const App: React.FC = () => (
  <Select
    mode="multiple"
    tagRender={tagRender}
    defaultValue={['#f50', '#2db7f5']}
    style={{ width: '100%' }}
    options={options}
  />
);

export default App;
