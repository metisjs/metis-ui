import React from 'react';
import { ArrowUpTrayOutline } from '@metisjs/icons';
import type { UploadProps } from 'metis-ui';
import { Button, Upload } from 'metis-ui';

const props: UploadProps = {
  action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
  onChange({ file, fileList }) {
    if (file.status !== 'uploading') {
      console.log(file, fileList);
    }
  },
  defaultFileList: [
    {
      uid: '1',
      name: 'xxx.png',
      status: 'uploading',
      url: 'http://www.baidu.com/xxx.png',
      percent: 33,
    },
    {
      uid: '2',
      name: 'yyy.png',
      status: 'done',
      url: 'http://www.baidu.com/yyy.png',
    },
    {
      uid: '3',
      name: 'zzz.png',
      status: 'error',
      response: 'Server Error 500', // custom error message to show
      url: 'http://www.baidu.com/zzz.png',
    },
  ],
};

const App: React.FC = () => (
  <Upload {...props}>
    <Button icon={<ArrowUpTrayOutline />}>Upload</Button>
  </Upload>
);

export default App;
