import React, { type FC } from 'react';
import dayjs from 'dayjs';
import { clsx } from 'metis-ui';

export interface FooterProps {
  className?: string;
}

const Footer: FC<FooterProps> = ({ className }) => {
  return (
    <div className={clsx('mt-12', className)}>
      <div className="border-t border-gray-950/5 px-2 pt-10 pb-24 text-center text-gray-700 dark:border-white/10 dark:text-gray-400">
        Copyright © {dayjs().year()} Metis Labs
      </div>
    </div>
  );
};

export default Footer;
