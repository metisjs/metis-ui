import * as React from 'react';
import Select from '../select';
import type { SelectPropsWithOptions } from '../select/interface';

const MiniSelect: React.FC<SelectPropsWithOptions> = (props) => (
  <Select {...props} showSearch size="small" />
);
const MiddleSelect: React.FC<SelectPropsWithOptions> = (props) => (
  <Select {...props} showSearch size="middle" />
);

export { MiddleSelect, MiniSelect };
