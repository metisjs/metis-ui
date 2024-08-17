import React from 'react';
import { Button, Popconfirm } from 'metis-ui';

const text = 'Are you sure to delete this task?';
const description = 'Delete the task';

const buttonWidth = 70;

const App: React.FC = () => (
  <div>
    <div style={{ marginLeft: buttonWidth, whiteSpace: 'nowrap' }}>
      <Popconfirm placement="topLeft" title={text} description={description}>
        <Button className="ml-1.5 w-[70px]">TL</Button>
      </Popconfirm>
      <Popconfirm placement="top" title={text} description={description}>
        <Button className="ml-1.5 w-[70px]">Top</Button>
      </Popconfirm>
      <Popconfirm placement="topRight" title={text} description={description}>
        <Button className="ml-1.5 w-[70px]">TR</Button>
      </Popconfirm>
    </div>
    <div style={{ width: buttonWidth, float: 'left' }}>
      <Popconfirm placement="leftTop" title={text} description={description}>
        <Button className="mt-1.5 w-[70px]">LT</Button>
      </Popconfirm>
      <Popconfirm placement="left" title={text} description={description}>
        <Button className="mt-1.5 w-[70px]">Left</Button>
      </Popconfirm>
      <Popconfirm placement="leftBottom" title={text} description={description}>
        <Button className="mt-1.5 w-[70px]">LB</Button>
      </Popconfirm>
    </div>
    <div style={{ width: buttonWidth, marginLeft: buttonWidth * 4 + 24 }}>
      <Popconfirm placement="rightTop" title={text} description={description}>
        <Button className="mt-1.5 w-[70px]">RT</Button>
      </Popconfirm>
      <Popconfirm placement="right" title={text} description={description}>
        <Button className="mt-1.5 w-[70px]">Right</Button>
      </Popconfirm>
      <Popconfirm placement="rightBottom" title={text} description={description}>
        <Button className="mt-1.5 w-[70px]">RB</Button>
      </Popconfirm>
    </div>
    <div style={{ marginLeft: buttonWidth, clear: 'both', whiteSpace: 'nowrap' }}>
      <Popconfirm placement="bottomLeft" title={text} description={description}>
        <Button className="ml-1.5 w-[70px]">BL</Button>
      </Popconfirm>
      <Popconfirm placement="bottom" title={text} description={description}>
        <Button className="ml-1.5 w-[70px]">Bottom</Button>
      </Popconfirm>
      <Popconfirm placement="bottomRight" title={text} description={description}>
        <Button className="ml-1.5 w-[70px]">BR</Button>
      </Popconfirm>
    </div>
  </div>
);

export default App;
