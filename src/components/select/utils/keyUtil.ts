/** keyCode Judgment function */
export function isValidateOpenKey(currentKey: string): boolean {
  return ![
    // System function button
    'Escape',
    'Shift',
    'Backspace',
    'Tab',
    'Meta',
    'Alt',
    'Control',
    ';',
    '=',
    'CapsLock',
    'ContextMenu',
    // F1-F12
    'F1',
    'F2',
    'F3',
    'F4',
    'F5',
    'F6',
    'F7',
    'F8',
    'F9',
    'F10',
    'F11',
    'F12',
  ].includes(currentKey);
}
