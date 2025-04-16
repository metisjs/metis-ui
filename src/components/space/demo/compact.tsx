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
      <Input className="w-1/5" defaultValue="0571" />
      <Input className="w-3/10" defaultValue="26888888" />
    </Space.Compact>
    <Space.Compact block size="small">
      <Input className="w-[calc(100%-200px)]" defaultValue="Metis" />
      <Button type="primary">Submit</Button>
    </Space.Compact>
    <Space.Compact block>
      <Input className="w-[calc(100%-200px)]" defaultValue="Metis" />
      <Button type="primary">Submit</Button>
    </Space.Compact>
    <Space.Compact block>
      <Input className="w-[calc(100%-200px)]" defaultValue="git@github.com:metisjs/metis-ui.git" />
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
      <Input className="w-1/2" defaultValue="Xihu District, Hangzhou" />
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
      <Input className="w-3/10" defaultValue="0571" />
      <Input allowClear className="w-1/2" defaultValue="26888888" />
      <Input className="w-1/5" defaultValue="+1" />
    </Space.Compact>
    <Space.Compact block>
      <Select
        defaultValue="Option1"
        options={[
          { label: 'Option1', value: 'Option1' },
          { label: 'Option2', value: 'Option2' },
        ]}
      ></Select>
      <Input className="w-1/2" defaultValue="input content" />
      <InputNumber defaultValue={12} />
    </Space.Compact>
    <Space.Compact block>
      <Input className="w-1/2" defaultValue="input content" />
      <DatePicker className="w-1/2" />
    </Space.Compact>
    <Space.Compact block>
      <DatePicker.RangePicker className="w-7/10" />
      <Input className="w-3/10" defaultValue="input content" />
      <Button type="primary">查询</Button>
    </Space.Compact>
    <Space.Compact block>
      <Input className="w-3/10" defaultValue="input content" />
      <DatePicker.RangePicker className="w-7/10" />
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
      <Input className="w-25 text-center" placeholder="Minimum" />
      <Input
        className="pointer-events-none w-[30px] border-r-0 border-l-0"
        placeholder="~"
        disabled
      />
      <Input className="w-25 text-center" placeholder="Maximum" />
    </Space.Compact>
    <Space.Compact block>
      <Select
        defaultValue="Sign Up"
        options={[
          { label: 'Sign Up', value: 'Sign Up' },
          { label: 'Sign In', value: 'Sign In' },
        ]}
        className="w-3/10"
      ></Select>
      <AutoComplete
        className="w-7/10"
        placeholder="Email"
        options={[{ value: 'text 1' }, { value: 'text 2' }]}
      />
    </Space.Compact>
    <Space.Compact block>
      <TimePicker className="w-7/10" />
      <Cascader
        className="w-7/10"
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
