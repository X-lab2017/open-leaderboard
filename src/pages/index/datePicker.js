import React, { useState } from 'react';
import { DatePicker, TimePicker, Select, Space, Button,message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

function PickerWithType({ type, onChange }) {
  return <DatePicker picker={type} onChange={onChange} />;
}

const solveDate = (year,month)=>{
    if(year===null&&month===null){
        return "not found";
    }
    if(month===null){
        return year+"年";
    }
    return year+"年"+(month+1)+"月";
}
function DateTitle(props){
    console.log(props);
    return (
        <h1>{solveDate(props.year,props.month)}</h1>
    );
}

function SwitchablePicker(props) {
  // 默认初始为 ‘month’
  const [type, setType] = useState('month');
  const [year, setYear] = useState(null);
  const [month, setMonth] = useState(null);
  const [nowDate, setNowDate] = useState({year:props.year,month:props.month});

  return (
    <>
        <Space style={{'marginBottom':'20px'}}>
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
                setNowDate({year:year,month:month});
                props.fetch(year,month);
            }}>Search</Button>
        </Space>
        <DateTitle year={nowDate.year} month={nowDate.month} />
    </>
  );
}

export default SwitchablePicker;