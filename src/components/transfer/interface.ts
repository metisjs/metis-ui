import type { SafeKey } from '@util/type';
import type { PaginationProps } from '../pagination';

export type TransferKey = SafeKey;

export type PaginationType =
  | boolean
  | {
      pageSize?: number;
      simple?: boolean;
      showSizeChanger?: boolean;
      showLessItems?: boolean;
      className?: PaginationProps['className'];
    };
