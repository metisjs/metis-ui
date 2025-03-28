import React from 'react';
import type { InputRef } from 'metis-ui';
import { Button, Form, Input } from 'metis-ui';

const App: React.FC = () => {
  const [form] = Form.useForm();
  const ref = React.useRef<InputRef>(null);

  return (
    <Form form={form} initialValues={{ list: ['light'] }} className="max-w-[600px]">
      <Form.Item name="test" label="test">
        <Input ref={ref} />
      </Form.Item>

      <Form.List name="list">
        {(fields) =>
          fields.map((field) => (
            <Form.Item {...field} key={field.key}>
              <Input ref={ref} />
            </Form.Item>
          ))
        }
      </Form.List>

      <Button
        htmlType="button"
        onClick={() => {
          form.getFieldInstance('test').focus();
        }}
      >
        Focus Form.Item
      </Button>
      <Button
        onClick={() => {
          form.getFieldInstance(['list', 0]).focus();
        }}
      >
        Focus Form.List
      </Button>
    </Form>
  );
};

export default App;
