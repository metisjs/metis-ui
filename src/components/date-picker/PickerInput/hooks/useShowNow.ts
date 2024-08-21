import type { InternalMode, PanelMode } from '../../interface';

export default function useShowNow(
  picker: InternalMode,
  mode: PanelMode,
  showNow?: boolean,
  rangePicker?: boolean,
) {
  if (mode !== 'date' && mode !== 'time') {
    return false;
  }

  if (showNow !== undefined) {
    return showNow;
  }

  return !rangePicker && (picker === 'date' || picker === 'time');
}
