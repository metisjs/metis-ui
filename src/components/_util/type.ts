export type LiteralUnion<T extends string> = T | (string & Record<string, never>);

export type AnyObject = Record<PropertyKey, any>;

/**
 * Get component props
 * @example
 * ```ts
 * import { Checkbox } from 'metis-ui'
 * import type { GetProps } from 'metis-ui';
 *
 * type CheckboxGroupProps = GetProps<typeof Checkbox.Group>
 * ```
 */
export type GetProps<T extends React.ComponentType<any> | object> = T extends React.ComponentType<
  infer P
>
  ? P
  : T extends object
  ? T
  : never;

/**
 * Get component props by component name
 * @example
 * ```ts
 * import { Select } from 'metis-ui';
 * import type { GetProp, SelectProps } from 'metis-ui';
 *
 * type SelectOption1 = GetProp<SelectProps, 'options'>[number];
 * // or
 * type SelectOption2 = GetProp<typeof Select, 'options'>[number];
 *
 * const onChange: GetProp<typeof Select, 'onChange'> = (value, option) => {
 *  // Do something
 * };
 * ```
 */
export type GetProp<
  T extends React.ComponentType<any> | object,
  PropName extends keyof GetProps<T>,
> = NonNullable<GetProps<T>[PropName]>;

type ReactRefComponent<Props extends { ref?: React.Ref<any> | string }> = (
  props: Props,
) => React.ReactNode;

type ExtractRefAttributesRef<T> = T extends React.RefAttributes<infer P> ? P : never;

/**
 * Get component ref
 * @example
 * ```ts
 * import { Input } from 'metis-ui';
 * import type { GetRef } from 'metis-ui';
 *
 * type InputRef = GetRef<typeof Input>;
 * ```
 */
export type GetRef<T extends ReactRefComponent<any> | React.Component<any>> =
  T extends React.Component<any>
    ? T
    : T extends React.ComponentType<infer P>
    ? ExtractRefAttributesRef<P>
    : never;
