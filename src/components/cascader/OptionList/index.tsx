import * as React from 'react';
import { useBaseProps } from '../../select';
import { RefOptionListProps } from '../../select/BaseSelect';
import RawOptionList from './RawOptionList';

const RefOptionList = React.forwardRef<RefOptionListProps>((props, ref) => {
  const baseProps = useBaseProps();

  // >>>>> Render
  return <RawOptionList {...props} {...baseProps} ref={ref} />;
});

export default RefOptionList;
