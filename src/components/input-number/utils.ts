import type {
  DecimalClass,
  ValueType} from '@rc-component/mini-decimal';
import getMiniDecimal, {
  num2str,
  trimNumber
} from '@rc-component/mini-decimal';

export function getDecupleSteps(step: string | number) {
  const stepStr = typeof step === 'number' ? num2str(step) : trimNumber(step).fullStr;
  const hasPoint = stepStr.includes('.');
  if (!hasPoint) {
    return step + '0';
  }
  return trimNumber(stepStr.replace(/(\d)\.(\d)/g, '$1$2.')).fullStr;
}

/**
 * We support `stringMode` which need handle correct type when user call in onChange
 * format max or min value
 * 1. if isInvalid return null
 * 2. if precision is undefined, return decimal
 * 3. format with precision
 *    I. if max > 0, round down with precision. Example: max= 3.5, precision=0  afterFormat: 3
 *    II. if max < 0, round up with precision. Example: max= -3.5, precision=0  afterFormat: -4
 *    III. if min > 0, round up with precision. Example: min= 3.5, precision=0  afterFormat: 4
 *    IV. if min < 0, round down with precision. Example: max= -3.5, precision=0  afterFormat: -3
 */
export const getDecimalValue = (stringMode: boolean = false, decimalValue: DecimalClass) => {
  if (stringMode || decimalValue.isEmpty()) {
    return decimalValue.toString();
  }

  return decimalValue.toNumber();
};

export const getDecimalIfValidate = (value?: ValueType) => {
  const decimal = getMiniDecimal(value!);
  return decimal.isInvalidate() ? null : decimal;
};
