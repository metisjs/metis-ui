import { EllipsisHorizontalOutline } from '@metisjs/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import React, { useState } from 'react';
import type { ConfigProviderProps, TableProps, TourProps, UploadFile } from 'metis-ui';
import {
  Button,
  Calendar,
  ConfigProvider,
  DatePicker,
  Divider,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Pagination,
  Popconfirm,
  QRCode,
  Segmented,
  Select,
  Space,
  Table,
  TimePicker,
  Tour,
  Transfer,
  Upload,
} from 'metis-ui';
import enUS from 'metis-ui/locale/en_US';
import zhCN from 'metis-ui/locale/zh_CN';

type Locale = ConfigProviderProps['locale'];

const { RangePicker } = DatePicker;

const columns: TableProps['columns'] = [
  {
    title: 'Name',
    dataIndex: 'name',
    filter: { items: [{ label: 'filter1', value: 'filter1' }] },
  },
  {
    title: 'Age',
    dataIndex: 'age',
  },
];

const Page: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const tourRefs = React.useRef<HTMLElement[]>([]);

  const showModal = () => {
    setOpen(true);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const info = () => {
    Modal.info({
      title: 'some info',
      content: 'some info',
    });
  };

  const confirm = () => {
    Modal.confirm({
      title: 'some info',
      content: 'some info',
    });
  };

  const steps: TourProps['steps'] = [
    {
      title: 'Upload File',
      description: 'Put your files here.',
      target: () => tourRefs.current[0],
    },
    {
      title: 'Save',
      description: 'Save your changes.',
      target: () => tourRefs.current[1],
    },
    {
      title: 'Other Actions',
      description: 'Click to see other actions.',
      target: () => tourRefs.current[2],
    },
  ];

  const fileList: UploadFile[] = [
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      uid: '-2',
      percent: 50,
      name: 'image.png',
      status: 'uploading',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      uid: '-3',
      name: 'image.png',
      status: 'error',
    },
  ];

  return (
    <Space vertical block size={[0, 16]} className="border-t-border w-full border-t pt-4">
      <Pagination defaultCurrent={1} total={50} showSizeChanger />
      <Space wrap>
        <Select
          showSearch
          options={[
            { label: 'Jack', value: 'jack' },
            { label: 'Lucy', value: 'lucy' },
          ]}
          className="w-[200px]"
        ></Select>
        <DatePicker />
        <TimePicker />
        <RangePicker />
      </Space>
      <Space wrap>
        <Button type="primary" onClick={showModal}>
          Show Modal
        </Button>
        <Button onClick={info}>Show info</Button>
        <Button onClick={confirm}>Show confirm</Button>
        <Popconfirm title="Question?">
          <a href="#">Click to confirm</a>
        </Popconfirm>
      </Space>
      <Transfer dataSource={[]} showSearch targetKeys={[]} />
      <Calendar value={dayjs()} className="border-border h-160 w-full rounded-lg border" />
      <Form name="basic" autoComplete="off">
        <Form.Item label="Username" name="username" rules={[{ required: true }]}>
          <Input width={200} />
        </Form.Item>
        <Form.Item
          label="Age"
          name="age"
          rules={[{ type: 'number', min: 0, max: 99 }]}
          initialValue={100}
        >
          <InputNumber width={200} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
      <Table dataSource={[]} columns={columns} />
      <Modal title="Locale Modal" open={open} onCancel={hideModal}>
        <p>Locale Modal</p>
      </Modal>
      <Space wrap size={80}>
        <QRCode
          value="https://metisui.com/"
          status="expired"
          onRefresh={() => console.log('refresh')}
        />
        <Image
          width={160}
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        />
      </Space>
      <Upload listType="picture-card" fileList={fileList} />
      <Divider orientation="left">Tour</Divider>
      <Button type="primary" onClick={() => setTourOpen(true)}>
        Begin Tour
      </Button>
      <Space>
        <Button
          ref={(node) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            node && tourRefs.current.splice(0, 0, node);
          }}
        >
          {' '}
          Upload
        </Button>
        <Button
          ref={(node) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            node && tourRefs.current.splice(1, 0, node);
          }}
          type="primary"
        >
          Save
        </Button>
        <Button
          ref={(node) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            node && tourRefs.current.splice(2, 0, node);
          }}
          icon={<EllipsisHorizontalOutline />}
        />
      </Space>
      <Tour open={tourOpen} steps={steps} onClose={() => setTourOpen(false)} />
    </Space>
  );
};

const App: React.FC = () => {
  const [locale, setLocal] = useState<Locale>(enUS);

  const changeLocale = (localeValue: Locale) => {
    setLocal(localeValue);
  };

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <span style={{ marginInlineEnd: 16 }}>Change locale of components:</span>
        <Segmented
          options={[
            { key: 'en', label: 'English', value: enUS },
            { key: 'zh', label: '中文', value: zhCN },
          ]}
          value={locale}
          onChange={changeLocale}
        ></Segmented>
      </div>
      <ConfigProvider locale={locale}>
        <Page />
      </ConfigProvider>
    </>
  );
};

export default App;
