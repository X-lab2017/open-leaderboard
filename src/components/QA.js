import { useState } from "react";
import { Card, Col, Image, Modal, Row, Space } from "antd";
import { CloseCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import './modal.css'
const QA = (props) => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const {t} = useTranslation();

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
            {
                props.type=='word'?<div style={{width:'100%'}} onClick={showModal}>QA</div>
                :
                <Image 
                style={{height:'60px',width:'auto',marginTop:'15px',cursor:'pointer'}}
                preview={false}
                onClick={showModal}
                src='/pics/Q&A.png'/>
            }
            
            <Modal 
                title="Q&A" 
                width={'100%'}
                closable={false}
                visible={isModalVisible} 
                onOk={handleOk} 
                onCancel={handleCancel}
                bodyStyle={{backgroundColor:'rgba(0,0,0,0)'}}
                footer={[
                    <CloseCircleOutlined style={{fontSize:'30px'}}onClick={handleOk}/>
                ]}
                style={{margin:'0px auto',backgroundColor:'rgba(0,0,0,0)'}}
                maskStyle={{backgroundColor:'rgba(0,0,0,0.618)'}}>
                    <Row justify="center">
                        <Col xs={20} sm={16} md={12} lg={8} xl={6}>
                            <Space direction="vertical" size={'large'} style={{width:'100%'}}>
                                <Card><h2>{t('Question.Q1')}</h2>{t('Answer.A1')}</Card>
                                {/* <Card><h2>{t('Question.Q2')}</h2>{t('Answer.A2')}</Card> */}
                                <Card><h2>{t('Question.Q3')}</h2>{t('Answer.A3')}</Card>
                            </Space>
                        </Col>
                    </Row>
            </Modal>
        </>
    )

}
export default QA;