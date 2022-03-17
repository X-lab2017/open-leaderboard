import { Row, Col, Radio, Button, Switch } from 'antd';
import React, { useState } from 'react';
import SwitchablePicker from './datePicker';
function onChange(checked) {
  console.log(`switch to ${checked}`);
}
const TablePanel = (props) => {
    return (
      <>
        <Row align='middle' style={{minHeight:'50px'}}>
          <Col>
          <span className='myFontColor'>对象：</span>
            <Radio.Group onChange={e=>{props.setState({'object':e.target.value})}} value={props.object}>
              <Radio value={'company'}>公司</Radio>
              <Radio value={'repo'}>项目</Radio>
              <Radio value={'actor'}>开发者</Radio>
            </Radio.Group>
          </Col>
          <Col>
            <span className='myFontColor'>指数：</span>
            <Radio.Group onChange={e=>{props.setState({'index':e.target.value})}} value={props.index}>
              <Radio value={'activity'}>活跃度</Radio>
              <Radio value={'open_rank'}>影响力</Radio>
            </Radio.Group>  
          </Col>
        </Row>
        <Row style={{minHeight:'50px'}} gutter={10}>
          <Col>
            <span className='myFontColor'>地区：</span>
            <Radio.Group onChange={e=>{props.setState({'region':e.target.value})}} value={props.region}>
              <Radio value={'chinese'}>中国</Radio>
              <Radio value={'global'}>全球</Radio>
            </Radio.Group>  
          </Col>
          <Col>
            <span className='myFontColor'>时间：</span><SwitchablePicker setState={props.setState} month={props.month} type={props.type} year={props.year}/>
          </Col>
          <Col>
          {
            props.hasDetail==true?
            <><span className='myFontColor'>详情</span> <Switch defaultChecked={props.showDetail} onChange={(checked)=>{props.setState({'showDetail':checked})}} /></>
            :<></>
          }
          </Col>
        </Row>
      </>

    );
};

export default TablePanel;