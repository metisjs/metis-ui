import React, { useState } from 'react';
import { ArrowUpTrayOutline, InboxOutline, PlusOutline } from '@metisjs/icons';
import type { GetProp, UploadFile, UploadProps } from 'metis-ui';
import { Button, clsx, Segmented, Upload } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

type UploadListType = GetProp<UploadProps, 'listType'>;

const fileList: UploadFile[] = [
  {
    uid: '0',
    name: 'xxx.png',
    status: 'uploading',
    percent: 33,
  },
  {
    uid: '-1',
    name: 'yyy.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
  {
    uid: '-2',
    name: 'zzz.png',
    status: 'error',
  },
];

const App: React.FC = () => {
  const [listType, setListType] = useState<UploadListType>('text');

  return (
    <SemanticPreview
      semantics={[
        { name: 'root' },
        { name: 'selector' },
        { name: 'drag', desc: 'Upload.Dragger' },
        { name: 'fileList' },
        {
          name: 'file',
          children: [
            { name: 'icon' },
            { name: 'name' },
            { name: 'thumbnail' },
            { name: 'progress' },
            { name: 'actions' },
          ],
          args: [{ name: 'status', type: 'UploadFileStatus' }],
        },
      ]}
      rootArgs={[
        { name: 'disabled', type: 'boolean' },
        { name: 'listType', type: 'UploadListType' },
      ]}
      extra={
        <Segmented
          value={listType}
          options={['text', 'picture', 'picture-card', 'picture-circle']}
          onChange={setListType}
        />
      }
    >
      {(hover) => {
        if (listType !== 'text' && hover?.path === 'file_icon') {
          setListType('text');
        } else if (
          listType === 'text' &&
          ['file_thumbnail', 'file_image'].includes(hover?.path ?? '')
        ) {
          setListType('picture');
        }

        const draggable = hover?.name === 'drag';
        const showActions = hover?.path === 'file_actions';

        const commonProps: UploadProps = {
          listType,
          fileList,
          className: {
            root: 'w-[400px]',
            file: ({ status }) => ({
              root: clsx(showActions && status !== 'uploading' && 'before:opacity-100'),
              actions: clsx(showActions && 'opacity-100'),
            }),
          },
        };

        if (draggable) {
          return (
            <Upload.Dragger {...commonProps}>
              <p className="mb-4">
                <InboxOutline className="h-12 w-12 text-primary" />
              </p>
              <p className="mb-1 text-base">Click or drag file to this area to upload</p>
              <p className="text-text-tertiary">
                Support for a single or bulk upload. Strictly prohibited from uploading company data
                or other banned files.
              </p>
            </Upload.Dragger>
          );
        }

        return (
          <Upload {...commonProps}>
            {listType.startsWith('picture-') ? (
              <button style={{ border: 0, background: 'none' }} type="button">
                <PlusOutline className="h-5 w-5" />
                <div style={{ marginTop: 8 }}>Upload</div>
              </button>
            ) : (
              <Button icon={<ArrowUpTrayOutline />}>Click to Upload</Button>
            )}
          </Upload>
        );
      }}
    </SemanticPreview>
  );
};

export default App;
