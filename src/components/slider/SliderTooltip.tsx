import * as React from 'react';
import { useRef } from 'react';
import raf from 'rc-util/es/raf';
import { composeRef } from 'rc-util/es/ref';
import type { TooltipProps } from '../tooltip';
import Tooltip from '../tooltip';
import type { SliderRef } from './interface';

const SliderTooltip = React.forwardRef<SliderRef, TooltipProps>((props, ref) => {
  const { open } = props;
  const innerRef = useRef<any>(null);

  const rafRef = useRef<number | null>(null);

  function cancelKeepAlign() {
    raf.cancel(rafRef.current!);
    rafRef.current = null;
  }

  function keepAlign() {
    rafRef.current = raf(() => {
      innerRef.current?.forceAlign();
      rafRef.current = null;
    });
  }

  React.useEffect(() => {
    if (open) {
      keepAlign();
    } else {
      cancelKeepAlign();
    }

    return cancelKeepAlign;
  }, [open, props.title]);

  return <Tooltip ref={composeRef(innerRef, ref)} {...props} />;
});

export default SliderTooltip;
