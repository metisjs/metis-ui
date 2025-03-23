import { useContext, useMemo } from 'react';
import toArray from '@util/toArray';
import type { ConfigConsumerProps } from '../../config-provider';
import { ConfigContext } from '../../config-provider';
import type { SemanticRecord } from '../classNameUtils';
import { getSemanticCls, type SemanticClassName } from '../classNameUtils';

type OmitType =
  | 'getTargetContainer'
  | 'getPopupContainer'
  | 'getPrefixCls'
  | 'renderEmpty'
  | 'variant'
  | 'popupMatchSelectWidth'
  | 'popupOverflow'
  | 'virtual'
  | 'locale'
  | 'route'
  | 'request';

export const clsxDependency = (arg: any) => {
  const args = toArray(arg);
  return args.some((a) => typeof a === 'function') ? arg : JSON.stringify(arg);
};

function useSemanticCls<T extends SemanticClassName<any, any>>(
  className?: T | (T | undefined)[],
): SemanticRecord<T>;
function useSemanticCls<T extends SemanticClassName<any, any>>(
  className?: T | (T | undefined)[],
  componentName?: keyof Omit<ConfigConsumerProps, OmitType>,
): SemanticRecord<T>;
function useSemanticCls<T extends SemanticClassName<any, any>>(
  className?: T | (T | undefined)[],
  args?: T extends (...args: infer R) => any ? R[0] : never,
): SemanticRecord<T>;
function useSemanticCls<T extends SemanticClassName<any, any>>(
  className?: T | (T | undefined)[],
  componentName?: keyof Omit<ConfigConsumerProps, OmitType>,
  args?: T extends (...args: infer R) => any ? R[0] : never,
): SemanticRecord<T>;
function useSemanticCls(className: any, arg1?: any, arg2?: any): SemanticRecord<any> {
  const config = useContext(ConfigContext);

  const componentName = typeof arg1 === 'string' ? arg1 : undefined;
  const args = typeof arg1 === 'string' ? arg2 : arg1;

  return useMemo(() => {
    const classNames = toArray(className);
    if (componentName) {
      const contextCls =
        config[componentName as keyof Omit<ConfigConsumerProps, OmitType>]?.className;
      return getSemanticCls([contextCls, ...classNames], args);
    }
    return getSemanticCls(classNames, args);
  }, [clsxDependency(className), JSON.stringify(args)]);
}

export default useSemanticCls;
