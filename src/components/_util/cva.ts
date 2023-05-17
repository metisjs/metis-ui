import { cva as originCVA } from 'class-variance-authority';
import { ClassProp, ClassValue, StringToBoolean } from 'class-variance-authority/dist/types';
import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';

type ConfigSchema = Record<string, Record<string, ClassValue>>;
type ConfigVariants<T extends ConfigSchema> = {
  [Variant in keyof T]?: StringToBoolean<keyof T[Variant]> | null | undefined;
};
type ConfigVariantsMulti<T extends ConfigSchema> = {
  [Variant in keyof T]?:
    | StringToBoolean<keyof T[Variant]>
    | StringToBoolean<keyof T[Variant]>[]
    | undefined;
};
type Config<T> = T extends ConfigSchema
  ? {
      variants?: T;
      defaultVariants?: ConfigVariants<T>;
      compoundVariants?: (T extends ConfigSchema
        ? (ConfigVariants<T> | ConfigVariantsMulti<T>) & ClassProp
        : ClassProp)[];
    }
  : never;
type Props<T> = T extends ConfigSchema ? ConfigVariants<T> & ClassProp : ClassProp;

export default function cva<T>(base?: ClassValue, config?: Config<T> | undefined) {
  return (props: Props<T>, extra: (string | undefined)[] = []) =>
    twMerge(classNames(originCVA(base, config)(props), ...extra));
}
