import React from 'react';
import { InformationCircleOutline, UsersSolid } from '@metisjs/icons';
import { Input, Select } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const App: React.FC = () => (
  <SemanticPreview
    semantics={[
      { name: 'root' },
      { name: 'prefix' },
      { name: 'input' },
      { name: 'suffix' },
      { name: 'count' },
      { name: 'clear' },
      { name: 'addonBefore' },
      { name: 'addonAfter' },
    ]}
  >
    <Input
      addonBefore={
        <Select
          defaultValue="http://"
          options={[
            { value: 'http://', label: 'http://' },
            { value: 'https://', label: 'https://' },
          ]}
        />
      }
      addonAfter={
        <Select
          defaultValue=".com"
          options={[
            { value: '.com', label: '.com' },
            { value: '.jp', label: '.jp' },
            { value: '.cn', label: '.cn' },
            { value: '.org', label: '.org' },
          ]}
        />
      }
      defaultValue="mysite"
      placeholder="Enter your username"
      prefix={<UsersSolid />}
      suffix={<InformationCircleOutline />}
      showCount
      allowClear
      className="w-[480px]"
    />
  </SemanticPreview>
);

export default App;
