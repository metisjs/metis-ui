import React from 'react';
import { MinusCircleOutline, PlusOutline } from '@metisjs/icons';
import { Button, Form, Input, Space } from 'metis-ui';

const onFinish = (values: any) => {
  console.log('Received values of form:', values);
};

const App: React.FC = () => (
  <Form
    name="dynamic_form_no_style"
    onFinish={onFinish}
    className="max-w-[600px]"
    autoComplete="off"
  >
    <Form.Item label="Users">
      <Form.List name="users">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => (
              <Space key={field.key} className="mb-4">
                <Form.Item noStyle name={[field.name, 'lastName']} rules={[{ required: true }]}>
                  <Input placeholder="Last Name" />
                </Form.Item>
                <Form.Item noStyle name={[field.name, 'firstName']} rules={[{ required: true }]}>
                  <Input placeholder="First Name" />
                </Form.Item>
                <MinusCircleOutline
                  onClick={() => {
                    remove(field.name);
                  }}
                  className="h-6 w-6 flex-shrink-0 cursor-pointer text-text-secondary hover:text-primary"
                />
              </Space>
            ))}
            <Form.Item>
              <Button onClick={() => add()} icon={<PlusOutline />} className="w-full">
                Add field
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </Form.Item>
    <Form.Item>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>
  </Form>
);

export default App;
