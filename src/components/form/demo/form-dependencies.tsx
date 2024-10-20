import React from 'react';
import { Alert, Form, Input } from 'metis-ui';

const App: React.FC = () => {
  const [form] = Form.useForm();
  return (
    <Form
      form={form}
      name="dependencies"
      autoComplete="off"
      className="max-w-[600px]"
      layout="vertical"
    >
      <Alert
        message=" Try modify `Password2` and then modify `Password`"
        type="info"
        showIcon
        className="mb-6"
      />

      <Form.Item label="Password" name="password" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      {/* Field */}
      <Form.Item
        label="Confirm Password"
        name="password2"
        dependencies={['password']}
        rules={[
          {
            required: true,
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('The new password that you entered do not match!'));
            },
          }),
        ]}
      >
        <Input />
      </Form.Item>

      {/* Render Props */}
      <Form.Item noStyle dependencies={['password2']}>
        {() => (
          <div>
            <p>
              Only Update when <code>password2</code> updated:
            </p>
            <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>
          </div>
        )}
      </Form.Item>
    </Form>
  );
};

export default App;
