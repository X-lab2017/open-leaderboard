import { Row, Col, Radio, Button, Switch } from 'antd';
import { t } from 'i18next';
import React, { useState } from 'react';
import SwitchablePicker from './datePicker';
function onChange(checked) {
  console.log(`switch to ${checked}`);
}
const TablePanel = (props) => {
  return (
    <>
      <Row align="middle" style={{ minHeight: '50px' }}>
        <Col>
          <span className="myFontColor">{t('item')}</span>
          <Radio.Group
            onChange={(e) => {
              props.setState({ object: e.target.value });
            }}
            value={props.object}
          >
            <Radio value={'company'}>{t('company')}</Radio>
            <Radio value={'repo'}>{t('repo')}</Radio>
            <Radio value={'actor'}>{t('developer')}</Radio>
          </Radio.Group>
        </Col>
        <Col>
          <span className="myFontColor">{t('index')}</span>
          <Radio.Group
            onChange={(e) => {
              props.setState({ index: e.target.value });
            }}
            value={props.index}
          >
            <Radio value={'activity'}>{t('activity')}</Radio>
            <Radio value={'open_rank'}>{t('influence')}</Radio>
          </Radio.Group>
        </Col>
      </Row>
      <Row style={{ minHeight: '50px' }} gutter={10}>
        <Col>
          <span className="myFontColor">{t('region')}</span>
          <Radio.Group
            onChange={(e) => {
              props.setState({ region: e.target.value });
            }}
            value={props.region}
          >
            <Radio value={'chinese'}>{t('chinese')}</Radio>
            <Radio value={'global'}>{t('global')}</Radio>
          </Radio.Group>
        </Col>
        <Col>
          <span className="myFontColor">{t('time')}</span>
          <SwitchablePicker
            setState={props.setState}
            month={props.month}
            type={props.type}
            year={props.year}
          />
        </Col>
        <Col>
          {props.hasDetail == true ? (
            <>
              <span className="myFontColor">{t('detail')}</span>{' '}
              <Switch
                defaultChecked={props.showDetail}
                onChange={(checked) => {
                  props.setState({ showDetail: checked });
                }}
              />
            </>
          ) : (
            <></>
          )}
        </Col>
      </Row>
    </>
  );
};

export default TablePanel;
