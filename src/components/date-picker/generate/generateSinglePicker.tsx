import * as React from 'react';
import { forwardRef } from 'react';
import type { AnyObject } from '@util/type';
import type { Dayjs } from 'dayjs';
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
        <InternalSinglePicker<DateType>
          ref={ref}
          picker={picker}
          {...props}
          generateConfig={generateConfig}
        />
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
