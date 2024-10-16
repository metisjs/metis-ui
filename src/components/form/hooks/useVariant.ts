import { useContext } from 'react';
import type { Variant } from '../../config-provider/context';
import { ConfigContext, Variants } from '../../config-provider/context';
import { VariantContext } from '../context';

const useVariant = (variant: Variant | undefined): [Variant, boolean] => {
  const { variant: configVariant } = useContext(ConfigContext);
  const ctxVariant = useContext(VariantContext);

  let mergedVariant: Variant;
  if (typeof variant !== 'undefined') {
    mergedVariant = variant;
  } else {
    mergedVariant = ctxVariant ?? configVariant ?? 'outlined';
  }

  const enableVariantCls = Variants.includes(mergedVariant);
  return [mergedVariant, enableVariantCls];
};

export default useVariant;
