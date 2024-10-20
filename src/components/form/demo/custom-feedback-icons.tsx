import React from 'react';
import { BellAlertSolid, ShieldExclamationSolid } from '@metisjs/icons';
import uniqueId from 'lodash/uniqueId';
import { Button, Form, Input, Tooltip } from 'metis-ui';

const App: React.FC = () => {
  const [form] = Form.useForm();

  return (
    <Form
      name="custom-feedback-icons"
      form={form}
      className="max-w-[600px]"
      feedbackIcons={({ errors }) => ({
        error: (
          <Tooltip
            key="tooltipKey"
            title={errors?.map((error) => <div key={uniqueId()}>{error}</div>)}
            color="red"
          >
            <ShieldExclamationSolid />
          </Tooltip>
        ),
      })}
    >
      <Form.Item
        name="custom-feedback-test-item"
        label="Test"
        rules={[{ required: true, type: 'email' }, { min: 10 }]}
        help=""
        hasFeedback
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="custom-feedback-test-item2"
        label="Test"
        rules={[{ required: true, type: 'email' }, { min: 10 }]}
        help=""
        hasFeedback={{
          icons: ({ errors }) => ({
            error: (
              <Tooltip
                key="tooltipKey"
                title={errors?.map((error) => <div key={uniqueId()}>{error}</div>)}
                color="pink"
              >
                <BellAlertSolid />
              </Tooltip>
            ),
            success: false,
          }),
        }}
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit">Submit</Button>
      </Form.Item>
    </Form>
  );
};

export default App;
