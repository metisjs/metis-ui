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
import type {
  GenerateConfig,
  GenericTimePickerProps,
  PickerMode,
  PickerProps,
  PickerRef,
} from '../interface';
import zhCN from '../locale/zh_CN';
import InternalSinglePicker from '../PickerInput/SinglePicker';
import { getPlaceholder, transPlacement2PopupAlign } from '../utils/miscUtil';

const generatePicker = <DateType extends AnyObject = AnyObject>(
  generateConfig: GenerateConfig<DateType>,
) => {
  const getPicker = (picker?: PickerMode) => {
    const Picker = forwardRef<PickerRef, PickerProps<DateType>>((props, ref) => {
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
        ...restProps
      } = props;

      const { getPrefixCls, getPopupContainer } = useContext(ConfigContext);

      const prefixCls = getPrefixCls('picker', customizePrefixCls);
      const { compactSize, compactItemClassnames } = useCompactItemContext(prefixCls);
      const innerRef = React.useRef<PickerRef>(null);

      const [variant, enableVariantCls] = useVariant(customVariant);

      useImperativeHandle(ref, () => innerRef.current!);

      const additionalProps = {
        showToday: true,
      };

      // ===================== Size =====================
      const mergedSize = useSize((ctx) => customizeSize ?? compactSize ?? ctx);

      // ===================== Disabled =====================
      const disabled = React.useContext(DisabledContext);
      const mergedDisabled = customDisabled ?? disabled;

      // ===================== FormItemInput =====================
      const formItemContext = useContext(FormItemInputContext);
      const { hasFeedback, status: contextStatus, feedbackIcon } = formItemContext;

      const suffixNode = (
        <>
          {picker === 'time' ? <ClockOutline /> : <CalendarOutline />}
          {hasFeedback && feedbackIcon}
        </>
      );

      // ===================== Status =====================
      const mergedStatus = customStatus ?? contextStatus;

      const [contextLocale] = useLocale('DatePicker', zhCN);

      const locale = { ...contextLocale, ...props.locale! };
      // ============================ zIndex ============================
      const [zIndex] = useZIndex('DatePicker', popupZIndex);

      return (
        <ContextIsolator space>
          <InternalSinglePicker<DateType>
            ref={innerRef}
            placeholder={getPlaceholder(locale, picker, placeholder)}
            suffixIcon={suffixNode}
            popupAlign={transPlacement2PopupAlign(placement)}
            placement={placement}
            prevIcon={<span className={`${prefixCls}-prev-icon`} />}
            nextIcon={<span className={`${prefixCls}-next-icon`} />}
            superPrevIcon={<span className={`${prefixCls}-super-prev-icon`} />}
            superNextIcon={<span className={`${prefixCls}-super-next-icon`} />}
            picker={picker}
            {...additionalProps}
            {...restProps}
            locale={locale}
            className={classNames(
              {
                [`${prefixCls}-${mergedSize}`]: mergedSize,
                [`${prefixCls}-${variant}`]: enableVariantCls,
              },
              getStatusClassNames(mergedStatus, variant),
              compactItemClassnames,
              className,
            )}
            prefixCls={prefixCls}
            getPopupContainer={customizeGetPopupContainer || getPopupContainer}
            generateConfig={generateConfig}
            disabled={mergedDisabled}
            popupZIndex={zIndex}
          />
        </ContextIsolator>
      );
    }) as unknown as <ValueType extends AnyObject = DateType, MultipleType extends boolean = false>(
      props: PickerProps<ValueType, MultipleType> & React.RefAttributes<PickerRef>,
    ) => React.ReactElement;

    return Picker;
  };

  const DatePicker = getPicker();
  const TimePicker = getPicker('time') as unknown as <
    ValueType extends AnyObject = DateType,
    MultipleType extends boolean = false,
  >(
    props: GenericTimePickerProps<ValueType, MultipleType> & React.RefAttributes<PickerRef>,
  ) => React.ReactElement;

  return { DatePicker, TimePicker };
};

export default generatePicker;
