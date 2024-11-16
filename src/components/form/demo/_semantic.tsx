import React from 'react';
import { Button, Checkbox, Form, Input } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};
const App: React.FC = () => (
  <SemanticPreview
    semantics={[
      { name: 'root' },
      { name: 'item', children: [{ name: 'label' }, { name: 'field' }] },
    ]}
  >
    <Form
      name="basic"
      labelWidth="30%"
      initialValues={{ remember: true }}
      autoComplete="off"
      className="w-[360px]"
    >
      <Form.Item<FieldType>
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item<FieldType> name="remember" valuePropName="checked">
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  </SemanticPreview>
);

export default App;
