import { useState } from 'react';
import { Card, Col, Image, Modal, Row, Space } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import './modal.css';
import { t } from 'i18next';

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
        <Row justify="center" gutter={[16, 16]}>
          <Col xs={20} sm={16} md={13} lg={13} xl={13}>
            <Space
                direction="vertical"
                size={'large'}
                style={{ width: '100%' }}
            >
            <img src="/pics/GitHubGlobalIncreaseDashboard.png" alt="your_image" style={{ maxWidth: '100%', maxHeight: '100%' }}/>
            </Space>
          </Col>
          <Col xs={20} sm={16} md={12} lg={10} xl={10}>
            <Space
                direction="vertical"
                size={'large'}
                style={{ width: '100%' }}
            >
            <Card>
              <h2>GitHub 全球增长大屏</h2>
              <p>GitHub 全球增长大屏着眼于 Github 全域数据，从多方面展示全球开源现状与趋势。指标包括 TOP10 开发者和 TOP10 仓库的 OpenRank 变化趋势，
                以及当前 OpenRank 最高的开发者和项目，直观地反应了项目和开发者的影响力。从宏观角度展示了 2015 年至今的全域日志总数、活跃仓库数量、
                活跃开发者数量以及编程语言趋势，从微观角度展现了开发者活跃时间段，开发者与机器人行为分布等指标。
              </p>
            </Card>
            </Space>
          </Col>
        </Row>
      </Modal>
    </>
  );
};
export default Dashboard;
