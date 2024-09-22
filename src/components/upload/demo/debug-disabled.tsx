import React from 'react';
import { ArrowUpTrayOutline, InboxOutline, PlusOutline } from '@metisjs/icons';
import type { UploadFile } from 'metis-ui';
import { Button, Space, Upload } from 'metis-ui';

const { Dragger } = Upload;

const fileList: UploadFile[] = [
  {
    uid: '-1',
    name: 'image.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
  {
    uid: '-2',
    name: 'image.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
  {
    uid: '-xxx',
    percent: 50,
    name: 'image.png',
    status: 'uploading',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
  {
    uid: '-5',
    name: 'image.png',
    status: 'error',
  },
];

const App: React.FC = () => {
  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutline />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <Space vertical>
      <Upload disabled>Click Text to Upload</Upload>
      <Upload disabled>
        <Button icon={<ArrowUpTrayOutline />}>Click to Upload</Button>
      </Upload>
      <Upload name="avatar" listType="picture-card" fileList={fileList} disabled>
        {uploadButton}
      </Upload>
      <Upload name="avatar" listType="picture-circle" fileList={fileList} disabled>
        {uploadButton}
      </Upload>
      <Dragger disabled>
        <p className="mb-4">
          <InboxOutline className="h-12 w-12 text-text-tertiary" />
        </p>
        <p className="mb-1 text-base">Click or drag file to this area to upload</p>
        <p className="text-text-tertiary">
          Support for a single or bulk upload. Strictly prohibited from uploading company data or
          other banned files.
        </p>
      </Dragger>
    </Space>
  );
};

export default App;
