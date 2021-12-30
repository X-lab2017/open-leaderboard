import { useState } from "react";
import { Card, Col, Image, Modal, Row, Space } from "antd";
import { CloseCircleOutlined } from '@ant-design/icons';
import './modal.css'
const Dictionary = () => {
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
            <Image 
                style={{height:'60px',width:'auto',marginTop:'15px',cursor:'pointer'}}
                preview={false}
                onClick={showModal}
                src='/pics/Dic.png'/>
            <Modal 
                title="Dictionary" 
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
                                <Card><h2>活跃度</h2>Some contents...</Card>
                                <Card>Some contents...</Card>
                                <Card>Some contents...</Card>
                            </Space>
                        </Col>
                    </Row>
            </Modal>
        </>
    )

}
export default Dictionary;