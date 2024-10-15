import type { ReactElement } from 'react';
import type { ReducerAction } from './hooks/useForm';

type BaseNamePath = string | number | boolean | (string | number | boolean)[];
/**
 * Store: The store type from `FormInstance<Store>`
 * ParentNamePath: Auto generate by nest logic. Do not fill manually.
 */
export type DeepNamePath<
  Store = any,
  ParentNamePath extends any[] = [],
> = ParentNamePath['length'] extends 5
  ? never
  : // Follow code is batch check if `Store` is base type
    true extends (Store extends BaseNamePath ? true : false)
    ? ParentNamePath['length'] extends 0
      ? Store | BaseNamePath // Return `BaseNamePath` instead of array if `ParentNamePath` is empty
      : Store extends any[]
        ? [...ParentNamePath, number] // Connect path
        : never
    : Store extends any[] // Check if `Store` is `any[]`
      ? // Connect path. e.g. { a: { b: string }[] }
        // Get: [a] | [ a,number] | [ a ,number , b]
        [...ParentNamePath, number] | DeepNamePath<Store[number], [...ParentNamePath, number]>
      : keyof Store extends never // unknown
        ? Store
        : {
            // Convert `Store` to <key, value>. We mark key a `FieldKey`
            [FieldKey in keyof Store]: Store[FieldKey] extends (...args: any[]) => any
              ? never
              :
                  | (ParentNamePath['length'] extends 0 ? FieldKey : never) // If `ParentNamePath` is empty, it can use `FieldKey` without array path
                  | [...ParentNamePath, FieldKey] // Exist `ParentNamePath`, connect it
                  | DeepNamePath<Required<Store>[FieldKey], [...ParentNamePath, FieldKey]>; // If `Store[FieldKey]` is object
          }[keyof Store];

export type InternalNamePath = (string | number)[];
export type NamePath<T = any> = DeepNamePath<T>;

export type StoreValue = any;
export type Store = Record<string, StoreValue>;

export interface Meta {
  touched: boolean;
  validating: boolean;
  errors: string[];
  warnings: string[];
  name: InternalNamePath;
  validated: boolean;
}

export interface InternalFieldData extends Meta {
  value: StoreValue;
}

/**
 * Used by `setFields` config
 */
export interface FieldData<Values = any> extends Partial<Omit<InternalFieldData, 'name'>> {
  name: NamePath<Values>;
}

export type RuleType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'method'
  | 'regexp'
  | 'integer'
  | 'float'
  | 'object'
  | 'enum'
  | 'date'
  | 'url'
  | 'hex'
  | 'email';

type Validator = (rule: RuleObject, value: StoreValue) => Promise<void | any>;

export type RuleRender = (form: FormInstance) => RuleObject;

export interface ValidatorRule {
  warningOnly?: boolean;
  message?: string | ReactElement;
  validator: Validator;
}

interface BaseRule {
  warningOnly?: boolean;
  enum?: StoreValue[];
  len?: number;
  max?: number;
  message?: string | ReactElement;
  min?: number;
  pattern?: RegExp;
  required?: boolean;
  transform?: (value: StoreValue) => StoreValue;
  type?: RuleType;
  whitespace?: boolean;

  /** Customize rule level `validateTrigger`. Must be subset of Field `validateTrigger` */
  validateTrigger?: string | string[];
}

type AggregationRule = BaseRule & Partial<ValidatorRule>;

interface ArrayRule extends Omit<AggregationRule, 'type'> {
  type: 'array';
  defaultField?: RuleObject;
}

export type RuleObject = AggregationRule | ArrayRule;

export type Rule = RuleObject | RuleRender;

export interface ValidateErrorEntity<Values = any> {
  values: Values;
  errorFields: { name: InternalNamePath; errors: string[] }[];
  outOfDate: boolean;
}

