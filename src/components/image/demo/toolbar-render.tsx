import React from 'react';
import { ArrowDownTrayOutline, ArrowPathRoundedSquareOutline } from '@metisjs/icons';
import { Image, Space } from 'metis-ui';

const src = 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png';

// you can download flipped and rotated image
const onDownload = (imgUrl: string) => {
  fetch(imgUrl)
    .then((response) => response.blob())
    .then((blob) => {
      const url = URL.createObjectURL(new Blob([blob]));
      const link = document.createElement<'a'>('a');
      link.href = url;
      link.download = 'image.png';
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(url);
      link.remove();
    });
};

const App: React.FC = () => (
  <Image
    width={200}
    src={src}
    preview={{
      toolbarRender: (
        _,
        {
          icons: { flipYIcon, flipXIcon, rotateLeftIcon, rotateRightIcon, zoomOutIcon, zoomInIcon },
          image: { url },
          actions: { onReset },
        },
      ) => (
        <Space
          size={12}
          className="fixed bottom-8 start-1/2 -translate-x-1/2 rounded-full bg-black/10 px-6"
        >
          <ArrowDownTrayOutline
            onClick={() => url && onDownload(url)}
            className="h-6 w-6 cursor-pointer text-white/65 hover:text-white"
          />
          {flipYIcon}
          {flipXIcon}
          {rotateLeftIcon}
          {rotateRightIcon}
          {zoomOutIcon}
          {zoomInIcon}
          <ArrowPathRoundedSquareOutline
            onClick={onReset}
            className="h-6 w-6 cursor-pointer text-white/65 hover:text-white"
          />
        </Space>
      ),
    }}
  />
);

export default App;
