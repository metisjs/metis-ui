import * as React from 'react';
import { Alert } from 'metis-ui';

interface ContainerProps {
  type: 'info' | 'warning' | 'success' | 'error';
  title?: string;
}

const Container: React.FC<React.PropsWithChildren<ContainerProps>> = ({
  type,
  title,
  children,
}) => {
  return (
    <Alert
      showIcon
      type={type}
      message={title || type.toUpperCase()}
      description={children}
      className={{ root: 'my-6', description: 'markdown' }}
    />
  );
};

export default Container;
