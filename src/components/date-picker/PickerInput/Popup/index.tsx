import * as React from 'react';
import { clsx } from '@util/classNameUtils';
import ResizeObserver, { type ResizeObserverProps } from 'rc-resize-observer';
import type {
  RangeTimeProps,
  SharedPickerProps,
  SharedTimeProps,
  ValueDate,
} from '../../interface';
import { toArray } from '../../utils/miscUtil';
import PickerContext from '../context';
import Footer, { type FooterProps } from './Footer';
import PopupPanel, { type PopupPanelProps } from './PopupPanel';
import type { PresetPanelClassName } from './PresetPanel';
import PresetPanel from './PresetPanel';

export type PopupShowTimeConfig<DateType extends object = any> = Omit<
  RangeTimeProps<DateType>,
  'defaultValue' | 'defaultOpenValue' | 'disabledTime'
> &
  Pick<SharedTimeProps<DateType>, 'disabledTime'>;

export interface PopupProps<DateType extends object = any, PresetValue = DateType>
  extends Pick<React.InputHTMLAttributes<HTMLDivElement>, 'onFocus' | 'onBlur'>,
    Omit<FooterProps<DateType>, 'className'>,
    PopupPanelProps<DateType> {
  panelClassName?: PopupPanelProps<DateType>['className'];
  presetsClassName?: PresetPanelClassName;
  footerClassName?: string;

  panelRender?: SharedPickerProps['panelRender'];

  // Presets
  presets?: ValueDate<DateType>[];
  onPresetHover: (presetValue: PresetValue) => void;
  onPresetSubmit: (presetValue: PresetValue) => void;

  // Range
  activeOffset?: number;
  placement?: string;

  // Fill
  /** TimePicker or showTime only */
  defaultOpenValue: DateType;

  // Change
  needConfirm: boolean;
  isInvalid: (date: DateType | DateType[]) => boolean;
  onOk: VoidFunction;

  onPanelMouseDown?: React.MouseEventHandler<HTMLDivElement>;
}

export default function Popup<DateType extends object = any>(props: PopupProps<DateType>) {
  const {
    panelClassName,
    presetsClassName,
    footerClassName,
    panelRender,
    picker,
    showNow,

    // Range
    range,
    multiple,
    activeOffset = 0,

    // Presets
    presets = [],
    onPresetHover,
    onPresetSubmit,

    // Focus
    onFocus,
    onBlur,
    onPanelMouseDown,

    // Change
    value,
    onSelect,
    isInvalid,
    defaultOpenValue,
    onOk,
    onSubmit,
  } = props;

  const { prefixCls } = React.useContext(PickerContext);
  const panelPrefixCls = `${prefixCls}-panel`;

  // ========================= Refs =========================
  const arrowRef = React.useRef<HTMLDivElement>(null);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  // ======================== Offset ========================
  const [containerWidth, setContainerWidth] = React.useState<number>(0);
  const [containerOffset, setContainerOffset] = React.useState<number>(0);

  const onResize: ResizeObserverProps['onResize'] = (info) => {
    if (info.offsetWidth) {
      setContainerWidth(info.offsetWidth);
    }
  };

  React.useEffect(() => {
    // `activeOffset` is always align with the active input element
    // So we need only check container contains the `activeOffset`
    if (range) {
      // Offset in case container has border radius
      const arrowWidth = arrowRef.current?.offsetWidth || 0;

      const maxOffset = containerWidth - arrowWidth;
      if (activeOffset <= maxOffset) {
        setContainerOffset(0);
      } else {
        setContainerOffset(activeOffset + arrowWidth - containerWidth);
      }
    }
  }, [containerWidth, activeOffset, range]);

  // ======================== Custom ========================
  function filterEmpty<T>(list: T[]) {
    return list.filter((item) => item);
  }

  const valueList = React.useMemo(() => filterEmpty(toArray(value)), [value]);

  const isTimePickerEmptyValue = picker === 'time' && !valueList.length;

  const footerSubmitValue = React.useMemo(() => {
    if (isTimePickerEmptyValue) {
      return filterEmpty([defaultOpenValue]);
    }
    return valueList;
  }, [isTimePickerEmptyValue, valueList, defaultOpenValue]);

  const popupPanelValue = isTimePickerEmptyValue ? defaultOpenValue : valueList;

  const disableSubmit = React.useMemo(() => {
    // Empty is invalid
    if (!footerSubmitValue.length) {
      return true;
    }

    return footerSubmitValue.some((val) => isInvalid(val));
  }, [footerSubmitValue, isInvalid]);

  const onFooterSubmit = () => {
    // For TimePicker, we will additional trigger the value update
    if (isTimePickerEmptyValue) {
      onSelect?.(defaultOpenValue);
    }

    onOk();
    onSubmit();
  };

  // ======================== Style ========================
  const containerCls = clsx(
    `${panelPrefixCls}-container`,
    'bg-elevated overflow-hidden rounded-lg',
  );

  const panelLayoutCls = clsx(
    `${prefixCls}-panel-layout`,
    'text-text flex flex-nowrap items-stretch text-sm',
  );

  const rangeWrapperCls = clsx(
    `${prefixCls}-range-wrapper`,
    `${prefixCls}-${picker}-range-wrapper`,
    'relative flex',
  );

  // ======================== Render ========================
  let mergedNodes: React.ReactNode = (
    <div className={panelLayoutCls}>
      {/* `any` here since PresetPanel is reused for both Single & Range Picker which means return type is not stable */}
      <PresetPanel<any>
        prefixCls={prefixCls}
        presets={presets}
        onClick={onPresetSubmit}
        onHover={onPresetHover}
        className={presetsClassName}
      />
      <div>
        <PopupPanel {...props} className={panelClassName} value={popupPanelValue} />
        <Footer
          {...props}
          showNow={multiple ? false : showNow}
          invalid={disableSubmit}
          onSubmit={onFooterSubmit}
          className={footerClassName}
        />
      </div>
    </div>
  );

  if (panelRender) {
    mergedNodes = panelRender(mergedNodes);
  }

  // Container
  let renderNode = (
    <div
      onMouseDown={onPanelMouseDown}
      tabIndex={-1}
      className={containerCls}
      style={{
        marginLeft: containerOffset,
        marginRight: 'auto',
      }}
      // Still wish not to lose focus on mouse down
      // onMouseDown={(e) => {
      //   // e.preventDefault();
      // }}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {mergedNodes}
    </div>
  );

  if (range) {
    renderNode = (
      <div onMouseDown={onPanelMouseDown} ref={wrapperRef} className={rangeWrapperCls}>
        {/* Watch for container size */}
        <ResizeObserver onResize={onResize}>{renderNode}</ResizeObserver>
      </div>
    );
  }

  return renderNode;
}
