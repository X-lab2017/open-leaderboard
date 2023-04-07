import { useState } from 'react';
import { Card, Col, Image, Modal, Row, Space } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import './modal.css';
import { t } from 'i18next';
import BoardCard from "./boardcard";

const Dashboard = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      {props.type == 'word' ? (
        <div style={{ width: '100%' }} onClick={showModal}>
          {t('glossary')}
        </div>
      ) : (
        <img
          style={{ height: '48px', width: '48px', cursor: 'pointer' }}
          onClick={showModal}
          src="/pics/Dic.png"
        />
      )}
      <Modal
        title={t('glossary')}
        width={'100%'}
        closable={false}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        bodyStyle={{ backgroundColor: 'rgba(0,0,0,0)' }}
        footer={[
          <CloseCircleOutlined
            style={{ fontSize: '30px' }}
            onClick={handleOk}
          />,
        ]}
        style={{ margin: '0px auto', backgroundColor: 'rgba(0,0,0,0)' }}
        maskStyle={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
      >
        <Row style={{marginBottom: '20px'}} justify="center" gutter={[16, 16]}>
          <Col >
            <Space
                direction="vertical"
                size={'large'}
                style={{ width: '100%' }}
            >
              <BoardCard boardtitle={"GitHubGlobalIncreaseBoard"}
                         boardUrl={"https://dataease.nzcer.cn/link/CRLbP3OO"}/>
            </Space>
          </Col>
          <Col >
            <Space
                direction="vertical"
                size={'large'}
                style={{ width: '100%' }}
            >
              <BoardCard boardtitle={"OSSSupplyChainEcoBoard"}
                         boardUrl={"https://dataease.nzcer.cn/link/CKqVvwi2"}/>
            </Space>
          </Col>
        </Row>
        <Row style={{marginBottom: '20px'}} justify="center" gutter={[16, 16]}>
          <Col >
            <Space
                direction="vertical"
                size={'large'}
                style={{ width: '100%' }}
            >
              <BoardCard boardtitle={"OSTechnologyAndLanguageBoard"}
                         boardUrl={"https://dataease.nzcer.cn/link/r6dUprs6"}/>
            </Space>
          </Col>
          <Col >
            <Space
                direction="vertical"
                size={'large'}
                style={{ width: '100%' }}
            >
              <BoardCard boardtitle={"OSDbDomainInsightBoard"}
                         boardUrl={"https://dataease.nzcer.cn/link/4DbsV9Wb"}/>
            </Space>
          </Col>
        </Row>
      </Modal>
    </>
  );
};
export default Dashboard;
