import React, { useEffect, useState } from 'react';
import { DatePicker, TimePicker, Select, Space, Button,message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

function PickerWithType({ type, onChange }) {
  return <DatePicker picker={type} onChange={onChange} />;
}

function SwitchablePicker(props) {
  // 默认初始为 ‘month’
  const [type, setType] = useState('month');
  const [year, setYear] = useState(null);
  const [month, setMonth] = useState(null);

  return (
    <>
        <Space style={{'marginBottom':'50px'}}>
            <Select value={type} onChange={setType}>
                <Option value="month">Month</Option>
                <Option value="year">Year</Option>
            </Select>
            <PickerWithType type={type} onChange={value=>{
                if(value === null){
                    setYear(null);
                    setMonth(null);
                    return false;
                }
                if(type=='year'){
                    setYear(value.years());
                    setMonth(null);
                }
                else if(type=='month'){
                    setYear(value.years());
                    setMonth(value.months());
                }
            }} />
            <Button icon={<SearchOutlined />} onClick={()=>{
                if(year === null || (year===null && month !== null)){
                    message.error('This is an error date');
                    return false;
                }
                props.update(year,month);
            }}>Search</Button>
        </Space>
    </>
  );
}

export default SwitchablePicker;