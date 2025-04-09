import React, { type FC } from 'react';
import dayjs from 'dayjs';

const Footer: FC = () => {
  return (
    <div className="border-t-border mt-12 border-t">Copyright © {dayjs().year()} Metis Labs</div>
  );
};

export default Footer;
