/**
 * description: 通过 `destroyTooltipOnHide` 控制提示关闭时是否销毁 dom 节点。
 */
import { Tooltip } from 'metis-ui';
import React from 'react';

const App: React.FC = () => (
  <Tooltip destroyTooltipOnHide title="prompt text">
    <span>Tooltip will destroy when hidden.</span>
  </Tooltip>
);

export default App;
