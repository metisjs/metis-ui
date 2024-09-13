'use client';

import * as React from 'react';
import type { Locale as DatePickerLocale } from '../date-picker/interface';
import type { EmptyLocale } from '../empty';
import type { ModalLocale } from '../modal/interface';
import { changeConfirmLocale } from '../modal/locale';
import type { PopconfirmLocale } from '../popconfirm/Overlay';
import type { TransferLocale } from '../transfer';
import type { LocaleContextProps } from './context';
import LocaleContext from './context';

export { default as useLocale } from './useLocale';

export const METIS_MARK = 'internalMark';

export interface Locale {
  locale: string;
  Pagination?: Record<string, any>;
  DatePicker?: DatePickerLocale;
  TimePicker?: Record<string, any>;
  Calendar?: Record<string, any>;
  // Table?: TableLocale;
  Modal?: ModalLocale;
  // Tour?: TourLocale;
  Popconfirm?: PopconfirmLocale;
  Transfer?: TransferLocale;
  Select?: Record<string, any>;
  // Upload?: UploadLocale;
  Empty?: EmptyLocale;
  global?: Record<string, any>;
  PageHeader?: { back: string };
  Icon?: Record<string, any>;
  Text?: {
    edit?: any;
    copy?: any;
    copied?: any;
    expand?: any;
  };
  Form?: {
    optional?: string;
    // defaultValidateMessages: ValidateMessages;
  };
  Image?: {
    preview: string;
  };
  QRCode?: {
    expired?: string;
    refresh?: string;
    scanned?: string;
  };
  ColorPicker?: {
    transparent: string;
    singleColor: string;
    gradientColor: string;
  };
}

export interface LocaleProviderProps {
  locale: Locale;
  children?: React.ReactNode;
  /** @internal */
  _METIS_MARK__?: string;
}

const LocaleProvider: React.FC<LocaleProviderProps> = (props) => {
  const { locale = {} as Locale, children } = props;

  React.useEffect(() => {
    changeConfirmLocale(locale && locale.Modal);
    return () => {
      changeConfirmLocale();
    };
  }, [locale]);

  const getMemoizedContextValue = React.useMemo<LocaleContextProps>(
    () => ({ ...locale, exist: true }),
    [locale],
  );

  return (
    <LocaleContext.Provider value={getMemoizedContextValue}>{children}</LocaleContext.Provider>
  );
};

if (process.env.NODE_ENV !== 'production') {
  LocaleProvider.displayName = 'LocaleProvider';
}

export default LocaleProvider;
