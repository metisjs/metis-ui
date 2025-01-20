import React, { useState } from 'react';
import { ArrowDownTrayOutline, Cog6ToothOutline, DocumentDuplicateOutline } from '@metisjs/icons';
import {
  Button,
  Cascader,
  DatePicker,
  Divider,
  Drawer,
  Dropdown,
  Input,
  InputNumber,
  Modal,
  Popover,
  Select,
  Space,
  Tooltip,
} from 'metis-ui';

const selectBefore = (
  <Select
    defaultValue="http://"
    options={[
      { label: 'http://', value: 'http://' },
      { label: 'https://', value: 'https://' },
    ]}
    className="select-before"
  ></Select>
);
const selectAfter = (
  <Select
    defaultValue=".com"
    options={[
      { label: '.com', value: '.com' },
      { label: '.jp', value: '.jp' },
      { label: '.cn', value: '.cn' },
      { label: '.org', value: '.org' },
    ]}
    className="select-after"
  ></Select>
);

const App: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  return (
    <Space vertical>
      <Space.Compact block>
        <Button>default Button</Button>
        <Button danger>danger Button</Button>
        <Button type="text">text Button</Button>
        <Button type="link">Link Button</Button>
        <Tooltip title="Tooltip">
          <Button icon={<ArrowDownTrayOutline />} disabled />
        </Tooltip>
      </Space.Compact>
      <br />
      <Space.Compact>
        <Button>Prefix</Button>
        <Input addonBefore="http://" addonAfter=".com" defaultValue="mysite" />
        <Button type="primary">Submit</Button>
      </Space.Compact>
      <Space.Compact>
        <Input placeholder="prefix" />
        <Input addonBefore={selectBefore} addonAfter={selectAfter} defaultValue="mysite" />
        <Button icon={<DocumentDuplicateOutline />} />
      </Space.Compact>
      <Space.Compact>
        <Input />
        <Button icon={<DocumentDuplicateOutline />} />
      </Space.Compact>
      <Space.Compact>
        <Input addonAfter={<Cog6ToothOutline />} defaultValue="mysite" />
        <Button type="primary">Submit</Button>
        <Input placeholder="suffix" addonAfter={<Cog6ToothOutline />} />
      </Space.Compact>
      <Space.Compact>
        <Input addonBefore="http://" suffix=".com" defaultValue="mysite" />
        <Button type="primary">Submit</Button>
      </Space.Compact>
      <Space.Compact>
        <Button>Prefix</Button>
        <Input
          addonBefore={<Cascader placeholder="cascader" style={{ width: 150 }} />}
          defaultValue="mysite"
        />
        <Button type="primary">Submit</Button>
      </Space.Compact>
      <Space.Compact>
        <Input addonBefore="Prefix" defaultValue="mysite" showCount />
        <Button type="primary">Submit</Button>
        <Input
          addonBefore="Prefix"
          defaultValue="mysite"
          showCount
          addonAfter={<Cog6ToothOutline />}
        />
        <Input addonBefore="Prefix" defaultValue="mys1111ite" showCount />
      </Space.Compact>
      <br />
      <Space.Compact>
        <Button onClick={() => setShowModal(true)}>debug Modal context</Button>
        {showModal && (
          <Modal title="Basic Modal" open={showModal} onCancel={() => setShowModal(false)}>
            <Button>normal button A</Button>
            <Button>normal button B</Button>
            <br />
            <br />
            <Input />
            <br />
            <br />
            <Space.Compact>
              <Button>compact button A</Button>
              <Button>compact button B</Button>
            </Space.Compact>
          </Modal>
        )}
      </Space.Compact>
      <Space.Compact>
        <Dropdown.Button
          menu={{
            items: [
              {
                key: '1',
                label: <Button>menu button</Button>,
              },
              {
                key: '2',
                label: 'normal menu item',
              },
            ],
          }}
        >
          debug Dropdown.Button context
        </Dropdown.Button>
      </Space.Compact>
      <Space.Compact>
        <Button onClick={() => setShowDrawer(true)}>debug Drawer context</Button>
        {showDrawer && (
          <Drawer
            title="Basic Drawer"
            placement="right"
            onClose={() => setShowDrawer(false)}
            open={showDrawer}
          >
            <Button>normal button A</Button>
            <Button>normal button B</Button>
            <br />
            <br />
            <Space.Compact>
              <Button>compact button A</Button>
              <Button>compact button B</Button>
            </Space.Compact>
          </Drawer>
        )}
      </Space.Compact>
      <Space.Compact>
        <Input placeholder="Debug Popover context" />
        <Popover
          content={
            <>
              <Input placeholder="Left Border" />
              <Divider />
              <DatePicker />
              <Divider />
              <InputNumber />
              <Divider />
              <Select />
            </>
          }
          trigger={['click']}
          placement="bottom"
        >
          <Button>Settings</Button>
        </Popover>
      </Space.Compact>
      <Space.Compact>
        <InputNumber addonBefore="+" addonAfter="$" defaultValue={100} />
      </Space.Compact>
      <Space.Compact>
        <Select
          defaultValue="Sign Up"
          options={[
            { label: 'Sign Up', value: 'Sign Up' },
            { label: 'Sign In', value: 'Sign In' },
          ]}
        />
      </Space.Compact>
      <Space.Compact>
        <DatePicker.RangePicker style={{ width: '70%' }} />
      </Space.Compact>
      <Space.Compact>
        <InputNumber defaultValue={12} />
      </Space.Compact>
      <Space.Compact>
        <Cascader
          style={{ width: '70%' }}
          options={[
            {
              value: 'zhejiang',
              label: 'Zhejiang',
              children: [
                {
                  value: 'hangzhou',
                  label: 'Hangzhou',
                  children: [
                    {
                      value: 'xihu',
                      label: 'West Lake',
                    },
                  ],
                },
              ],
            },
            {
              value: 'jiangsu',
              label: 'Jiangsu',
              children: [
                {
                  value: 'nanjing',
                  label: 'Nanjing',
                  children: [
                    {
                      value: 'zhonghuamen',
                      label: 'Zhong Hua Men',
                    },
                  ],
                },
              ],
            },
          ]}
          placeholder="Select Address"
        />
      </Space.Compact>
      <Space.Compact vertical>
        <Button>vertical compact button A</Button>
      </Space.Compact>
    </Space>
  );
};

export default App;
