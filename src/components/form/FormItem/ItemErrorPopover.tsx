import React, { useState } from 'react';
import Spin from 'metis-ui/es/spin';
import type { PopoverProps } from '../../popover';
import Popover from '../../popover';

const ItemErrorPopover: React.FC<{
  inputProps: any;
  input: React.ReactNode;
  errorList: React.ReactNode;
  extra: React.ReactNode;
  popoverProps?: PopoverProps;
}> = ({ inputProps, input, extra, errorList, popoverProps }) => {
  const [open, setOpen] = useState<boolean | undefined>(false);

  const loading = inputProps.validateStatus === 'validating';

  return (
    <Popover
      key="popover"
      trigger={popoverProps?.trigger || ['click']}
      placement={popoverProps?.placement || 'topLeft'}
      open={errorList === null ? false : open}
      onOpenChange={setOpen}
      getPopupContainer={popoverProps?.getPopupContainer}
      getTooltipContainer={popoverProps?.getTooltipContainer}
      content={
        <Spin spinning={loading} size="small">
          {errorList}
        </Spin>
      }
      {...popoverProps}
    >
      <>
        {input}
        {extra}
      </>
    </Popover>
  );
};
export default ItemErrorPopover;
