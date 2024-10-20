import React from 'react';
import { Form, Input } from 'metis-ui';

const App: React.FC = () => (
  <>
    <Form name="layout-multiple-horizontal" layout="horizontal">
      <Form.Item label="horizontal" name="horizontal" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item layout="vertical" label="vertical" name="vertical" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
    </Form>
    <br />
    <Form name="layout-multiple-vertical" layout="vertical">
      <Form.Item label="vertical" name="vertical" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item
        layout="horizontal"
        label="horizontal"
        name="horizontal"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
    </Form>
  </>
);

export default App;
