import * as React from 'react';
import { forwardRef, useContext, useImperativeHandle } from 'react';
import { CalendarOutline, ClockOutline } from '@metisjs/icons';
import classNames from 'classnames';
import ContextIsolator from '../../_util/ContextIsolator';
import { useZIndex } from '../../_util/hooks/useZIndex';
import { getStatusClassNames } from '../../_util/statusUtils';
import type { AnyObject } from '../../_util/type';
import { ConfigContext } from '../../config-provider';
import DisabledContext from '../../config-provider/DisabledContext';
import useSize from '../../config-provider/hooks/useSize';
import { FormItemInputContext } from '../../form/context';
import useVariant from '../../form/hooks/useVariant';
import { useLocale } from '../../locale';
import { useCompactItemContext } from '../../space/Compact';
import type { GenerateConfig, PickerRef, RangePickerProps } from '../interface';
import zhCN from '../locale/zh_CN';
import InternalRangePicker from '../PickerInput/RangePicker';
import { getRangePlaceholder, transPlacement2PopupAlign } from '../utils/miscUtil';

const generateRangePicker = <DateType extends AnyObject = AnyObject>(
  generateConfig: GenerateConfig<DateType>,
) => {
  const RangePicker = forwardRef<PickerRef, RangePickerProps<DateType>>((props, ref) => {
    const {
      prefixCls: customizePrefixCls,
      getPopupContainer: customizeGetPopupContainer,
      className,
      size: customizeSize,
      placement,
      placeholder,
      disabled: customDisabled,
      status: customStatus,
      variant: customVariant,
      popupZIndex,
      picker,
      ...restProps
    } = props;

    const innerRef = React.useRef<PickerRef>(null);
    const { getPrefixCls, getPopupContainer } = useContext(ConfigContext);
    const prefixCls = getPrefixCls('picker', customizePrefixCls);
    const { compactSize, compactItemClassnames } = useCompactItemContext(prefixCls);

    const [variant, enableVariantCls] = useVariant(customVariant);

    // ===================== Size =====================
    const mergedSize = useSize((ctx) => customizeSize ?? compactSize ?? ctx);

    // ===================== Disabled =====================
    const disabled = React.useContext(DisabledContext);
    const mergedDisabled = customDisabled ?? disabled;

    // ===================== FormItemInput =====================
    const formItemContext = useContext(FormItemInputContext);
    const { hasFeedback, status: contextStatus, feedbackIcon } = formItemContext;

    // ===================== Status =====================
    const mergedStatus = customStatus ?? contextStatus;

    const suffixNode = (
      <>
        {picker === 'time' ? <ClockOutline /> : <CalendarOutline />}
        {hasFeedback && feedbackIcon}
      </>
    );

    useImperativeHandle(ref, () => innerRef.current!);

    const [contextLocale] = useLocale('Calendar', zhCN);

    const locale = { ...contextLocale, ...props.locale! };

    // ============================ zIndex ============================
    const [zIndex] = useZIndex('DatePicker', popupZIndex);

    return (
      <ContextIsolator space>
        <InternalRangePicker<DateType>
          disabled={mergedDisabled}
          ref={innerRef as any} // Need to modify PickerRef
          popupAlign={transPlacement2PopupAlign(placement)}
          placement={placement}
          placeholder={getRangePlaceholder(locale, picker, placeholder)}
          suffixIcon={suffixNode}
          prevIcon={<span className={`${prefixCls}-prev-icon`} />}
          nextIcon={<span className={`${prefixCls}-next-icon`} />}
          superPrevIcon={<span className={`${prefixCls}-super-prev-icon`} />}
          superNextIcon={<span className={`${prefixCls}-super-next-icon`} />}
          picker={picker}
          {...restProps}
          className={classNames(
            {
              [`${prefixCls}-${mergedSize}`]: mergedSize,
              [`${prefixCls}-${variant}`]: enableVariantCls,
            },
            getStatusClassNames(mergedStatus, variant),
            compactItemClassnames,
            className,
          )}
          locale={locale}
          prefixCls={prefixCls}
          getPopupContainer={customizeGetPopupContainer || getPopupContainer}
          generateConfig={generateConfig}
          popupZIndex={zIndex}
        />
      </ContextIsolator>
    );
  });

  return RangePicker;
};

export default generateRangePicker;
