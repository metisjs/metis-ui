import React from 'react';
import { ArrowUpTrayOutline } from '@metisjs/icons';
import type { UploadProps } from 'metis-ui';
import { Button, message, Upload } from 'metis-ui';

const props: UploadProps = {
  beforeUpload: (file) => {
    const isPNG = file.type === 'image/png';
    if (!isPNG) {
      message.error(`${file.name} is not a png file`);
    }
    return isPNG || Upload.LIST_IGNORE;
  },
  onChange: (info) => {
    console.log(info.fileList);
  },
};

const App: React.FC = () => (
  <Upload {...props}>
    <Button icon={<ArrowUpTrayOutline />}>Upload png only</Button>
  </Upload>
);

export default App;
