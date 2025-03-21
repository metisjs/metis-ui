import React from 'react';
import { InboxOutline } from '@metisjs/icons';
import type { CascaderProps, FormProps } from 'metis-ui';
import { Form, Upload } from 'metis-ui';

interface DataNodeType {
  value: string;
  label: string;
  children?: DataNodeType[];
}

const residences: CascaderProps<DataNodeType>['options'] = [
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
];

const items: FormProps['items'] = [
  {
    name: 'text',
    label: 'Text',
    rules: [{ required: true }],
  },
  {
    name: 'checkbox',
    label: 'Checkbox',
    valueType: 'checkbox',
    valueEnum: {
      running: 'Running',
      online: 'Online',
      error: 'Error',
    },
  },
  {
    name: 'select',
    label: 'Select',
    valueEnum: {
      running: 'Running',
      online: 'Online',
      error: 'Error',
    },
  },
  {
    name: 'cascader',
    label: 'Cascader',
    valueType: { type: 'cascader', options: residences },
  },
  {
    name: 'rate',
    label: 'Rate',
    valueType: 'rate',
  },
  {
    name: 'switch',
    label: 'Switch',
    valueType: 'switch',
  },
  {
    name: 'money',
    label: 'Money',
    valueType: 'money',
  },
  {
    name: 'percent',
    label: 'Percent',
    valueType: 'percent',
  },
  {
    name: 'slider',
    label: 'Slider',
    valueType: 'slider',
  },
  {
    name: 'date',
    label: 'Date',
    valueType: 'date',
  },
  {
    name: 'dateRange',
    label: 'DateRange',
    valueType: 'dateRange',
  },
  {
    name: 'custom',
    label: 'Custom',
    fieldRender: () => (
      <Upload.Dragger name="files" action="/upload.do">
        <p className="mb-4">
          <InboxOutline className="h-12 w-12 text-primary" />
        </p>
        <p className="mb-1 text-base">Click or drag file to this area to upload</p>
        <p className="text-text-tertiary">Support for a single or bulk upload.</p>
      </Upload.Dragger>
    ),
  },
  {
    name: 'textarea',
    label: 'Textarea',
    valueType: 'textarea',
    fieldProps: { showCount: true, maxLength: 100 },
  },
];

const App: React.FC = () => {
  const [form] = Form.useForm();

  return <Form form={form} items={items} />;
};

export default App;
