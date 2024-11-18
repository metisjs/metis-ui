import * as React from 'react';
import { MagnifyingGlassOutline } from '@metisjs/icons';
import type { InputProps } from '../input';
import Input from '../input';

export interface TransferSearchProps {
  prefixCls?: string;
  className?: InputProps['className'];
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClear?: () => void;
  value?: string;
  disabled?: boolean;
}

const Search: React.FC<TransferSearchProps> = (props) => {
  const { placeholder = '', value, prefixCls, className, disabled, onChange, handleClear } = props;

  const handleChange = React.useCallback(
    (v: string, e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      if (v === '') {
        handleClear?.();
      }
    },
    [onChange],
  );

  return (
    <Input
      prefixCls={prefixCls}
      placeholder={placeholder}
      className={className}
      value={value}
      onChange={handleChange}
      disabled={disabled}
      allowClear
      prefix={<MagnifyingGlassOutline />}
      size="small"
    />
  );
};

if (process.env.NODE_ENV !== 'production') {
  Search.displayName = 'Search';
}

export default Search;
