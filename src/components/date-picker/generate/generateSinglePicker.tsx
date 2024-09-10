import * as React from 'react';
import { forwardRef } from 'react';
import type { Dayjs } from 'dayjs';
import ContextIsolator from '../../_util/ContextIsolator';
import type { AnyObject } from '../../_util/type';
import type {
  GenerateConfig,
  GenericTimePickerProps,
  PickerMode,
  PickerProps,
  PickerRef,
} from '../interface';
import InternalSinglePicker from '../PickerInput/SinglePicker';

const generatePicker = <DateType extends AnyObject = Dayjs>(
  generateConfig: GenerateConfig<DateType>,
) => {
  const getPicker = (picker?: PickerMode) => {
    const Picker = forwardRef<PickerRef, PickerProps<DateType>>((props, ref) => {
      return (
        <ContextIsolator space>
          <InternalSinglePicker<DateType>
            ref={ref}
            picker={picker}
            {...props}
            generateConfig={generateConfig}
          />
        </ContextIsolator>
      );
    }) as unknown as <MultipleType extends boolean = false>(
      props: PickerProps<DateType, MultipleType> & React.RefAttributes<PickerRef>,
    ) => React.ReactElement;

    return Picker;
  };

  const DatePicker = getPicker();
  const TimePicker = getPicker('time') as unknown as <MultipleType extends boolean = false>(
    props: GenericTimePickerProps<DateType, MultipleType> & React.RefAttributes<PickerRef>,
  ) => React.ReactElement;

  return { DatePicker, TimePicker };
};

export default generatePicker;
