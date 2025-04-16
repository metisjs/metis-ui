import React, { useState } from 'react';
import { PlusOutline } from '@metisjs/icons';
import { Button, DatePicker, Drawer, Form, Input, Select } from 'metis-ui';

const App: React.FC = () => {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button type="primary" onClick={showDrawer} icon={<PlusOutline />}>
        New account
      </Button>
      <Drawer
        title="Create a new account"
        width={720}
        onClose={onClose}
        open={open}
        footer={
          <>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={onClose} type="primary">
              Submit
            </Button>
          </>
        }
      >
        <Form layout="vertical" column={2} requiredMark={false}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter user name' }]}
          >
            <Input placeholder="Please enter user name" />
          </Form.Item>
          <Form.Item
            name="url"
            label="Url"
            rules={[{ required: true, message: 'Please enter url' }]}
          >
            <Input
              className="w-full"
              addonBefore="http://"
              addonAfter=".com"
              placeholder="Please enter url"
            />
          </Form.Item>
          <Form.Item
            name="owner"
            label="Owner"
            rules={[{ required: true, message: 'Please select an owner' }]}
          >
            <Select
              options={[
                {
                  label: 'Xiaoxiao Fu',
                  value: 'xiao',
                },
                {
                  label: 'Maomao Zhou',
                  value: 'mao',
                },
              ]}
              placeholder="Please select an owner"
            ></Select>
          </Form.Item>
          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: 'Please choose the type' }]}
          >
            <Select
              options={[
                {
                  label: 'Private',
                  value: 'private',
                },
                {
                  label: 'Public',
                  value: 'public',
                },
              ]}
              placeholder="Please choose the type"
            ></Select>
          </Form.Item>
          <Form.Item
            name="approver"
            label="Approver"
            rules={[{ required: true, message: 'Please choose the approver' }]}
          >
            <Select
              options={[
                {
                  label: 'Jack Ma',
                  value: 'jack',
                },
                {
                  label: 'Tom Liu',
                  value: 'tom',
                },
              ]}
              placeholder="Please choose the approver"
            ></Select>
          </Form.Item>
          <Form.Item
            name="dateTime"
            label="DateTime"
            rules={[{ required: true, message: 'Please choose the dateTime' }]}
          >
            <DatePicker.RangePicker
              className="w-full"
              getPopupContainer={(trigger) => trigger.parentElement!}
            />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              {
                required: true,
                message: 'please enter url description',
              },
            ]}
            span={2}
          >
            <Input.TextArea rows={4} placeholder="please enter url description" />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default App;
