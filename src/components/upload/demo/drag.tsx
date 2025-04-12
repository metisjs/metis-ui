import React from 'react';
import { InboxOutline } from '@metisjs/icons';
import type { UploadProps } from 'metis-ui';
import { message, Upload } from 'metis-ui';

const { Dragger } = Upload;

const props: UploadProps = {
  name: 'file',
  multiple: true,
  action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
  },
};

const App: React.FC = () => (
  <Dragger {...props}>
    <p className="mb-4 text-center">
      <InboxOutline className="text-primary h-12 w-12" />
    </p>
    <p className="mb-1 text-center text-base">Click or drag file to this area to upload</p>
    <p className="text-text-tertiary text-center">
      Support for a single or bulk upload. Strictly prohibited from uploading company data or other
      banned files.
    </p>
  </Dragger>
);

export default App;
