import * as React from 'react';
import { forwardRef } from 'react';
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

const generatePicker = <DateType extends AnyObject = AnyObject>(
  generateConfig: GenerateConfig<DateType>,
) => {
  const getPicker = (picker?: PickerMode) => {
    const Picker = forwardRef<PickerRef, PickerProps<DateType>>((props, ref) => {
      const additionalProps = {
        showToday: true,
      };

      return (
        <ContextIsolator space>
          <InternalSinglePicker<DateType>
            ref={ref}
            picker={picker}
            {...additionalProps}
            {...props}
            generateConfig={generateConfig}
          />
        </ContextIsolator>
      );
    }) as unknown as <ValueType extends AnyObject = DateType, MultipleType extends boolean = false>(
      props: PickerProps<ValueType, MultipleType> & React.RefAttributes<PickerRef>,
    ) => React.ReactElement;

    return Picker;
  };

  const DatePicker = getPicker();
  const TimePicker = getPicker('time') as unknown as <
    ValueType extends AnyObject = DateType,
    MultipleType extends boolean = false,
  >(
    props: GenericTimePickerProps<ValueType, MultipleType> & React.RefAttributes<PickerRef>,
  ) => React.ReactElement;

  return { DatePicker, TimePicker };
};

export default generatePicker;
