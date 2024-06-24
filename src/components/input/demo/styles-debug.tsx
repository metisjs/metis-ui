import { Input, Select, Space } from 'metis-ui';
import React from 'react';

const { TextArea } = Input;

const App: React.FC = () => (
  <Space direction="vertical" className="flex">
    <Input defaultValue="Outline Disabled" disabled />
    <Input defaultValue="Outline Disabled" addonBefore="http://" addonAfter=".com" disabled />
    <Input placeholder="Outline Disabled" prefix="￥" suffix="RMB" disabled />
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
      disabled
      defaultValue="mysite"
    />
    <Input defaultValue="Borderless Disabled" variant="borderless" disabled />
    <Input placeholder="Borderless AllowClear" variant="borderless" allowClear />
    <Input placeholder="Borderless" variant="borderless" />
    <Input placeholder="Borderless" prefix="￥" suffix="RMB" variant="borderless" />
    <Input
      prefix="￥"
      suffix="RMB"
      disabled
      variant="borderless"
      defaultValue="Borderless Disabled"
    />
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
      disabled
      variant="borderless"
      defaultValue="Borderless Disabled"
    />
    <Input defaultValue="Filled" variant="filled" />
    <Input defaultValue="Filled AllowClear" variant="filled" allowClear />
    <Input defaultValue="Filled Disabled" variant="filled" disabled />
    <Input placeholder="Filled" prefix="￥" suffix="RMB" variant="filled" />
    <Input placeholder="Filled Disabled" prefix="￥" suffix="RMB" variant="filled" disabled />
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
      variant="filled"
      placeholder="Filled"
    />
    <Input
      addonBefore={
        <Select
          defaultValue="http://"
          options={[
            { value: 'http://', label: 'http://' },
            { value: 'https://', label: 'https://' },
          ]}
          disabled
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
      variant="filled"
      placeholder="Filled Disabled"
      disabled
    />
    <TextArea placeholder="Unbordered" bordered={false} />
    <TextArea placeholder="Unbordered" bordered={false} allowClear />
  </Space>
);

export default App;
