import { Row, Col, Radio, Switch, Input } from 'antd';
import { t } from 'i18next';
import React from 'react';
import SwitchablePicker from './datePicker';

const { Search } = Input;

const TablePanel = (props) => {
  return (
    <>
      <Row align="middle" style={{ minHeight: '50px' }} gutter={[10]}>
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
      <Row justify="space-between" style={{ minHeight: '50px' }} gutter={10}>
        <Col>
          <div style={{ marginRight: '10px', display: 'inline-block' }}>
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
          </div>
          <div style={{ marginRight: '10px', display: 'inline-block' }}>
            <span className="myFontColor">{t('time')}</span>
            <SwitchablePicker
              setState={props.setState}
              month={props.month}
              type={props.type}
              year={props.year}
            />
          </div>
          <div
            style={{
              marginRight: '10px',
              marginBottom: '10px',
              display: 'inline-block',
            }}
          >
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
          </div>
        </Col>
        <Col style={{ marginBottom: '10px' }}>
          <Search
            placeholder={t('input_placeholder')}
            allowClear
            onSearch={(text) => {
              props.setState({ search: text });
            }}
            style={{ width: 250 }}
            value={props.search}
          />
        </Col>
      </Row>
    </>
  );
};

export default TablePanel;
