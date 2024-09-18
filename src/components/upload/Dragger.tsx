import React from 'react';
import type { UploadProps } from './interface';
import Upload from './Upload';

export type DraggerProps = UploadProps & { height?: number };

const Dragger: React.FC<DraggerProps> = ({
  style,
  height,
  hasControlInside = false,
  ...restProps
}) => (
  <Upload
    hasControlInside={hasControlInside}
    {...restProps}
    type="drag"
    style={{ ...style, height }}
  />
);

if (process.env.NODE_ENV !== 'production') {
  Dragger.displayName = 'UploadDragger';
}

export default Dragger;
