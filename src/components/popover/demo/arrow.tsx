import { Button, Divider, Popover, Segmented } from 'metis-ui';
import React, { useMemo, useState } from 'react';

const text = <span>Title</span>;
const content = (
  <div>
    <p>Content</p>
    <p>Content</p>
  </div>
);

const buttonWidth = 70;
const gap = 8;

const btnProps = {
  style: {
    width: buttonWidth,
  },
};

const App: React.FC = () => {
  const [showArrow, setShowArrow] = useState(true);
  const [arrowAtCenter, setArrowAtCenter] = useState(false);

  const mergedArrow = useMemo(() => {
    if (arrowAtCenter) return { pointAtCenter: true };
    return showArrow;
  }, [showArrow, arrowAtCenter]);

  return (
    <div className="demo">
      <Segmented
        options={['Show', 'Hide', 'Center']}
        onChange={(val) => {
          setShowArrow(val !== 'Hide');
          setArrowAtCenter(val === 'Center');
        }}
      />
      <Divider orientation="center">Content</Divider>
      <div style={{ marginLeft: buttonWidth, display: 'flex', flexWrap: 'nowrap', columnGap: gap }}>
        <Popover placement="topLeft" title={text} content={content} arrow={mergedArrow}>
          <Button {...btnProps}>TL</Button>
        </Popover>
        <Popover placement="top" title={text} content={content} arrow={mergedArrow}>
          <Button {...btnProps}>Top</Button>
        </Popover>
        <Popover placement="topRight" title={text} content={content} arrow={mergedArrow}>
          <Button {...btnProps}>TR</Button>
        </Popover>
      </div>
      <div
        style={{
          width: buttonWidth,
          float: 'left',
          display: 'flex',
          flexDirection: 'column',
          rowGap: gap,
        }}
      >
        <Popover placement="leftTop" title={text} content={content} arrow={mergedArrow}>
          <Button {...btnProps}>LT</Button>
        </Popover>
        <Popover placement="left" title={text} content={content} arrow={mergedArrow}>
          <Button {...btnProps}>Left</Button>
        </Popover>
        <Popover placement="leftBottom" title={text} content={content} arrow={mergedArrow}>
          <Button {...btnProps}>LB</Button>
        </Popover>
      </div>
      <div
        style={{
          width: buttonWidth,
          marginLeft: buttonWidth * 4 + 24,
          display: 'flex',
          flexDirection: 'column',
          rowGap: gap,
        }}
      >
        <Popover placement="rightTop" title={text} content={content} arrow={mergedArrow}>
          <Button {...btnProps}>RT</Button>
        </Popover>
        <Popover placement="right" title={text} content={content} arrow={mergedArrow}>
          <Button {...btnProps}>Right</Button>
        </Popover>
        <Popover placement="rightBottom" title={text} content={content} arrow={mergedArrow}>
          <Button {...btnProps}>RB</Button>
        </Popover>
      </div>
      <div
        style={{
          marginLeft: buttonWidth,
          clear: 'both',
          display: 'flex',
          flexWrap: 'nowrap',
          columnGap: gap,
        }}
      >
        <Popover placement="bottomLeft" title={text} content={content} arrow={mergedArrow}>
          <Button {...btnProps}>BL</Button>
        </Popover>
        <Popover placement="bottom" title={text} content={content} arrow={mergedArrow}>
          <Button {...btnProps}>Bottom</Button>
        </Popover>
        <Popover placement="bottomRight" title={text} content={content} arrow={mergedArrow}>
          <Button {...btnProps}>BR</Button>
        </Popover>
      </div>
    </div>
  );
};

export default App;
