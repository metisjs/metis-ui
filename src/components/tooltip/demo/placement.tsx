/**
 * 位置有 12 个方向。
 */
import { Button, Tooltip } from 'meta-ui';
import React from 'react';

const text = <span>prompt text</span>;

const buttonWidth = 70;

const App: React.FC = () => (
  <div>
    <div style={{ marginLeft: buttonWidth, whiteSpace: 'nowrap' }}>
      <Tooltip placement="topLeft" title={text}>
        <Button className="ml-1.5 w-[70px]">TL</Button>
      </Tooltip>
      <Tooltip placement="top" title={text}>
        <Button className="ml-1.5 w-[70px]">Top</Button>
      </Tooltip>
      <Tooltip placement="topRight" title={text}>
        <Button className="ml-1.5 w-[70px]">TR</Button>
      </Tooltip>
    </div>
    <div style={{ width: buttonWidth, float: 'left' }}>
      <Tooltip placement="leftTop" title={text}>
        <Button className="mt-1.5 w-[70px]">LT</Button>
      </Tooltip>
      <Tooltip placement="left" title={text}>
        <Button className="mt-1.5 w-[70px]">Left</Button>
      </Tooltip>
      <Tooltip placement="leftBottom" title={text}>
        <Button className="mt-1.5 w-[70px]">LB</Button>
      </Tooltip>
    </div>
    <div style={{ width: buttonWidth, marginLeft: buttonWidth * 4 + 24 }}>
      <Tooltip placement="rightTop" title={text}>
        <Button className="mt-1.5 w-[70px]">RT</Button>
      </Tooltip>
      <Tooltip placement="right" title={text}>
        <Button className="mt-1.5 w-[70px]">Right</Button>
      </Tooltip>
      <Tooltip placement="rightBottom" title={text}>
        <Button className="mt-1.5 w-[70px]">RB</Button>
      </Tooltip>
    </div>
    <div style={{ marginLeft: buttonWidth, clear: 'both', whiteSpace: 'nowrap' }}>
      <Tooltip placement="bottomLeft" title={text}>
        <Button className="ml-1.5 w-[70px]">BL</Button>
      </Tooltip>
      <Tooltip placement="bottom" title={text}>
        <Button className="ml-1.5 w-[70px]">Bottom</Button>
      </Tooltip>
      <Tooltip placement="bottomRight" title={text}>
        <Button className="ml-1.5 w-[70px]">BR</Button>
      </Tooltip>
    </div>
  </div>
);

export default App;
