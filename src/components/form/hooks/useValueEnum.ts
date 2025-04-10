import { useState } from 'react';
import omit from '@rc-component/util/es/omit';
import { useRequest } from 'ahooks';
import { isValueEnumWithRequest } from '../Field/util';
import type {
  FieldValueEnumMap,
  FieldValueEnumObj,
  FieldValueEnumRequestType,
  RequestDataType,
} from '../interface';

const defaultFieldNames = {
  label: 'label',
  value: 'value',
  status: 'status',
  color: 'color',
  disabled: 'disabled',
};

const useValueEnum = (
  valueEnum?: FieldValueEnumObj | FieldValueEnumMap | FieldValueEnumRequestType,
  cacheKey?: string,
  ready?: boolean,
) => {
  const [remoteValueEnum, setRemoteValueEnum] = useState<FieldValueEnumObj>();

  const isValueEnumRequest = isValueEnumWithRequest(valueEnum);
  const fieldNames = isValueEnumRequest
    ? {
        ...defaultFieldNames,
        ...valueEnum?.fieldNames,
      }
    : defaultFieldNames;

  const { loading } = useRequest(
    (...defaultParams: any[]) => {
      if (isValueEnumRequest) {
        return valueEnum.request(...defaultParams);
      }
      return new Promise(() => {});
    },
    {
      loadingDelay: 100,
      cacheKey,
      staleTime: 1000 * 5,
      ready: ready,
      ...(isValueEnumRequest
        ? {
            onSuccess: (
              data: {
                data: RequestDataType[];
              },
              params: any[],
            ) => {
              setRemoteValueEnum(() =>
                data.data.reduce(
                  (pre, cur) => ({
                    ...pre,
                    [cur[fieldNames.value]]: {
                      label: cur[fieldNames.label] ?? cur[fieldNames.value],
                      status: cur[fieldNames.status],
                      color: cur[fieldNames.color],
                      disabled: cur[fieldNames.disabled],
                    },
                  }),
                  {} as FieldValueEnumObj,
                ),
              );
              valueEnum.onSuccess?.(data, params);
            },
            ...omit(valueEnum, ['request', 'fieldNames', 'onSuccess']),
          }
        : { ready: false }),
    },
  );

  const mergedValueEnum = isValueEnumRequest ? remoteValueEnum : valueEnum;

  return [mergedValueEnum, loading] as const;
};

export default useValueEnum;
