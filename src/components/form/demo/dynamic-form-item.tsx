import React from 'react';
import { MinusCircleOutline, PlusOutline } from '@metisjs/icons';
import { Button, Form, Input } from 'metis-ui';

const App: React.FC = () => {
  const onFinish = (values: any) => {
    console.log('Received values of form:', values);
  };

  return (
    <Form name="dynamic_form_item" onFinish={onFinish} className="max-w-[600px]" labelWidth="16%">
      <Form.List
        name="names"
        rules={[
          {
            validator: async (_, names) => {
              if (!names || names.length < 2) {
                return Promise.reject(new Error('At least 2 passengers'));
              }
            },
          },
        ]}
      >
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map((field, index) => (
              <Form.Item label={index === 0 ? 'Passengers' : ''} required={false} key={field.key}>
                <Form.Item
                  {...field}
                  validateTrigger={['onChange', 'onBlur']}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "Please input passenger's name or delete this field.",
                    },
                  ]}
                  noStyle
                >
                  <Input placeholder="passenger name" style={{ width: '60%' }} />
                </Form.Item>
                {fields.length > 1 ? (
                  <MinusCircleOutline
                    className="ml-2 h-6 w-6 cursor-pointer text-text-secondary hover:text-primary"
                    onClick={() => remove(field.name)}
                  />
                ) : null}
              </Form.Item>
            ))}
            <Form.Item>
              <Button onClick={() => add()} icon={<PlusOutline />} className="w-3/5">
                Add field
              </Button>
              <Button
                onClick={() => {
                  add('The head item', 0);
                }}
                className="mt-5 w-3/5"
                icon={<PlusOutline />}
              >
                Add field at head
              </Button>
              <Form.ErrorList errors={errors} />
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
};

export default App;
