import React from 'react';
import { DatePicker, Select, Space } from 'antd';
import moment from 'moment'
const { Option } = Select;
function PickerWithType({month, year, type, onChange }) {
  console.log('time type is'+type);
  if(type=='month')
    return <DatePicker defaultValue={moment(String(year)+'/'+String(1+month),'YYYY/MM')} format={'YYYY/MM'} picker={type} onChange={onChange} />;
  else if(type == 'year')
    return <DatePicker  defaultValue={moment(year,'YYYY')} format={'YYYY'} picker={type} onChange={onChange} />;
}

function disabledDate(current) {
    // Can not select days before 2015 or after today
    return current< moment('2015') || current >= moment().endOf('day');
}

const SwitchablePicker = (props) => {
  return (
    <>
        <Space>
          <Select value={props.type} onChange={value=>{props.setState({'type':value})}} >
            <Option value="month">Month</Option>
            <Option value="year">Year</Option>
          </Select>
          <PickerWithType month={props.month} year={props.year} type={props.type} onChange={value => {props.setState({'month':value.months(),'year':String(value.years())})}} />
        </Space>
    </>
  );
}

export default SwitchablePicker;