import React from 'react';
import { Form, Input } from 'metis-ui';

const App: React.FC = () => (
  <Form name="label-ellipsis" labelWidth="30%" className="max-w-[600px]">
    <Form.Item
      label={
        <div className="truncate">longtextlongtextlongtextlongtextlongtextlongtextlongtext</div>
      }
      name="username"
    >
      <Input />
    </Form.Item>

    <Form.Item
      label={
        <div className="truncate">
          longtext longtext longtext longtext longtext longtext longtext
        </div>
      }
      name="password"
    >
      <Input.Password />
    </Form.Item>
  </Form>
);

export default App;
