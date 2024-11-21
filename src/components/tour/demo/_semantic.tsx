import React, { useRef } from 'react';
import { EllipsisHorizontalOutline } from '@metisjs/icons';
import { useLocale } from 'dumi';
import type { TourProps } from 'metis-ui';
import { Button, Space, Tour } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const App: React.FC = () => {
  const { id } = useLocale();
  const localeSuffix = id === 'zh-CN' ? '-cn' : '';

  const containerRef = useRef(null);
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);

  const steps: TourProps['steps'] = [
    {
      title: 'Upload File',
      description: 'Put your files here.',
      target: () => ref1.current,
    },
    {
      cover: (
        <img
          alt="tour.png"
          src="https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png"
          className="h-[60px] w-[240px]"
        />
      ),
      title: 'Save',
      description: 'Save your changes.',
      target: () => ref2.current,
    },
    {
      title: 'Other Actions',
      description: 'Click to see other actions.',
      target: () => ref3.current,
    },
  ];

  return (
    <SemanticPreview
      semantics={[
        { name: 'popup' },
        { name: 'mask', desc: 'Can only set the fill color. eg: `fill-red-500`' },
        { name: 'cover' },
        { name: 'close' },
        { name: 'content' },
        { name: 'title' },
        { name: 'description' },
        { name: 'indicators' },
        { name: 'footer' },
        { name: 'prev', link: `/components/button-${localeSuffix}#semantic-dom` },
        { name: 'next', link: `/components/button-${localeSuffix}#semantic-dom` },
      ]}
      transform
      targetIndex={1}
      ref={containerRef}
      height={600}
    >
      {(hover) => [
        <Space key="buttons">
          <Button ref={ref1}>Upload</Button>
          <Button ref={ref2} type="primary">
            Save
          </Button>
          <Button ref={ref3} icon={<EllipsisHorizontalOutline />} />
        </Space>,
        <Tour
          current={1}
          key="tour"
          open={!!hover}
          steps={steps}
          mask={false}
          getPopupContainer={() => containerRef.current!}
        />,
      ]}
    </SemanticPreview>
  );
};

export default App;
