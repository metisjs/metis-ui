import React from 'react';
import { Button, Popover } from 'metis-ui';

const text = <span>Title</span>;

const content = (
  <div>
    <p>Content</p>
    <p>Content</p>
  </div>
);

const buttonWidth = 70;

const App: React.FC = () => (
  <div>
    <div style={{ marginLeft: buttonWidth, whiteSpace: 'nowrap' }}>
      <Popover placement="topLeft" title={text} content={content}>
        <Button className="ml-1.5 w-[70px]">TL</Button>
      </Popover>
      <Popover placement="top" title={text} content={content}>
        <Button className="ml-1.5 w-[70px]">Top</Button>
      </Popover>
      <Popover placement="topRight" title={text} content={content}>
        <Button className="ml-1.5 w-[70px]">TR</Button>
      </Popover>
    </div>
    <div style={{ width: buttonWidth, float: 'left' }}>
      <Popover placement="leftTop" title={text} content={content}>
        <Button className="mt-1.5 w-[70px]">LT</Button>
      </Popover>
      <Popover placement="left" title={text} content={content}>
        <Button className="mt-1.5 w-[70px]">Left</Button>
      </Popover>
      <Popover placement="leftBottom" title={text} content={content}>
        <Button className="mt-1.5 w-[70px]">LB</Button>
      </Popover>
    </div>
    <div style={{ width: buttonWidth, marginLeft: buttonWidth * 4 + 24 }}>
      <Popover placement="rightTop" title={text} content={content}>
        <Button className="mt-1.5 w-[70px]">RT</Button>
      </Popover>
      <Popover placement="right" title={text} content={content}>
        <Button className="mt-1.5 w-[70px]">Right</Button>
      </Popover>
      <Popover placement="rightBottom" title={text} content={content}>
        <Button className="mt-1.5 w-[70px]">RB</Button>
      </Popover>
    </div>
    <div style={{ marginLeft: buttonWidth, clear: 'both', whiteSpace: 'nowrap' }}>
      <Popover placement="bottomLeft" title={text} content={content}>
        <Button className="ml-1.5 w-[70px]">BL</Button>
      </Popover>
      <Popover placement="bottom" title={text} content={content}>
        <Button className="ml-1.5 w-[70px]">Bottom</Button>
      </Popover>
      <Popover placement="bottomRight" title={text} content={content}>
        <Button className="ml-1.5 w-[70px]">BR</Button>
      </Popover>
    </div>
  </div>
);

export default App;
