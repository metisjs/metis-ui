import React, { useState } from 'react';
import {
  Button,
  Cascader,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Segmented,
  Select,
  Switch,
} from 'metis-ui';

type SizeType = Parameters<typeof Form>[0]['size'];

const App: React.FC = () => {
  const [componentSize, setComponentSize] = useState<SizeType | 'middle'>('middle');

  const onFormLayoutChange = (_: any, { size }: { size: SizeType }) => {
    setComponentSize(size);
  };

  return (
    <Form
      layout="horizontal"
      initialValues={{ size: componentSize }}
      onValuesChange={onFormLayoutChange}
      size={componentSize as SizeType}
      className="max-w-[600px]"
    >
      <Form.Item label="Form Size" name="size">
        <Segmented
          options={[
            { label: 'Mini', value: 'mini' },
            { label: 'Small', value: 'small' },
            { label: 'Default', value: 'middle' },
            { label: 'Large', value: 'large' },
          ]}
        />
      </Form.Item>
      <Form.Item label="Input">
        <Input />
      </Form.Item>
      <Form.Item label="Select">
        <Select options={[{ value: 'demo', label: 'Demo' }]}></Select>
      </Form.Item>
      <Form.Item label="Cascader">
        <Cascader
          options={[
            {
              value: 'zhejiang',
              label: 'Zhejiang',
              children: [{ value: 'hangzhou', label: 'Hangzhou' }],
            },
          ]}
        />
      </Form.Item>
      <Form.Item label="DatePicker">
        <DatePicker />
      </Form.Item>
      <Form.Item label="InputNumber">
        <InputNumber />
      </Form.Item>
      <Form.Item label="Switch" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item label="Button">
        <Button>Button</Button>
      </Form.Item>
    </Form>
  );
};

export default App;
