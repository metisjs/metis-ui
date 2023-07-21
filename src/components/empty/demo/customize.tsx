/**
 * description: 自定义图片链接、图片大小、描述、附属内容。
 */
import { Button, Empty } from 'meta-ui';
import React from 'react';

const App: React.FC = () => (
  <Empty
    image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
    className={{ image: 'h-[60px]' }}
    description={
      <span>
        Customize <a href="#API">Description</a>
      </span>
    }
  >
    <Button type="primary">Create Now</Button>
  </Empty>
);

export default App;
