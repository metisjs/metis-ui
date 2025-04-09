import * as React from 'react';
import Link from '../../common/Link';
import * as utils from '../../utils';

const Logo = () => {
  const { pathname, search } = location;

  const isZhCN = utils.isZhCN(pathname);

  return (
    <Link to={utils.getLocalizedPathname('/', isZhCN, search)} className="flex items-center gap-2">
      <img src="/logo.svg" draggable={false} alt="logo" className="h-6" />
      <span className="text-text text-2xl">metisui</span>
    </Link>
  );
};

export default Logo;
