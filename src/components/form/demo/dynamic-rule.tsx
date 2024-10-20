import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Form, Input } from 'metis-ui';

const App: React.FC = () => {
  const [form] = Form.useForm();
  const [checkNick, setCheckNick] = useState(false);

  useEffect(() => {
    form.validateFields(['nickname']);
  }, [checkNick, form]);

  const onCheckboxChange = (e: { target: { checked: boolean } }) => {
    setCheckNick(e.target.checked);
  };

  const onCheck = async () => {
    try {
      const values = await form.validateFields();
      console.log('Success:', values);
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  return (
    <Form form={form} name="dynamic_rule" labelWidth="30%" className="max-w-[600px]">
      <Form.Item
        name="username"
        label="Name"
        rules={[{ required: true, message: 'Please input your name' }]}
      >
        <Input placeholder="Please input your name" />
      </Form.Item>
      <Form.Item
        name="nickname"
        label="Nickname"
        rules={[{ required: checkNick, message: 'Please input your nickname' }]}
      >
        <Input placeholder="Please input your nickname" />
      </Form.Item>
      <Form.Item>
        <Checkbox checked={checkNick} onChange={onCheckboxChange}>
          Nickname is required
        </Checkbox>
      </Form.Item>
      <Form.Item>
        <Button type="primary" onClick={onCheck}>
          Check
        </Button>
      </Form.Item>
    </Form>
  );
};

export default App;
