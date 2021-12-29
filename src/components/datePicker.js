import React, { useEffect, useState } from 'react';
import { DatePicker, TimePicker, Select, Space, message, Tabs } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
const { TabPane} = Tabs;
const { Option } = Select;

function PickerWithType({ type, onChange }) {
  return <DatePicker picker={type} onChange={onChange} />;
}

const SwitchablePicker = (props) => {
  return (
    <>
        <Tabs defaultActiveKey="1">
            <TabPane tab="月度" key="1">
                <PickerWithType type='month' onChange={value=>{
                    if(value.years === null || value.months === null){
                        message.error('This is an error month');
                        return false;
                    }
                    props.update(value.years(),value.months());
                }} />
            </TabPane>
            <TabPane tab="年度" key="2">
                <PickerWithType type='year' onChange={value=>{
                    if(value.years() === null){
                        message.error('This is an error year');
                        return false;
                    }
                    props.update(value.years(),null);
                 }} />
            </TabPane>
        </Tabs>
    </>
  );
}

export default SwitchablePicker;