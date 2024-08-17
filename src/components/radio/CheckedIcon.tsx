import * as React from 'react';
import type { SVGProps } from 'react';

const CheckedIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 16 16"
    width={16}
    height={16}
    {...props}
  >
    <circle cx="8" cy="8" r="3" />
  </svg>
);
export default CheckedIcon;
