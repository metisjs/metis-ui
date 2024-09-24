import React from 'react';
import KEYCODE from 'rc-util/lib/KeyCode';
import { clsx } from '../_util/classNameUtils';
import type { InputProps } from '../input';
import Input from '../input';
import type { SelectProps } from '../select';
import Select from '../select';
import type { PaginationLocale, PaginationProps } from './interface';

interface OptionsProps {
  className?: {
    root?: string;
    jumper?: InputProps['className'];
    sizeChanger?: SelectProps['className'];
  };
  disabled?: boolean;
  size?: PaginationProps['size'];
  locale: PaginationLocale;
  rootPrefixCls: string;
  pageSize: number;
  pageSizeOptions?: (string | number)[];
  changeSize?: (size: number) => void;
  quickGo?: (value?: number) => void;
  buildOptionText?: (value: string | number) => string;
}

const defaultPageSizeOptions = ['10', '20', '50', '100'];

const Options: React.FC<OptionsProps> = (props) => {
  const {
    className,
    pageSizeOptions = defaultPageSizeOptions,
    locale,
    changeSize,
    pageSize,
    quickGo,
    rootPrefixCls,
    disabled,
    size,
    buildOptionText,
  } = props;

  const [goInputText, setGoInputText] = React.useState('');

  const getValidValue = () => {
    return !goInputText || Number.isNaN(goInputText) ? undefined : Number(goInputText);
  };

  const mergeBuildOptionText =
    typeof buildOptionText === 'function'
      ? buildOptionText
      : (value: string) => `${value} ${locale.items_per_page}`;

  const changeSizeHandle = (value: string) => {
    changeSize?.(Number(value));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGoInputText(e.target.value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    if (goInputText === '') {
      return;
    }
    setGoInputText('');
    if (
      e.relatedTarget &&
      (e.relatedTarget.className.indexOf(`${rootPrefixCls}-item-link`) >= 0 ||
        e.relatedTarget.className.indexOf(`${rootPrefixCls}-item`) >= 0)
    ) {
      return;
    }
    quickGo?.(getValidValue());
  };

  const go = (e: any) => {
    if (goInputText === '') {
      return;
    }
    if (e.keyCode === KEYCODE.ENTER || e.type === 'click') {
      setGoInputText('');
      quickGo?.(getValidValue());
    }
  };

  const getPageSizeOptions = () => {
    if (pageSizeOptions.some((option) => option.toString() === pageSize.toString())) {
      return pageSizeOptions;
    }
    return pageSizeOptions.concat([pageSize.toString()]).sort((a, b) => {
      const numberA = Number.isNaN(Number(a)) ? 0 : Number(a);
      const numberB = Number.isNaN(Number(b)) ? 0 : Number(b);
      return numberA - numberB;
    });
  };
  // ============== cls ==============
  const prefixCls = `${rootPrefixCls}-options`;

  // ============== render ==============

  if (!changeSize && !quickGo) {
    return null;
  }

  let changeSelect: React.ReactNode = null;
  let goInput: React.ReactNode = null;

  if (changeSize) {
    const options = getPageSizeOptions().map((opt) => ({
      label: mergeBuildOptionText(opt),
      value: opt.toString(),
    }));

    const mergedChangerCls = !className?.sizeChanger
      ? `${prefixCls}-size-changer`
      : typeof className.sizeChanger === 'string'
        ? `${prefixCls}-size-changer ${className?.sizeChanger}`
        : {
            ...className.sizeChanger,
            root: `${prefixCls}-size-changer ${className?.sizeChanger.root}`,
          };

    changeSelect = (
      <Select
        options={options}
        disabled={disabled}
        showSearch={false}
        className={mergedChangerCls}
        popupMatchSelectWidth={false}
        value={(pageSize || pageSizeOptions[0]).toString()}
        onChange={changeSizeHandle}
        getPopupContainer={(triggerNode) => triggerNode.parentNode}
        aria-label={locale.page_size}
        defaultOpen={false}
        size={size === 'default' ? 'middle' : size}
      />
    );
  }

  if (quickGo) {
    const jumperCls = clsx('w-12');
    const mergedJumperCls = !className?.jumper
      ? clsx(`${prefixCls}-quick-jumper`, jumperCls)
      : typeof className.jumper === 'string'
        ? clsx(`${prefixCls}-quick-jumper`, jumperCls, className?.jumper)
        : {
            ...className.jumper,
            root: clsx(`${prefixCls}-quick-jumper`, jumperCls, className?.jumper.root),
          };

    goInput = (
      <>
        {locale.jump_to}
        <Input
          disabled={disabled}
          value={goInputText}
          onChange={handleChange}
          onKeyUp={go}
          onBlur={handleBlur}
          aria-label={locale.page}
          size={size === 'default' ? 'middle' : size}
          className={mergedJumperCls}
        />
        {locale.page}
      </>
    );
  }

  const rootCls = clsx(prefixCls, 'ms-1 inline-flex items-center gap-2 sm:hidden', className?.root);

  return (
    <li className={rootCls}>
      {changeSelect}
      {goInput}
    </li>
  );
};

if (process.env.NODE_ENV !== 'production') {
  Options.displayName = 'Options';
}

export default Options;
