import React from 'react';
import { Button, Form, Input, Select, Space, Tooltip } from 'metis-ui';

const onFinish = (values: any) => {
  console.log('Received values of form: ', values);
};

const App: React.FC = () => (
  <Form name="complex-form" onFinish={onFinish} className="max-w-[600px]">
    <Form.Item label="Username">
      <Space>
        <Form.Item
          name="username"
          noStyle
          rules={[{ required: true, message: 'Username is required' }]}
        >
          <Input className="w-40" placeholder="Please input" />
        </Form.Item>
        <Tooltip title="Useful information">
          <a href="#API">Need Help?</a>
        </Tooltip>
      </Space>
    </Form.Item>
    <Form.Item label="Address">
      <Space.Compact>
        <Form.Item
          name={['address', 'province']}
          noStyle
          rules={[{ required: true, message: 'Province is required' }]}
        >
          <Select
            options={[
              { value: 'Zhejiang', label: 'Zhejiang' },
              { value: 'Jiangsu', label: 'Jiangsu' },
            ]}
            placeholder="Select province"
          ></Select>
        </Form.Item>
        <Form.Item
          name={['address', 'street']}
          noStyle
          rules={[{ required: true, message: 'Street is required' }]}
        >
          <Input className="w-1/2" placeholder="Input street" />
        </Form.Item>
      </Space.Compact>
    </Form.Item>
    <Form.Item label="BirthDate" className="mb-0">
      <Form.Item
        name="year"
        rules={[{ required: true }]}
        className="inline-block w-[calc(50%-8px)]"
      >
        <Input placeholder="Input birth year" />
      </Form.Item>
      <Form.Item
        name="month"
        rules={[{ required: true }]}
        className="mx-2 my-0 inline-block w-[calc(50%-8px)]"
      >
        <Input placeholder="Input birth month" />
      </Form.Item>
    </Form.Item>
    <Form.Item>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>
  </Form>
);

export default App;
