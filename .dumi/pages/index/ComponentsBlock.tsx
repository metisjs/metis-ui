import React from 'react';
import { InboxOutline } from '@metisjs/icons';
import dayjs from 'dayjs';
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Calendar,
  Cascader,
  Checkbox,
  clsx,
  ColorPicker,
  DatePicker,
  Descriptions,
  Input,
  InputNumber,
  List,
  Radio,
  Select,
  Slider,
  Space,
  Statistic,
  Switch,
  Table,
  TableProps,
  Tabs,
  Tag,
  TimePicker,
  Upload,
} from 'metis-ui';
import ContentPlaceholder from './ContentPlaceholder';

interface DataType {
  key: number;
  status: string | number;
  avatar: string;
  progress: number;
  money: number;
  rate: number;
  createdAt: number;
}

const statusEnum = {
  running: { label: 'Running', status: 'processing' },
  online: { label: 'Online', status: 'success' },
  error: { label: 'Error', status: 'error' },
} as const;

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Index',
    dataIndex: 'index',
    valueType: 'indexBorder',
  },
  {
    title: 'Avatar',
    dataIndex: 'avatar',
    valueType: 'avatar',
  },
  {
    title: 'Tag',
    dataIndex: 'status',
    valueType: 'tag',
    valueEnum: statusEnum,
  },
  {
    title: 'Progress',
    dataIndex: 'progress',
    valueType: (record) => ({
      type: 'progress',
      status: record.status !== 'error' ? 'active' : 'exception',
    }),
    width: 200,
  },
  {
    title: 'Money',
    dataIndex: 'money',
    valueType: 'money',
  },
  {
    title: 'Rate',
    dataIndex: 'rate',
    valueType: 'rate',
  },
  {
    title: 'FromNow',
    dataIndex: 'createdAt',
    valueType: 'fromNow',
  },
];

const tableData: DataType[] = [
  {
    key: 1,
    avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=100',
    status: 'running',
    money: 100,
    progress: 50,
    rate: 3,
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
  },
  {
    key: 2,
    avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=20',
    status: 'online',
    money: 160,
    progress: 35,
    rate: 4,
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
  },
  {
    key: 3,
    avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=18',
    status: 'error',
    money: 124,
    progress: 88,
    rate: 4.5,
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
  },
];

const listData = [
  {
    title: 'Advanced Tailwind Techniques',
    description: 'Explore advanced Tailwind CSS techniques for creating responsive designs.',
  },
  {
    title: 'Optimizing Frontend Performance',
    description: 'Tips and tricks to improve the performance of your frontend applications.',
  },
  {
    title: 'Dynamic Data Handling',
    description: 'Learn how to handle dynamic data in React with Metis UI components.',
  },
];

const descriptionData = [
  {
    key: '1',
    label: 'Product',
    content: 'Cloud Database',
  },
  {
    key: '2',
    label: 'Billing Mode',
    content: 'Prepaid',
  },
  {
    key: '3',
    label: 'Automatic Renewal',
    content: 'YES',
  },
  {
    key: '6',
    label: 'Status',
    content: <Badge status="processing" text="Running" />,
  },
  {
    key: '4',
    label: 'Order time',
    content: '2018-04-24 18:00:00',
  },
  {
    key: '5',
    label: 'Usage Time',
    content: '2019-04-24 18:00:00',
    span: 2,
  },
];

