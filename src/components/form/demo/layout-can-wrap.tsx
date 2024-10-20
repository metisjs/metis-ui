import React from 'react';
import { Button, Form, Input } from 'metis-ui';

const App: React.FC = () => (
  <Form
    name="wrap"
    labelAlign="left"
    labelWrap
    labelWidth={110}
    colon={false}
    className="max-w-[600px]"
  >
    <Form.Item label="Normal label" name="username" rules={[{ required: true }]}>
      <Input />
    </Form.Item>

    <Form.Item label="A super long label text" name="password" rules={[{ required: true }]}>
      <Input />
    </Form.Item>

    <Form.Item>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>
  </Form>
);

export default App;
