import React from 'react';
import { MinusCircleOutline, PlusOutline } from '@metisjs/icons';
import { Button, Form, Input, Space } from 'metis-ui';

const onFinish = (values: any) => {
  console.log('Received values of form:', values);
};

const App: React.FC = () => (
  <Form
    name="dynamic_form_nest_item"
    onFinish={onFinish}
    className="max-w-[600px]"
    autoComplete="off"
  >
    <Form.List name="users">
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...restField }) => (
            <Space key={key} block align="start">
              <Form.Item
                {...restField}
                name={[name, 'first']}
                rules={[{ required: true, message: 'Missing first name' }]}
              >
                <Input placeholder="First Name" />
              </Form.Item>
              <Form.Item
                {...restField}
                name={[name, 'last']}
                rules={[{ required: true, message: 'Missing last name' }]}
              >
                <Input placeholder="Last Name" />
              </Form.Item>
              <MinusCircleOutline
                className="relative top-1.5 h-6 w-6 cursor-pointer text-text-secondary hover:text-primary"
                onClick={() => remove(name)}
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
    <Form.Item>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>
  </Form>
);

export default App;
