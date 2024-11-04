import * as React from 'react';
import { clsx, type SemanticClassName } from '../_util/classNameUtils';
import useBreakpoint from '../_util/hooks/useBreakpoint';
import useSemanticCls from '../_util/hooks/useSemanticCls';
import type { Breakpoint } from '../_util/responsiveObserver';
import { matchScreen } from '../_util/responsiveObserver';
import { ConfigContext } from '../config-provider';
import { DEFAULT_COLUMN_MAP } from './constant';
import { DescriptionsContext } from './context';
import useItems from './hooks/useItems';
import useRow from './hooks/useRow';
import Row from './Row';

export type ItemClassNameType = SemanticClassName<{ label?: string; content?: string }>;

export interface InternalDescriptionsItemType {
  key?: React.Key;
  className?: ItemClassNameType;
  style?: React.CSSProperties;
  label?: React.ReactNode;
  content: React.ReactNode;
  span?: number;
}

export interface DescriptionsItemType extends Omit<InternalDescriptionsItemType, 'span'> {
  span?: number | { [key in Breakpoint]?: number };
}

export interface DescriptionsProps {
  prefixCls?: string;
  className?: SemanticClassName<{
    header?: string;
    title?: string;
    extra?: string;
    view?: string;
    item?: ItemClassNameType;
  }>;
  style?: React.CSSProperties;
  bordered?: boolean;
  size?: 'middle' | 'small' | 'default';
  title?: React.ReactNode;
  extra?: React.ReactNode;
  column?: number | Partial<Record<Breakpoint, number>>;
  layout?: 'horizontal' | 'vertical';
  colon?: boolean;
  items?: DescriptionsItemType[];
  id?: string;
}

const Descriptions: React.FC<DescriptionsProps> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    title,
    extra,
    column,
    colon = true,
    bordered,
    layout,
    className,
    style,
    size,
    items,
    ...restProps
  } = props;
  const { getPrefixCls } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('descriptions', customizePrefixCls);

  const screens = useBreakpoint();

  // Column count
  const mergedColumn = React.useMemo(() => {
    if (typeof column === 'number') {
      return column;
    }

    return (
      matchScreen(screens, {
        ...DEFAULT_COLUMN_MAP,
        ...column,
      }) ?? 3
    );
  }, [screens, column]);

  // Items with responsive
  const mergedItems = useItems(screens, items);

  const rows = useRow(mergedColumn, mergedItems);

  // ======================== Style ========================
  const semanticCls = useSemanticCls(className, 'descriptions');

  const rootCls = clsx(
    prefixCls,
    {
      [`${prefixCls}-${size}`]: size && size !== 'default',
      [`${prefixCls}-bordered`]: !!bordered,
    },
    'text-sm text-text',
    semanticCls.root,
  );

  const headerCls = clsx(`${prefixCls}-header`, 'mb-5 flex items-center', semanticCls.header);

  const titleCls = clsx(
    `${prefixCls}-title`,
    'flex-auto truncate text-base font-semibold',
    semanticCls.title,
  );

  const extraCls = clsx(`${prefixCls}-extra`, 'ms-auto', semanticCls.extra);

  const viewCls = clsx(
    `${prefixCls}-view`,
    { 'rounded-lg border border-border-tertiary': bordered },
    semanticCls.view,
  );

  const tableCls = clsx('w-full table-fixed border-collapse', { 'table-auto': bordered });

  // ======================== Render ========================
  const contextValue = React.useMemo(
    () => ({
      size,
      itemClassName: semanticCls.item,
    }),
    [size, semanticCls.item],
  );

  return (
    <DescriptionsContext.Provider value={contextValue}>
      <div className={rootCls} style={style} {...restProps}>
        {(title || extra) && (
          <div className={headerCls}>
            {title && <div className={titleCls}>{title}</div>}
            {extra && <div className={extraCls}>{extra}</div>}
          </div>
        )}

        <div className={viewCls}>
          <table className={tableCls}>
            <tbody>
              {rows.map((row, index) => (
                <Row
                  key={index}
                  index={index}
                  colon={colon}
                  prefixCls={prefixCls}
                  vertical={layout === 'vertical'}
                  bordered={bordered}
                  row={row}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DescriptionsContext.Provider>
  );
};

if (process.env.NODE_ENV !== 'production') {
  Descriptions.displayName = 'Descriptions';
}

export type { DescriptionsContextProps } from './context';
export { DescriptionsContext };

export default Descriptions;