const ComponentsBlock: React.FC = () => {
  return (
    <div className="absolute top-1/2 left-1/2 flex w-[2304px] origin-center -translate-1/2 scale-50 rotate-x-55 rotate-y-0 -rotate-z-45 gap-6 transform-3d sm:scale-75 lg:scale-100">
      <div className="flex w-0 flex-1 flex-col items-end gap-6 pt-65">
        <div className="flex flex-wrap justify-end gap-4 rounded-lg bg-white p-6 dark:bg-gray-950/50">
          {Array.from({ length: 40 }).map((_, index) => (
            <Tag
              key={index}
              color={['default', 'success', 'error', 'warning', 'processing'][index % 5]}
            >
              {['Default', 'Success', 'Error', 'Warning', 'Processing'][index % 5]}
            </Tag>
          ))}
        </div>
        <div className="flex w-120 flex-wrap justify-end gap-4 rounded-lg bg-white p-6 dark:bg-gray-950/50">
          <Button type="primary" className="bg-erd-600 dark:bg-red-500">
            Red
          </Button>
          <Button type="primary" className="bg-rose-600 dark:bg-rose-500">
            Rose
          </Button>
          <Button type="primary" className="bg-pink-600 dark:bg-pink-500">
            Pink
          </Button>
          <Button type="primary" className="bg-fuchsia-600 dark:bg-fuchsia-500">
            Fuchsia
          </Button>
          <Button type="primary" className="bg-violet-600 dark:bg-violet-500">
            Violet
          </Button>
          <Button type="primary" className="bg-purple-600 dark:bg-purple-500">
            Purple
          </Button>
          <Button type="primary" className="bg-violet-600 dark:bg-violet-500">
            Violet
          </Button>
          <Button type="primary" className="bg-indigo-600 dark:bg-indigo-500">
            Indigo
          </Button>
          <Button type="primary" className="bg-blue-600 dark:bg-blue-500">
            Blue
          </Button>
          <Button type="primary" className="bg-sky-600 dark:bg-sky-500">
            Sky
          </Button>
          <Button type="primary" className="bg-cyan-600 dark:bg-cyan-500">
            Cyan
          </Button>
          <Button type="primary" className="bg-teal-600 dark:bg-teal-500">
            Teal
          </Button>
          <Button type="primary" className="bg-emerald-600 dark:bg-emerald-500">
            Emerald
          </Button>
          <Button type="primary" className="bg-green-600 dark:bg-green-500">
            Green
          </Button>
          <Button type="primary" className="bg-lime-600 dark:bg-lime-500">
            Lime
          </Button>
        </div>
        <div className="flex w-full flex-col gap-6 rounded-lg bg-white p-6 dark:bg-gray-950/50">
          <Alert
            message="Operation Successful Operation Successful"
            description="Your operation was completed successfully. You can proceed with the next steps."
            type="success"
          />
          <Alert
            message="Information Notice Information Notice"
            description="This is an informational message to keep you updated about the current status."
            type="info"
          />
          <Alert
            message="Warning Alert Warning Alert"
            description="Please be cautious! There might be potential issues that require your attention."
            type="warning"
          />
          <Alert
            message="Error Occurred Error Occurred"
            description="An error has occurred during the process. Please try again or contact support."
            type="error"
          />
        </div>
        <div className="flex flex-wrap justify-end gap-4 rounded-lg bg-white p-6 dark:bg-gray-950/50">
          {Array.from({ length: 40 }).map((_, index) => (
            <Tag
              key={index}
              color={['default', 'success', 'error', 'warning', 'processing'][index % 5]}
            >
              {['Default', 'Success', 'Error', 'Warning', 'Processing'][index % 5]}
            </Tag>
          ))}
        </div>
      </div>
      <div className="flex w-0 flex-1 flex-col gap-6 pt-6">
        <List
          dataSource={listData}
          renderItem={(item, index) => (
            <List.Item actions={[<a key="list-edit">Edit</a>, <a key="list-delete">Delete</a>]}>
              <List.Item.Meta
                avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
                title={<a href="#">{item.title}</a>}
                description={item.description}
              />
            </List.Item>
          )}
          className={{ root: 'bg-white dark:bg-gray-950/50', item: 'px-4' }}
        />
        <Statistic.Group
          items={[
            { title: 'Total Users', value: 10234, precision: 0 },
            { title: 'Revenue', value: 52345.67, precision: 2, suffix: 'USD' },
            { title: 'Active Sessions', value: 345, precision: 0 },
            { title: 'Conversion Rate', value: 12.34, precision: 2, suffix: '%' },
          ]}
          className="rounded-lg bg-white p-6 dark:bg-gray-950/50"
        />
        <Table
          columns={columns}
          dataSource={tableData}
          pagination={false}
          className="rounded-lg bg-white dark:bg-gray-950/50"
        />

        <Calendar
          events={[
            {
              key: 1,
              title: 'Event 0',
              start: dayjs().subtract(1, 'day'),
              end: dayjs().add(3, 'day'),
              allDay: true,
            },
            {
              key: 2,
              title: 'Event 0',
              start: dayjs().set('hours', 8),
              end: dayjs().set('hours', 18),
              allDay: false,
            },
          ]}
          className="h-140 rounded-lg bg-white dark:bg-gray-950/50"
        />
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: '1',
              label: 'My Account',
              content: <ContentPlaceholder />,
            },
            {
              key: '2',
              label: 'Company',
              content: <ContentPlaceholder />,
            },
            {
              key: '3',
              label: 'Team Members',
              content: <ContentPlaceholder />,
            },
          ]}
          className="rounded-lg bg-white p-6 dark:bg-gray-950/50"
        />
        <div className="rounded-lg bg-white p-6 dark:bg-gray-950/50">
          <Descriptions bordered column={2} items={descriptionData} />
        </div>
      </div>
      <div className="grid w-0 flex-1 grid-cols-3 content-start gap-6 bg-white p-6 pt-100 lg:pt-160 dark:bg-gray-950/50">
        <Space>
          <Switch defaultChecked />
          <Switch
            defaultChecked
            className={({ checked }) => clsx(checked && 'bg-blue-600 dark:bg-blue-500')}
          />
          <Switch
            defaultChecked
            className={({ checked }) => clsx(checked && 'bg-sky-600 dark:bg-sky-500')}
          />
          <Switch
            defaultChecked
            className={({ checked }) => clsx(checked && 'bg-lime-600 dark:bg-lime-500')}
          />
          <Switch
            defaultChecked
            className={({ checked }) => clsx(checked && 'bg-teal-600 dark:bg-teal-500')}
          />
          <Switch
            defaultChecked
            className={({ checked }) => clsx(checked && 'bg-pink-600 dark:bg-pink-500')}
          />
        </Space>
        <InputNumber className="col-span-3 w-full" />
        <Checkbox.Group
          defaultValue={['apple']}
          options={[
            { value: 'apple', label: 'Apple' },
            { value: 'orange', label: 'Orange' },
            { value: 'pear', label: 'Pear' },
          ]}
          className="col-span-3"
        />
        <Input className="col-span-3" />
        <Input.TextArea className="col-span-3" />
        <Select className="col-span-3" />
        <Slider className="col-span-3" defaultValue={35} />
        <Upload.Dragger className="col-span-3">
          <p className="mb-4 text-center">
            <InboxOutline className="text-primary h-12 w-12" />
          </p>
          <p className="mb-1 text-center text-base">Click or drag file to this area to upload</p>
          <p className="text-text-tertiary text-center">
            Support for a single or bulk upload. Strictly prohibited from uploading company data or
            other banned files.
          </p>
        </Upload.Dragger>
        <TimePicker className="col-span-1" />
        <DatePicker className="col-span-2" />
        <DatePicker.RangePicker className="col-span-3" />
        <Radio.Group
          defaultValue="apple"
          options={[
            { value: 'apple', label: 'Apple' },
            { value: 'orange', label: 'Orange' },
            { value: 'pear', label: 'Pear' },
          ]}
        />
        <Cascader
          defaultValue={['jiangsu', 'nanjing']}
          options={[
            {
              value: 'zhejiang',
              label: 'Zhejiang',
              children: [
                {
                  value: 'hangzhou',
                  label: 'Hangzhou',
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
                },
              ],
            },
          ]}
          className="col-span-3"
        />
        <ColorPicker defaultValue="#4f46e5" showText />
      </div>
    </div>
  );
};

export default ComponentsBlock;
