import React from 'react';
import { Button, Form, Mentions, Space } from 'metis-ui';

const { getMentions } = Mentions;

const App: React.FC = () => {
  const [form] = Form.useForm();

  const onReset = () => {
    form.resetFields();
  };

  const onFinish = async () => {
    try {
      const values = await form.validateFields();
      console.log('Submit:', values);
    } catch (errInfo) {
      console.log('Error:', errInfo);
    }
  };

  const checkMention = async (_: any, value: string) => {
    const mentions = getMentions(value);

    if (mentions.length < 2) {
      throw new Error('More than one must be selected!');
    }
  };

  return (
    <Form form={form} layout="horizontal" onFinish={onFinish}>
      <Form.Item name="coders" label="Top coders" rules={[{ validator: checkMention }]}>
        <Mentions
          rows={1}
          options={[
            {
              value: 'tom',
              label: 'tom',
            },
            {
              value: 'jack',
              label: 'jack',
            },
            {
              value: 'minm',
              label: 'minm',
            },
          ]}
        />
      </Form.Item>
      <Form.Item name="bio" label="Bio" rules={[{ required: true }]}>
        <Mentions
          rows={3}
          placeholder="You can use @ to ref user here"
          options={[
            {
              value: 'tom',
              label: 'tom',
            },
            {
              value: 'jack',
              label: 'jack',
            },
            {
              value: 'minm',
              label: 'minm',
            },
          ]}
        />
      </Form.Item>
      <Form.Item>
        <Space wrap>
          <Button htmlType="submit" type="primary">
            Submit
          </Button>
          <Button htmlType="button" onClick={onReset}>
            Reset
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default App;
