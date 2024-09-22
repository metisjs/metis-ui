import React from 'react';
import { Image } from 'metis-ui';

const App: React.FC = () => (
  <Image.PreviewGroup
    preview={{ countRender: (current, total) => `当前 ${current} / 总计 ${total}` }}
  >
    <Image width={150} src="/logo.svg" />
    <Image
      width={150}
      src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
    />
    <Image
      width={150}
      src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
    />
  </Image.PreviewGroup>
);

export default App;
