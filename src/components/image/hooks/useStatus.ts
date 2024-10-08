import { useEffect, useRef, useState } from 'react';
import { isImageValid } from '../util';

type ImageStatus = 'normal' | 'error' | 'loading';

export default function useStatus({
  src,
  isCustomPlaceholder,
  fallback,
}: {
  src?: string;
  isCustomPlaceholder?: boolean;
  fallback?: string;
}) {
  const [status, setStatus] = useState<ImageStatus>(isCustomPlaceholder ? 'loading' : 'normal');
  const isLoaded = useRef(false);
  const isError = status === 'error';

  useEffect(() => {
    let isCurrentSrc = true;
    isImageValid(src).then((isValid) => {
      // If src changes, the previous setStatus should not be triggered
      if (!isValid && isCurrentSrc) {
        setStatus('error');
      }
    });
    return () => {
      isCurrentSrc = false;
    };
  }, [src]);

  useEffect(() => {
    if (isCustomPlaceholder && !isLoaded.current) {
      setStatus('loading');
    } else if (isError) {
      setStatus('normal');
    }
  }, [src]);

  const onLoad = () => {
    setStatus('normal');
  };

  const getImgRef = (img?: HTMLImageElement | null) => {
    isLoaded.current = false;
    if (status === 'loading' && img?.complete && (img.naturalWidth || img.naturalHeight)) {
      isLoaded.current = true;
      onLoad();
    }
  };

  const srcAndOnload = isError && fallback ? { src: fallback } : { onLoad, src };

  return [getImgRef, srcAndOnload, status] as const;
}
