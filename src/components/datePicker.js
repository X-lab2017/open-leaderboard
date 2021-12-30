import React, { useEffect, useState } from 'react';
import { DatePicker, TimePicker, Select, Space, message, Tabs } from 'antd';
import moment from 'moment'
import { useTranslation } from 'react-i18next';
const { TabPane} = Tabs;

function PickerWithType({ type, onChange, defaultDate }) {
    console.log(defaultDate);
  return <DatePicker picker={type} onChange={onChange}  disabledDate={disabledDate}  defaultValue={defaultDate}/>;
}

function disabledDate(current) {
    // Can not select days before today and today
    return current< moment('2015') || current >= moment().endOf('day');
  }

const SwitchablePicker = (props) => {
  const { t } = useTranslation();
  const [monthDate, setMonthDate] = useState({year:props.year,month:props.month});
  const [yearDate, setYearDate] = useState(props.year);
  return (
    <>
        <Tabs 
          onChange={(activeKey)=>{
            if(activeKey=='month'){
              console.log('month'+monthDate);
              props.update(monthDate.year,monthDate.month);
            }
            else{
              console.log('year'+yearDate);
              props.update(yearDate,null);
            }
          }}
          defaultActiveKey="month">
            <TabPane tab={t('month')} key="month">
                <PickerWithType type='month' defaultDate={moment(props.year+'/'+(props.month+1),'YYYY-MM')} 
                  onChange={value=>{
                      if(value.years === null || value.months === null){
                          message.error('This is an error month');
                          return false;
                      }
                      setMonthDate({year:value.years(),month:value.months()});
                      props.update(value.years(),value.months());
                  }} 
                />
            </TabPane>
            <TabPane tab={t('year')} key="year">
                <PickerWithType type='year' defaultDate={moment(props.year)} onChange={value=>{
                    if(value.years() === null){
                        message.error('This is an error year');
                        return false;
                    }
                    setYearDate(value.years());
                    props.update(value.years(),null);
                 }} />
            </TabPane>
        </Tabs>
    </>
  );
}

export default SwitchablePicker;