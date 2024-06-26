import { Input, Select, Space } from 'metis-ui';
import React from 'react';

const { TextArea } = Input;

const App: React.FC = () => (
  <Space vertical className="flex">
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
    <Input placeholder="Borderless ShowCount" variant="borderless" showCount maxLength={100} />
    <Input
      placeholder="Borderless Disabled ShowCount"
      variant="borderless"
      showCount
      maxLength={100}
      disabled
    />
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
    <Input placeholder="Filled ShowCount" variant="filled" showCount maxLength={100} />
    <Input
      placeholder="Filled Disabled ShowCount"
      variant="filled"
      showCount
      maxLength={100}
      disabled
    />
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
    <TextArea placeholder="Outlined Disabled" disabled showCount maxLength={1000} />
    <TextArea placeholder="Borderless" variant="borderless" />
    <TextArea placeholder="Borderless AllowClear" variant="borderless" allowClear />
    <TextArea placeholder="Borderless ShowCount" variant="borderless" showCount maxLength={1000} />
    <TextArea placeholder="Borderless Disabled" variant="borderless" disabled />
    <TextArea
      placeholder="Borderless ShowCount Disabled"
      variant="borderless"
      showCount
      maxLength={1000}
      disabled
    />
    <TextArea placeholder="Filled" variant="filled" />
    <TextArea placeholder="Filled AllowClear" variant="filled" allowClear />
    <TextArea placeholder="Filled ShowCount" variant="filled" showCount maxLength={1000} />
    <TextArea placeholder="Filled Disabled" variant="filled" disabled />
    <TextArea
      placeholder="Filled ShowCount Disabled"
      variant="filled"
      showCount
      maxLength={1000}
      disabled
    />
  </Space>
);

export default App;