export interface FieldEntity {
  onStoreChange: (
    store: Store,
    namePathList: InternalNamePath[] | null,
    info: ValuedNotifyInfo,
  ) => void;
  isFieldTouched: () => boolean;
  isFieldDirty: () => boolean;
  isFieldValidating: () => boolean;
  isListField: () => boolean;
  isList: () => boolean;
  isPreserve: () => boolean;
  validateRules: (options?: InternalValidateOptions) => Promise<RuleError[]>;
  getMeta: () => Meta;
  getNamePath: () => InternalNamePath;
  getErrors: () => string[];
  getWarnings: () => string[];
  props: {
    name?: NamePath;
    rules?: Rule[];
    dependencies?: NamePath[];
    initialValue?: any;
  };
}

export interface FieldError {
  name: InternalNamePath;
  errors: string[];
  warnings: string[];
}

export interface RuleError {
  errors: string[];
  rule: RuleObject;
}

export interface ValidateOptions {
  /**
   * Validate only and not trigger UI and Field status update
   */
  validateOnly?: boolean;
  /**
   * Recursive validate. It will validate all the name path that contains the provided one.
   * e.g. [['a']] will validate ['a'] , ['a', 'b'] and ['a', 1].
   */
  recursive?: boolean;
  /** Validate when a field is dirty (validated or touched) */
  dirty?: boolean;
}

export type ValidateFields<Values = any> = {
  (opt?: ValidateOptions): Promise<Values>;
  (nameList?: NamePath[], opt?: ValidateOptions): Promise<Values>;
};

export interface InternalValidateOptions extends ValidateOptions {
  triggerName?: string;
  validateMessages?: ValidateMessages;
}

export type InternalValidateFields<Values = any> = {
  (options?: InternalValidateOptions): Promise<Values>;
  (nameList?: NamePath[], options?: InternalValidateOptions): Promise<Values>;
};

export type InternalIsFieldsTouched = {
  (namePathList?: NamePath[]): boolean;
  (allFieldsTouched?: boolean): boolean;
  (namePathList: NamePath[], allFieldsTouched: boolean): boolean;
};

// >>>>>> Info
interface ValueUpdateInfo {
  type: 'valueUpdate';
  source: 'internal' | 'external';
}

interface ValidateFinishInfo {
  type: 'validateFinish';
}

interface ResetInfo {
  type: 'reset';
}

interface RemoveInfo {
  type: 'remove';
}

interface SetFieldInfo {
  type: 'setField';
  data: FieldData;
}

interface DependenciesUpdateInfo {
  type: 'dependenciesUpdate';
  /**
   * Contains all the related `InternalNamePath[]`.
   * a <- b <- c : change `a`
   * relatedFields=[a, b, c]
   */
  relatedFields: InternalNamePath[];
}

export type NotifyInfo =
  | ValueUpdateInfo
  | ValidateFinishInfo
  | ResetInfo
  | RemoveInfo
  | SetFieldInfo
  | DependenciesUpdateInfo;

export type ValuedNotifyInfo = NotifyInfo & {
  store: Store;
};

export interface Callbacks<Values = any> {
  onValuesChange?: (changedValues: any, values: Values) => void;
  onFieldsChange?: (changedFields: FieldData[], allFields: FieldData[]) => void;
  onFinish?: (values: Values) => void;
  onFinishFailed?: (errorInfo: ValidateErrorEntity<Values>) => void;
}

export type WatchCallBack = (
  values: Store,
  allValues: Store,
  namePathList: InternalNamePath[],
) => void;

export interface WatchOptions<Form extends FormInstance = FormInstance> {
  form?: Form;
  preserve?: boolean;
}

export interface InternalHooks {
  dispatch: (action: ReducerAction) => void;
  initEntityValue: (entity: FieldEntity) => void;
  registerField: (entity: FieldEntity) => () => void;
  useSubscribe: (subscribable: boolean) => void;
  setInitialValues: (values: Store | undefined, init: boolean) => void;
  destroyForm: (clearOnDestroy?: boolean) => void;
  setCallbacks: (callbacks: Callbacks) => void;
  registerWatch: (callback: WatchCallBack) => () => void;
  getFields: (namePathList?: InternalNamePath[]) => FieldData[];
  setValidateMessages: (validateMessages: ValidateMessages) => void;
  setPreserve: (preserve?: boolean) => void;
  getInitialValue: (namePath: InternalNamePath) => StoreValue;
}

