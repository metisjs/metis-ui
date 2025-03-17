import React from 'react';
import { ArrowsPointingInOutline, ArrowsPointingOutOutline } from '@metisjs/icons';
import isBrowser from '@util/isBrowser';
import { useLocale } from '../../locale';
import Tooltip from '../../tooltip';

const FullScreenButton = ({ onClick }: { onClick: (event: any) => void }) => {
  const [locale] = useLocale('Table');
  const [fullscreen, setFullscreen] = React.useState<boolean>(false);
  React.useEffect(() => {
    if (!isBrowser()) {
      return;
    }
    document.onfullscreenchange = () => {
      setFullscreen(!!document.fullscreenElement);
    };
  }, []);

  return fullscreen ? (
    <Tooltip title={locale.toolbar?.exitFullscreen}>
      <div onClick={onClick}>
        <ArrowsPointingInOutline />
      </div>
    </Tooltip>
  ) : (
    <Tooltip title={locale.toolbar?.fullscreen}>
      <div onClick={onClick}>
        <ArrowsPointingOutOutline />
      </div>
    </Tooltip>
  );
};

export default React.memo(FullScreenButton);
