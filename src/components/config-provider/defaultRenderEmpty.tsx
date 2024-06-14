import React from 'react';
import Empty from '../empty';

interface EmptyProps {
  componentName?: string;
}

const DefaultRenderEmpty: React.FC<EmptyProps> = (props) => {
  const { componentName } = props;
  switch (componentName) {
    case 'Select':
    case 'TreeSelect':
    case 'Cascader':
    case 'Transfer':
    case 'Mentions':
      return <Empty className={{ root: 'me-2 ms-2', image: 'h-[35px]' }} />;
    /* istanbul ignore next */
    default:
      // Should never hit if we take all the component into consider.
      return <Empty />;
  }
};

export type RenderEmptyHandler = (componentName?: string) => React.ReactNode;

export default DefaultRenderEmpty;
