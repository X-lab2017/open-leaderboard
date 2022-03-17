import React, { useEffect, useState } from 'react';
import { DatePicker, Select, Space } from 'antd';
import moment from 'moment'
const { Option } = Select;
function PickerWithType({ defaultValue, type, onChange }) {
  return <DatePicker defaultValue={defaultValue} format={'YYYY/MM'} picker={type} onChange={onChange} />;
}

function disabledDate(current) {
    // Can not select days before today and today
    return current< moment('2015') || current >= moment().endOf('day');
}

const SwitchablePicker = (props) => {
  console.log(moment(String(props.year)+'-'+String(props.month)));
  const [type, setType] = useState('month');
  return (
    <>
        <Space>
          <Select value={type} onChange={setType} >
            <Option value="month">Month</Option>
            <Option value="year">Year</Option>
          </Select>
          <PickerWithType defaultValue={moment(String(props.year)+'/'+String(1+props.month),'YYYY/MM')} type={type} onChange={value => props.setState({'month':value.month(),'year':String(value.years())})} />
        </Space>
    </>
  );
}

export default SwitchablePicker;