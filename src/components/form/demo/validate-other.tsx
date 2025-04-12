import React from 'react';
import { ArrowUpOutline, InboxOutline } from '@metisjs/icons';
import {
  Button,
  Checkbox,
  ColorPicker,
  Form,
  InputNumber,
  Radio,
  Rate,
  Select,
  Slider,
  Space,
  Switch,
  Upload,
} from 'metis-ui';

const normFile = (e: any) => {
  console.log('Upload event:', e);
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const onFinish = (values: any) => {
  console.log('Received values of form: ', values);
};

const App: React.FC = () => (
  <Form
    name="validate_other"
    onFinish={onFinish}
    initialValues={{
      'input-number': 3,
      'checkbox-group': ['A', 'B'],
      rate: 3.5,
      'color-picker': null,
    }}
    className="max-w-[600px]"
  >
    <Form.Item label="Plain Text">
      <span className="ant-form-text">China</span>
    </Form.Item>
    <Form.Item
      name="select"
      label="Select"
      hasFeedback
      rules={[{ required: true, message: 'Please select your country!' }]}
    >
      <Select
        options={[
          { value: 'china', label: 'China' },
          { value: 'usa', label: 'U.S.A' },
        ]}
        placeholder="Please select a country"
      ></Select>
    </Form.Item>

    <Form.Item
      name="select-multiple"
      label="Select[multiple]"
      rules={[{ required: true, message: 'Please select your favourite colors!', type: 'array' }]}
    >
      <Select
        mode="multiple"
        options={[
          { value: 'red', label: 'Red' },
          { value: 'green', label: 'Green' },
          { value: 'blue', label: 'Blue' },
        ]}
        placeholder="Please select favourite colors"
      ></Select>
    </Form.Item>

    <Form.Item label="InputNumber">
      <Form.Item name="input-number" noStyle>
        <InputNumber min={1} max={10} />
      </Form.Item>
      <span className="ant-form-text" style={{ marginInlineStart: 8 }}>
        machines
      </span>
    </Form.Item>

    <Form.Item name="switch" label="Switch" valuePropName="checked">
      <Switch />
    </Form.Item>

    <Form.Item name="slider" label="Slider">
      <Slider
        marks={{
          0: 'A',
          20: 'B',
          40: 'C',
          60: 'D',
          80: 'E',
          100: 'F',
        }}
      />
    </Form.Item>

    <Form.Item
      name="radio-group"
      label="Radio.Group"
      rules={[{ required: true, message: 'Please pick an item!' }]}
    >
      <Radio.Group>
        <Radio value="a">item 1</Radio>
        <Radio value="b">item 2</Radio>
        <Radio value="c">item 3</Radio>
      </Radio.Group>
    </Form.Item>

    <Form.Item name="checkbox-group" label="Checkbox.Group">
      <Checkbox.Group className="grid grid-cols-4 grid-rows-subgrid">
        <Checkbox value="A" className="leading-9">
          A
        </Checkbox>
        <Checkbox value="B" disabled className="leading-9">
          B
        </Checkbox>
        <Checkbox value="C" className="leading-9">
          C
        </Checkbox>
        <Checkbox value="D" className="leading-9">
          D
        </Checkbox>
        <Checkbox value="E" className="leading-9">
          E
        </Checkbox>
        <Checkbox value="F" className="leading-9">
          F
        </Checkbox>
      </Checkbox.Group>
    </Form.Item>

    <Form.Item name="rate" label="Rate">
      <Rate />
    </Form.Item>

    <Form.Item
      name="upload"
      label="Upload"
      valuePropName="fileList"
      getValueFromEvent={normFile}
      extra="longgggggggggggggggggggggggggggggggggg"
    >
      <Upload name="logo" action="/upload.do" listType="picture">
        <Button icon={<ArrowUpOutline />}>Click to upload</Button>
      </Upload>
    </Form.Item>
    <Form.Item label="Dragger">
      <Form.Item name="dragger" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
        <Upload.Dragger name="files" action="/upload.do">
          <p className="mb-4 text-center">
            <InboxOutline className="text-primary h-12 w-12" />
          </p>
          <p className="mb-1 text-center text-base">Click or drag file to this area to upload</p>
          <p className="text-text-tertiary text-center">Support for a single or bulk upload.</p>
        </Upload.Dragger>
      </Form.Item>
    </Form.Item>
    <Form.Item
      name="color-picker"
      label="ColorPicker"
      rules={[{ required: true, message: 'color is required!' }]}
    >
      <ColorPicker />
    </Form.Item>

    <Form.Item>
      <Space>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
        <Button htmlType="reset">Reset</Button>
      </Space>
    </Form.Item>
  </Form>
);

export default App;
