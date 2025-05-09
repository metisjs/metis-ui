import React, { useState } from 'react';
import { Button, clsx, Form, Input, Segmented } from 'metis-ui';

type LayoutType = Parameters<typeof Form>[0]['layout'];

const App: React.FC = () => {
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState<LayoutType>('horizontal');

  const onFormLayoutChange = (_: any, { layout }: { layout: LayoutType }) => {
    setFormLayout(layout);
  };

  return (
    <Form
      layout={formLayout}
      form={form}
      initialValues={{ layout: formLayout }}
      onValuesChange={onFormLayoutChange}
      className={clsx('max-w-150', {
        'max-w-none': formLayout === 'inline',
      })}
    >
      <Form.Item label="Form Layout" name="layout">
        <Segmented
          options={[
            { label: 'Horizontal', value: 'horizontal' },
            { label: 'Vertical', value: 'vertical' },
            { label: 'Inline', value: 'inline' },
          ]}
        ></Segmented>
      </Form.Item>
      <Form.Item label="Field A">
        <Input placeholder="input placeholder" />
      </Form.Item>
      <Form.Item label="Field B">
        <Input placeholder="input placeholder" />
      </Form.Item>
      <Form.Item>
        <Button type="primary">Submit</Button>
      </Form.Item>
    </Form>
  );
};

export default App;
