import React, { useCallback, useMemo } from 'react';
import { mergeSemanticCls } from '@util/classNameUtils';
import type { FieldFC } from '..';
import type { InputNumberProps } from '../../../input-number';
import InputNumber from '../../../input-number';
import { useLocale } from '../../../locale';

export type FieldMoneyProps = {
  text: number;
  symbol?: boolean | string;
  precision?: number;
  /**
   * NumberFormat 的配置，文档可以查看 mdn
   *
   * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
   */
  numberFormatOptions?: {
    /**
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
     */
    localeMatcher?: string;
    /**
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
     */
    style?: string;
    /**
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
     */
    currency?: string;
    /**
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
     */
    currencyDisplay?: string;
    /**
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
     */
    currencySign?: string;
    /**
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
     */
    useGrouping?: boolean;
    /**
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
     */
    minimumIntegerDigits?: number;
    /**
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
     */
    minimumFractionDigits?: number;
    /**
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
     */
    maximumFractionDigits?: number;
    /**
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
     */
    minimumSignificantDigits?: number;

    /**
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
     */
    maximumSignificantDigits?: number;
  };
  editorProps?: Partial<InputNumberProps>;
};

const defaultMoneyIntl = new Intl.NumberFormat('zh-Hans-CN', {
  currency: 'CNY',
  style: 'currency',
});

const enMoneyIntl = {
  style: 'currency',
  currency: 'USD',
};

const ruMoneyIntl = {
  style: 'currency',
  currency: 'RUB',
};

const rsMoneyIntl = {
  style: 'currency',
  currency: 'RSD',
};

const msMoneyIntl = {
  style: 'currency',
  currency: 'MYR',
};

const ptMoneyIntl = {
  style: 'currency',
  currency: 'BRL',
};

const intlMap = {
  default: defaultMoneyIntl,
  'zh-Hans-CN': {
    currency: 'CNY',
    style: 'currency',
  },
  'en-US': enMoneyIntl,
  'ru-RU': ruMoneyIntl,
  'ms-MY': msMoneyIntl,
  'sr-RS': rsMoneyIntl,
  'pt-BR': ptMoneyIntl,
};

/**
 * A function that formats the number.
 * @param {string | false} locale - The currency symbol, which is the first parameter of the
 * formatMoney function.
 * @param {number | string | undefined} paramsText - The text to be formatted
 * @param {number} precision - number, // decimal places
 * @param {any} [config] - the configuration of the number format, which is the same as the
 * configuration of the number format in the Intl.NumberFormat method.
 * @returns A function that takes in 4 parameters and returns a string.
 */
const getTextByLocale = (
  locale: string | false,
  paramsText: number | string | undefined,
  precision: number,
  config?: any,
  moneySymbol: string = '',
) => {
  let moneyText: number | string | undefined = paramsText?.toString().replace(/,/g, '');
  if (typeof moneyText === 'string') {
    const parsedNum = Number(moneyText);
    // 转换数字为NaN时，返回原始值展示
    if (Number.isNaN(parsedNum)) return moneyText;
    moneyText = parsedNum;
  }
  if (!moneyText && moneyText !== 0) return '';

  let supportFormat = false;

  try {
    supportFormat =
      locale !== false &&
      Intl.NumberFormat.supportedLocalesOf([locale.replace('_', '-')], {
        localeMatcher: 'lookup',
      }).length > 0;
  } catch (error) {}

  try {
    // Formatting the number, when readonly moneySymbol = false, unused currency.
    const initNumberFormatter = new Intl.NumberFormat(
      supportFormat && locale !== false ? locale?.replace('_', '-') || 'zh-Hans-CN' : 'zh-Hans-CN',
      {
        ...(intlMap[(locale as 'zh-Hans-CN') || 'zh-Hans-CN'] || defaultMoneyIntl),
        maximumFractionDigits: precision,
        ...config,
      },
    );

    const finalMoneyText = initNumberFormatter.format(moneyText);

    // 同时出现两个符号的情况需要处理
    const doubleSymbolFormat = (text: string) => {
      const match = text.match(/\d+/);
      if (match) {
        const number = match[0];
        return text.slice(text.indexOf(number));
      } else {
        return text;
      }
    };
    // 过滤一下，只留下数字
    const pureMoneyText = doubleSymbolFormat(finalMoneyText);

    /**
     * 首字母判断是否是正负符号
     */
    const [operatorSymbol] = finalMoneyText || '';

    // 兼容正负号
    if (['+', '-'].includes(operatorSymbol)) {
      return `${moneySymbol || ''}${operatorSymbol}${pureMoneyText}`;
    }
    return `${moneySymbol || ''}${pureMoneyText}`;
  } catch (error) {
    return moneyText;
  }
};

// 默认的代码类型
const DefaultPrecisionCont = 2;

/**
 * 金额组件
 */
const FieldMoney: FieldFC<FieldMoneyProps> = (
  { text, mode, render, renderEditor, editorProps, precision, symbol, numberFormatOptions },
  ref,
) => {
  const mergedPrecision = precision ?? editorProps?.precision ?? DefaultPrecisionCont;

  const [locale, localeCode] = useLocale('global');

  const moneySymbol = useMemo((): string | undefined => {
    if (typeof symbol === 'string') {
      return symbol;
    }

    if (symbol === false) {
      return undefined;
    }
    return locale.moneySymbol;
  }, [symbol]);

  /*
   * A function that formats the number.
   * 1000 -> 1,000
   */
  const getFormateValue = useCallback(
    (value?: string | number) => {
      const reg = new RegExp(
        `\\B(?=(\\d{${3 + Math.max(mergedPrecision - DefaultPrecisionCont, 0)}})+(?!\\d))`,
        'g',
      );
      // 切分为 整数 和 小数 不同
      const [intStr, floatStr] = String(value).split('.');

      // 最终的数据string，需要去掉 , 号。
      const resultInt = intStr.replace(reg, ',');

      // 计算最终的小数点
      let resultFloat = '';

      /* Taking the floatStr and slicing it to the precision. */
      if (floatStr && mergedPrecision > 0) {
        resultFloat = `.${floatStr.slice(
          0,
          mergedPrecision === undefined ? DefaultPrecisionCont : mergedPrecision,
        )}`;
      }

      return `${resultInt}${resultFloat}`;
    },
    [mergedPrecision],
  );

  // 如果是阅读模式，直接返回字符串
  if (mode === 'read') {
    const dom = (
      <span ref={ref}>
        {getTextByLocale(localeCode, text, mergedPrecision, numberFormatOptions, moneySymbol)}
      </span>
    );
    if (render) {
      return render(text, dom);
    }
    return dom;
  }

  if (mode === 'edit') {
    const dom = (
      <InputNumber
        ref={ref}
        prefix={moneySymbol}
        precision={mergedPrecision}
        formatter={getFormateValue}
        parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
        {...editorProps}
        className={mergeSemanticCls('w-full', editorProps?.className)}
      />
    );

    if (renderEditor) {
      return renderEditor(text, dom);
    }
    return dom;
  }
  return null;
};

export default React.forwardRef(FieldMoney);
