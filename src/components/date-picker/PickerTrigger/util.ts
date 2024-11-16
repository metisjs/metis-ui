import type { SharedPickerProps } from '../interface';
import { pickProps, transPlacement2PopupAlign } from '../utils/miscUtil';

export function pickTriggerProps(
  props: Omit<SharedPickerProps, 'showTime' | 'status' | 'className'>,
) {
  return {
    popupAlign: transPlacement2PopupAlign(props.placement),
    ...pickProps(props, ['placement', 'builtinPlacements', 'popupAlign', 'getPopupContainer']),
  };
}
