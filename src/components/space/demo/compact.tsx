import React from 'react';
import { DocumentDuplicateOutline } from '@metisjs/icons';
import {
  AutoComplete,
  Button,
  Cascader,
  ColorPicker,
  DatePicker,
  Input,
  InputNumber,
  Select,
  Space,
  TimePicker,
  Tooltip,
} from 'metis-ui';

const App: React.FC = () => (
  <Space vertical>
    <Space.Compact block>
      <Input style={{ width: '20%' }} defaultValue="0571" />
      <Input style={{ width: '30%' }} defaultValue="26888888" />
    </Space.Compact>
    <Space.Compact block size="small">
      <Input style={{ width: 'calc(100% - 200px)' }} defaultValue="Metis" />
      <Button type="primary">Submit</Button>
    </Space.Compact>
    <Space.Compact block>
      <Input style={{ width: 'calc(100% - 200px)' }} defaultValue="Metis" />
      <Button type="primary">Submit</Button>
    </Space.Compact>
    <Space.Compact block>
      <Input
        style={{ width: 'calc(100% - 200px)' }}
        defaultValue="git@github.com:ant-design/ant-design.git"
      />
      <Tooltip title="copy git url">
        <Button icon={<DocumentDuplicateOutline />} />
      </Tooltip>
    </Space.Compact>
    <Space.Compact block>
      <Select
        defaultValue="Zhejiang"
        options={[
          { label: 'Zhejiang', value: 'Zhejiang' },
          { label: 'Jiangsu', value: 'Jiangsu' },
        ]}
        allowClear
      ></Select>
      <Input style={{ width: '50%' }} defaultValue="Xihu District, Hangzhou" />
    </Space.Compact>
    <Space.Compact block>
      <Select
        allowClear
        mode="multiple"
        defaultValue={['Zhejiang']}
        options={[
          { label: 'Zhejiang', value: 'Zhejiang' },
          { label: 'Jiangsu', value: 'Jiangsu' },
        ]}
        className="w-1/2"
      ></Select>
      <Input defaultValue="Xihu District, Hangzhou" className="w-1/2" />
    </Space.Compact>
    <Space.Compact block>
      <Input style={{ width: '30%' }} defaultValue="0571" />
      <Input allowClear style={{ width: '50%' }} defaultValue="26888888" />
      <Input style={{ width: '20%' }} defaultValue="+1" />
    </Space.Compact>
    <Space.Compact block>
      <Select
        defaultValue="Option1"
        options={[
          { label: 'Option1', value: 'Option1' },
          { label: 'Option2', value: 'Option2' },
        ]}
      ></Select>
      <Input style={{ width: '50%' }} defaultValue="input content" />
      <InputNumber defaultValue={12} />
    </Space.Compact>
    <Space.Compact block>
      <Input style={{ width: '50%' }} defaultValue="input content" />
      <DatePicker style={{ width: '50%' }} />
    </Space.Compact>
    <Space.Compact block>
      <DatePicker.RangePicker style={{ width: '70%' }} />
      <Input style={{ width: '30%' }} defaultValue="input content" />
      <Button type="primary">查询</Button>
    </Space.Compact>
    <Space.Compact block>
      <Input style={{ width: '30%' }} defaultValue="input content" />
      <DatePicker.RangePicker style={{ width: '70%' }} />
    </Space.Compact>
    <Space.Compact block>
      <Select
        defaultValue="Option1-1"
        options={[
          { label: 'Option1-1', value: 'Option1-1' },
          { label: 'Option1-2', value: 'Option1-2' },
        ]}
      />
      <Select
        defaultValue="Option2-2"
        options={[
          { label: 'Option2-1', value: 'Option2-1' },
          { label: 'Option2-2', value: 'Option2-2' },
        ]}
      ></Select>
    </Space.Compact>
    <Space.Compact block>
      <Select
        defaultValue="1"
        options={[
          { label: 'Between', value: '1' },
          { label: 'Except', value: '2' },
        ]}
      />
      <Input style={{ width: 100, textAlign: 'center' }} placeholder="Minimum" />
      <Input
        style={{
          width: 30,
          borderLeft: 0,
          borderRight: 0,
          pointerEvents: 'none',
        }}
        placeholder="~"
        disabled
      />
      <Input
        style={{
          width: 100,
          textAlign: 'center',
        }}
        placeholder="Maximum"
      />
    </Space.Compact>
    <Space.Compact block>
      <Select
        defaultValue="Sign Up"
        options={[
          { label: 'Sign Up', value: 'Sign Up' },
          { label: 'Sign In', value: 'Sign In' },
        ]}
        style={{ width: '30%' }}
      ></Select>
      <AutoComplete
        style={{ width: '70%' }}
        placeholder="Email"
        options={[{ value: 'text 1' }, { value: 'text 2' }]}
      />
    </Space.Compact>
    <Space.Compact block>
      <TimePicker style={{ width: '70%' }} />
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
    <Space.Compact block>
      <TimePicker.RangePicker />
      <Button type="primary">Submit</Button>
    </Space.Compact>
    <Space.Compact>
      <Input placeholder="input here" />
      <InputNumber placeholder="another input" addonBefore="$" />
      <InputNumber placeholder="another input" addonAfter="$" />
    </Space.Compact>
    <Space.Compact>
      <Input placeholder="input here" />
      <ColorPicker />
    </Space.Compact>
  </Space>
);

export default App;
