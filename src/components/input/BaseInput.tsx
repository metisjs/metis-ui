import type { ReactElement, ReactNode } from 'react';
import React, { cloneElement, useRef } from 'react';
import { XCircleSolid } from '@metisjs/icons';
import { clsx } from '../_util/classNameUtils';
import useSemanticCls from '../_util/hooks/useSemanticCls';
import type { BaseInputProps } from './interface';
import { hasAddon, hasPrefixSuffix } from './utils';

export interface HolderRef {
  nativeElement: HTMLElement | null;
}

const BaseInput = React.forwardRef<HolderRef, BaseInputProps>((props, ref) => {
  const {
    children,
    prefixCls,
    prefix,
    suffix,
    addonBefore,
    addonAfter,
    className,
    style,
    disabled,
    readOnly,
    focused,
    triggerFocus,
    allowClear,
    value,
    handleReset,
    hidden,
    dataAttrs,
    components,
    onClear,
  } = props;

  const semanticCls = useSemanticCls(className);

  const AffixWrapperComponent = components?.affixWrapper || 'span';
  const GroupWrapperComponent = components?.groupWrapper || 'span';
  const WrapperComponent = components?.wrapper || 'span';
  const GroupAddonComponent = components?.groupAddon || 'span';

  const containerRef = useRef<HTMLDivElement>(null);

  const onInputClick: React.MouseEventHandler = (e) => {
    if (containerRef.current?.contains(e.target as Element)) {
      triggerFocus?.();
    }
  };

  const hasAffix = hasPrefixSuffix(props);

  let element: ReactElement = cloneElement(children, {
    value,
  });

  // ======================== Ref ======================== //
  const groupRef = useRef<HTMLDivElement>(null);

  React.useImperativeHandle(ref, () => ({
    nativeElement: groupRef.current || containerRef.current,
  }));

  // ================== Prefix & Suffix ================== //
  if (hasAffix) {
    // ================== Clear Icon ================== //
    let clearIcon: ReactNode = null;
    if (allowClear) {
      const needClear = !disabled && !readOnly && value;
      const clearIconCls = `${prefixCls}-clear-icon`;
      const iconNode =
        typeof allowClear === 'object' && allowClear?.clearIcon ? (
          allowClear.clearIcon
        ) : (
          <XCircleSolid />
        );

      clearIcon = (
        <span
          onClick={(event) => {
            handleReset?.(event);
            onClear?.();
          }}
          onMouseDown={(e) => e.preventDefault()}
          className={clsx(
            clearIconCls,
            {
              [`${clearIconCls}-hidden`]: !needClear,
              [`${clearIconCls}-has-suffix`]: !!suffix,
            },
            !needClear && 'invisible',
            semanticCls.clear,
          )}
          role="button"
          tabIndex={-1}
        >
          {iconNode}
        </span>
      );
    }

    const affixWrapperPrefixCls = `${prefixCls}-affix-wrapper`;
    const affixWrapperCls = clsx(
      affixWrapperPrefixCls,
      {
        [`${prefixCls}-disabled`]: disabled,
        [`${affixWrapperPrefixCls}-disabled`]: disabled, // Not used, but keep it
        [`${affixWrapperPrefixCls}-focused`]: focused, // Not used, but keep it
        [`${affixWrapperPrefixCls}-readonly`]: readOnly,
        [`${affixWrapperPrefixCls}-input-with-clear-btn`]: suffix && allowClear && value,
      },
      semanticCls.affixWrapper,
    );

    const suffixNode = (suffix || allowClear) && (
      <span className={clsx(`${prefixCls}-suffix`, semanticCls.suffix)}>
        {clearIcon}
        {suffix}
      </span>
    );

    element = (
      <AffixWrapperComponent
        className={affixWrapperCls}
        onClick={onInputClick}
        {...dataAttrs?.affixWrapper}
        ref={containerRef}
      >
        {prefix && (
          <span className={clsx(`${prefixCls}-prefix`, semanticCls.prefix)}>{prefix}</span>
        )}
        {element}
        {suffixNode}
      </AffixWrapperComponent>
    );
  }

  // ================== Addon ================== //
  if (hasAddon(props)) {
    const wrapperCls = `${prefixCls}-group`;
    const addonCls = `${wrapperCls}-addon`;
    const groupWrapperCls = `${wrapperCls}-wrapper`;

    const mergedWrapperClassName = clsx(`${prefixCls}-wrapper`, wrapperCls, semanticCls.wrapper);

    const mergedGroupClassName = clsx(
      groupWrapperCls,
      {
        [`${groupWrapperCls}-disabled`]: disabled,
      },
      semanticCls.groupWrapper,
    );

    // Need another wrapper for changing display:table to display:inline-block
    // and put style prop in wrapper
    element = (
      <GroupWrapperComponent className={mergedGroupClassName} ref={groupRef}>
        <WrapperComponent className={mergedWrapperClassName}>
          {addonBefore && (
            <GroupAddonComponent className={clsx(addonCls, semanticCls.addonBefore)}>
              {addonBefore}
            </GroupAddonComponent>
          )}
          {element}
          {addonAfter && (
            <GroupAddonComponent className={clsx(addonCls, semanticCls.addonAfter)}>
              {addonAfter}
            </GroupAddonComponent>
          )}
        </WrapperComponent>
      </GroupWrapperComponent>
    );
  }

  // `className` and `style` are always on the root element
  return React.cloneElement(element, {
    className: clsx(element.props?.className, semanticCls.root) || undefined,
    style: {
      ...element.props?.style,
      ...style,
    },
    hidden,
  });
});

export default BaseInput;
