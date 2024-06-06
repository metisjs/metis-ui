/**
 * description: 气泡框不可见时自动调整位置。
 */
import type { TooltipProps } from 'metis-ui';
import { Button, Tooltip } from 'metis-ui';
import React from 'react';

const Block = React.forwardRef<HTMLDivElement, Partial<TooltipProps>>((props, ref) => (
  <div
    style={{
      overflow: 'auto',
      position: 'relative',
      padding: '24px',
      border: '1px solid #e9e9e9',
    }}
    ref={ref}
  >
    <div
      style={{
        width: '200%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        rowGap: 16,
      }}
    >
      <Tooltip {...props} placement="left" title="Prompt Text">
        <Button>Adjust automatically / 自动调整</Button>
      </Tooltip>
      <Tooltip {...props} placement="left" title="Prompt Text" autoAdjustOverflow={false}>
        <Button>Ignore / 不处理</Button>
      </Tooltip>
    </div>
  </div>
));

const App: React.FC = () => {
  const containerRef1 = React.useRef<HTMLDivElement>(null);
  const containerRef2 = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    containerRef1.current!.scrollLeft = containerRef1.current!.clientWidth * 0.5;
    containerRef2.current!.scrollLeft = containerRef2.current!.clientWidth * 0.5;
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', rowGap: 16 }}>
      <h5>With `getPopupContainer`</h5>
      <Block ref={containerRef1} getPopupContainer={(trigger) => trigger.parentElement!} />

      <h5>Without `getPopupContainer`</h5>
      <Block ref={containerRef2} />
    </div>
  );
};

export default App;
