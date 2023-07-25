import React from 'react';
import { DatePicker, Select, Space } from 'antd';
import moment from 'moment';
const { Option } = Select;
function PickerWithType({ month, year, type, onChange }) {
  console.log('PickerWithType:', year, month, type);
  if (year == null && month == null)
    return <DatePicker format={'YYYY/MM'} picker={type} onChange={onChange} />;
  console.log('Hi!');
  if (type === 'month')
    return (
      <DatePicker
        value={moment(String(year) + '/' + String(1 + month), 'YYYY/MM')}
        format={'YYYY/MM'}
        picker={type}
        onChange={onChange}
        allowClear={false}
      />
    );
  else if (type === 'year')
    return (
      <DatePicker
        value={moment(year, 'YYYY')}
        format={'YYYY'}
        picker={type}
        onChange={onChange}
        allowClear={false}
      />
    );
}

const SwitchablePicker = (props) => {
  return (
    <>
      <Space>
        <Select
          value={props.type}
          onChange={(value) => {
            props.setState({ type: value });
          }}
        >
          <Option value="month">Month</Option>
          <Option value="year">Year</Option>
        </Select>
        <PickerWithType
          month={props.month}
          year={props.year}
          type={props.type}
          onChange={(value) => {
            props.setState({
              month: value.months(),
              year: String(value.years()),
            });
          }}
        />
      </Space>
    </>
  );
};

export default SwitchablePicker;