/** Only return partial when type is not any */
type RecursivePartial<T> =
  NonNullable<T> extends object
    ? {
        [P in keyof T]?: NonNullable<T[P]> extends (infer U)[]
          ? RecursivePartial<U>[]
          : NonNullable<T[P]> extends object
            ? RecursivePartial<T[P]>
            : T[P];
      }
    : T;

export type FilterFunc = (meta: Meta) => boolean;

export type GetFieldsValueConfig = { strict?: boolean; filter?: FilterFunc };

export interface FormInstance<Values = any> {
  // Origin Form API
  getFieldValue: (name: NamePath<Values>) => StoreValue;
  getFieldsValue: (() => Values) &
    ((nameList: NamePath<Values>[] | true, filterFunc?: FilterFunc) => any) &
    ((config: GetFieldsValueConfig) => any);
  getFieldError: (name: NamePath<Values>) => string[];
  getFieldsError: (nameList?: NamePath<Values>[]) => FieldError[];
  getFieldWarning: (name: NamePath<Values>) => string[];
  isFieldsTouched: ((nameList?: NamePath<Values>[], allFieldsTouched?: boolean) => boolean) &
    ((allFieldsTouched?: boolean) => boolean);
  isFieldTouched: (name: NamePath<Values>) => boolean;
  isFieldValidating: (name: NamePath<Values>) => boolean;
  isFieldsValidating: (nameList?: NamePath<Values>[]) => boolean;
  resetFields: (fields?: NamePath<Values>[]) => void;
  setFields: (fields: FieldData<Values>[]) => void;
  setFieldValue: (name: NamePath<Values>, value: any) => void;
  setFieldsValue: (values: RecursivePartial<Values>) => void;
  validateFields: ValidateFields<Values>;

  // New API
  submit: () => void;
}

export type FormRef<Values = any> = FormInstance<Values> & { nativeElement?: HTMLElement };

export type InternalFormInstance = Omit<FormInstance, 'validateFields'> & {
  validateFields: InternalValidateFields;

  /**
   * Passed by field context props
   */
  prefixName?: InternalNamePath;

  validateTrigger?: string | string[] | false;

  /**
   * Form component should register some content into store.
   * @private Internal usage. Do not use it in your production
   */
  _getInternalHooks: () => InternalHooks;

  /** @private Internal usage. Do not use it in your production */
  _init?: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EventArgs = any[];

type ValidateMessage = string | (() => string);
export interface ValidateMessages {
  default?: ValidateMessage;
  required?: ValidateMessage;
  enum?: ValidateMessage;
  whitespace?: ValidateMessage;
  date?: {
    format?: ValidateMessage;
    parse?: ValidateMessage;
    invalid?: ValidateMessage;
  };
  types?: {
    string?: ValidateMessage;
    method?: ValidateMessage;
    array?: ValidateMessage;
    object?: ValidateMessage;
    number?: ValidateMessage;
    date?: ValidateMessage;
    boolean?: ValidateMessage;
    integer?: ValidateMessage;
    float?: ValidateMessage;
    regexp?: ValidateMessage;
    email?: ValidateMessage;
    url?: ValidateMessage;
    hex?: ValidateMessage;
  };
  string?: {
    len?: ValidateMessage;
    min?: ValidateMessage;
    max?: ValidateMessage;
    range?: ValidateMessage;
  };
  number?: {
    len?: ValidateMessage;
    min?: ValidateMessage;
    max?: ValidateMessage;
    range?: ValidateMessage;
  };
  array?: {
    len?: ValidateMessage;
    min?: ValidateMessage;
    max?: ValidateMessage;
    range?: ValidateMessage;
  };
  pattern?: {
    mismatch?: ValidateMessage;
  };
}
