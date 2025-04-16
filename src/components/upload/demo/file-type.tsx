import React, { useState } from 'react';
import {
  DocumentChartBarOutline,
  DocumentMagnifyingGlassOutline,
  DocumentTextOutline,
  LoadingOutline,
  PaperClipOutline,
  PhotoOutline,
  PlusOutline,
} from '@metisjs/icons';
import { Image, Upload } from 'metis-ui';
import type { GetProp, UploadFile, UploadProps } from 'metis-ui';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const App: React.FC = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([
    {
      uid: '-2',
      name: 'pdf.pdf',
      status: 'done',
      url: 'http://cdn07.foxitsoftware.cn/pub/foxit/cpdf/FoxitCompanyProfile.pdf',
    },
    {
      uid: '-3',
      name: 'doc.doc',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.doc',
    },
    {
      uid: '-4',
      name: 'image.png',
      status: 'error',
    },
    {
      uid: '-5',
      name: 'pdf.pdf',
      status: 'error',
    },
    {
      uid: '-6',
      name: 'doc.doc',
      status: 'error',
    },
  ]);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewOpen(true);
    setPreviewImage(file.url || (file.preview as string));
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const handleIconRender: UploadProps['iconRender'] = (file, listType) => {
    const fileSufIconList = [
      { type: <DocumentMagnifyingGlassOutline />, suf: ['.pdf'] },
      { type: <DocumentChartBarOutline />, suf: ['.xlsx', '.xls', '.csv'] },
      { type: <DocumentTextOutline />, suf: ['.doc', '.docx'] },
      {
        type: <PhotoOutline />,
        suf: ['.webp', '.svg', '.png', '.gif', '.jpg', '.jpeg', '.jfif', '.bmp', '.dpg'],
      },
    ];
    // console.log(1, file, listType);
    let icon =
      file.status === 'uploading' ? (
        <LoadingOutline className="animate-spin" />
      ) : (
        <PaperClipOutline />
      );
    if (listType === 'picture' || listType === 'picture-card' || listType === 'picture-circle') {
      if (listType === 'picture-card' && file.status === 'uploading') {
        icon = <LoadingOutline className="animate-spin" />; // or icon = 'uploading...';
      } else {
        fileSufIconList.forEach((item) => {
          if (item.suf.includes(file.name.slice(file.name.lastIndexOf('.')))) {
            icon = item.type;
          }
        });
      }
    }
    return icon;
  };

  const uploadButton = (
    <button className="flex flex-col items-center border-0 bg-transparent" type="button">
      <PlusOutline className="size-5" />
      <div className="mt-2">Upload</div>
    </button>
  );

  return (
    <>
      <Upload
        action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        iconRender={handleIconRender}
      >
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>
      {previewImage && (
        <Image
          className="hidden"
          preview={{
            open: previewOpen,
            onOpenChange: (open) => setPreviewOpen(open),
            afterOpenChange: (open) => !open && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}
    </>
  );
};

export default App;
