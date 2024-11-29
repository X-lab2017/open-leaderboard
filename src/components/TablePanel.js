import { Row, Col, Radio, Switch, Input } from 'antd';
import { t } from 'i18next';
import React, { useState } from 'react';
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
      {(props.object === 'company' || props.object === 'actor') && (
        <Row justify="space-between" style={{ minHeight: '43px' }} gutter={10}>
          <Col>
            {/* 条件渲染区域：选择 'company' 或 'actor' 直接显示 region */}

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
          </Col>
        </Row>
      )}
      {props.object === 'repo' && (
        <Row justify="space-between" style={{ minHeight: '43px' }} gutter={10}>
          <Col>
            {/* 如果选择了 'repo'，显示三个选择框：地区、应用领域、大模型 */}
            <div style={{ marginRight: '10px', display: 'inline-block' }}>
              <span className="myFontColor">{t('type')}</span>
              <Radio.Group
                onChange={(e) => {
                  props.setState({ boardType: e.target.value });
                }}
                value={props.boardType}
              >
                <Radio value={'region'}>{t('region_name')}</Radio>
                <Radio value={'purpose'}>{t('purpose')}</Radio>
                <Radio value={'appDomain'}>{t('app_domain')}</Radio>
                <Radio value={'llm'}>{t('llm')}</Radio>
              </Radio.Group>
            </div>
          </Col>
        </Row>
      )}
      {/* 动态显示区域选择框 */}
      {props.object === 'repo' && props.boardType === 'region' && (
        <Row justify="space-between" style={{ minHeight: '43px' }} gutter={10}>
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
          </Col>
        </Row>
      )}

      {props.object === 'repo' && props.boardType === 'purpose' && (
        <Row justify="space-between" style={{ minHeight: '43px' }} gutter={10}>
          <Col>
            <div style={{ marginRight: '10px', display: 'inline-block' }}>
              <span className="myFontColor">{t('purpose')}: </span>
              <Radio.Group
                onChange={(e) => {
                  props.setState({ purpose: e.target.value });
                }}
                value={props.purpose}
              >
                <Radio value={'academic'}>{t('academic')}</Radio>
                <Radio value={'be_invested'}>{t('invested')}</Radio>
                <Radio value={'open_source_community'}>
                  {t('open_source_community')}
                </Radio>
                <Radio value={'personal'}>{t('personal')}</Radio>
              </Radio.Group>
            </div>
          </Col>
        </Row>
      )}

      {/* 动态显示应用领域选择框 */}
      {props.object === 'repo' && props.boardType === 'appDomain' && (
        <Row justify="space-between" style={{ minHeight: '43px' }} gutter={10}>
          <Col>
            <div style={{ marginRight: '10px', display: 'inline-block' }}>
              <span className="myFontColor">{t('app_domain')}: </span>
              <Radio.Group
                onChange={(e) => {
                  props.setState({ appDomain: e.target.value });
                }}
                value={props.appDomain}
              >
                <Radio value={'application_software'}>
                  {t('application_software')}
                </Radio>
                <Radio value={'libraries_and_frameworks'}>
                  {t('libraries_and_frameworks')}
                </Radio>
                <Radio value={'software_tools'}>{t('software_tools')}</Radio>
                <Radio value={'system_software'}>{t('system_software')}</Radio>
                <Radio value={'non_software'}>{t('non_software')}</Radio>
              </Radio.Group>
            </div>
          </Col>
        </Row>
      )}

      {/* 动态显示应用领域选择框 */}
      {props.object === 'repo' && props.boardType === 'llm' && (
        <Row justify="space-between" style={{ minHeight: '43px' }} gutter={10}>
          <Col>
            <div style={{ marginRight: '10px', display: 'inline-block' }}>
              <span className="myFontColor">{t('llm')}: </span>
              <Radio.Group
                onChange={(e) => {
                  props.setState({ llm: e.target.value });
                }}
                value={props.llm}
              >
                <Radio value={'Application_Development_Framework'}>
                  {t('application_development_framework')}
                </Radio>
                <Radio value={'fine_tuned_task'}>{t('fine_tuned_task')}</Radio>
                <Radio value={'base_llm'}>{t('base_llm')}</Radio>
                <Radio value={'Model_Optimization_and_Compression'}>
                  {t('model_optimization_and_compression')}
                </Radio>
              </Radio.Group>
            </div>
          </Col>
        </Row>
      )}

      <Row justify="space-between" style={{ minHeight: '50px' }} gutter={10}>
        <Col>
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
