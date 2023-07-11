/**
 * description: 有时您需要使用不同的动画来转换多个元素，但所有元素都基于相同的状态。例如，假设用户单击一个按钮以打开一个在屏幕上滑动的侧边栏，同时您还需要淡入背景叠加层。
 */
import { Button, Space } from 'meta-ui';
import React, { useState } from 'react';

export default () => {
  const [isShowing, setIsShowing] = useState(true);
  return (
    <Space direction="vertical">
      <Button onClick={() => setIsShowing((isShowing) => !isShowing)}>Toggle</Button>
    </Space>
  );
};
