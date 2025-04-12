import React from 'react';
import { EnvelopeSolid, PhoneSolid } from '@metisjs/icons';
import { Card, Space } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const App: React.FC = () => (
  <SemanticPreview
    semantics={[
      { name: 'root' },
      { name: 'header' },
      { name: 'title' },
      { name: 'extra' },
      { name: 'cover' },
      { name: 'body' },
      { name: 'actions' },
    ]}
  >
    {(hover) => {
      const showCover = hover?.name === 'cover';

      const props = showCover
        ? {
            cover: (
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            ),
          }
        : {
            title: 'Title',
            extra: <a href="#">More</a>,
          };

      return (
        <Card
          {...props}
          actions={[
            <Space key="email" size={12}>
              <EnvelopeSolid className="size-5" />
              <span className="text-text font-medium">Email</span>
            </Space>,
            <Space key="call" size={12}>
              <PhoneSolid className="size-5" />
              <span className="text-text font-medium">Call</span>
            </Space>,
          ]}
          className="w-[300px]"
        >
          <p>Card content</p>
          <p>Card content</p>
          <p>Card content</p>
        </Card>
      );
    }}
  </SemanticPreview>
);

export default App;
