import React, { useEffect, useState } from 'react';
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
  const [errorStringList, setErrorList] = useState<string[]>([]);

  useEffect(() => {
    if (inputProps.validateStatus !== 'validating') {
      setErrorList(inputProps.errors);
    }
  }, [inputProps.errors, inputProps.validateStatus]);

  const loading = inputProps.validateStatus === 'validating';

  return (
    <Popover
      key="popover"
      trigger={popoverProps?.trigger || ['click']}
      placement={popoverProps?.placement || 'topLeft'}
      open={errorStringList.length < 1 ? false : open}
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
