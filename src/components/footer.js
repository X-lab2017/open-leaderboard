import { Col, Row } from 'antd';
import 'antd/dist/antd.css';
import { Layout, Image } from 'antd';
import { t } from 'i18next';
const { Footer } = Layout;

function MyFooter(props){
    return (
        <Footer style={{
            // zIndex:10,
            // paddingTop:'50px',
            // minHeight: '1000px',
            // textAlign: 'center',
            backgroundColor:'rgba(0,0,0,0)',
            backgroundImage:'url("/pics/Footer BG.png")',
            backgroundRepeat:'no-repeat',
            backgroundSize:'100% 100%',
            }}>
            <Row style={{marginTop:'200px'}}></Row>
            <Row justify='center'>
                <Col xs={22} sm={22} md={20} lg={18} xl={16} xxl={16}>
                    <Row>
                        {/* OpenIsight */}
                        <Col xs={22} sm={22} md={20} lg={18} xl={16} xxl={11}>
                            {/* 两个图片 */}
                            <Row align='middle' gutter={[16,16]}>
                                <Col span={2}>
                                    <Image
                                        preview={false}
                                        src='/pics/Main Logo.png'/>
                                </Col>
                                <Col span={9}>
                                    <Image 
                                        style={{margin:'auto 0'}}
                                        preview={false}
                                        src='/pics/OpenInsight.png'/>
                                </Col>
                            </Row>
                            {/* 介绍文字 */}
                            <Row>
                                <Col>
                                    <p 
                                        align='left'
                                        style={{
                                            color:'#D7DBFF',
                                            fontSize:'25px'
                                        }} 
                                        >
                                        {t('openinsight')}
                                    </p>
                                </Col>
                            </Row>
                            
                        </Col>
                        {/* OpenDigger */}
                        <Col xs={22} sm={22} md={20} lg={18} xl={16} xxl={{span:11,offset:1}}>
                            <Row align='middle' gutter={[16,16]}>
                                <Col span={2}>
                                    <Image 
                                        preview={false}
                                        src='/pics/OD.png'/>
                                </Col>
                                <Col span={9}>
                                    <Image
                                        preview={false}
                                        src='/pics/OpenDigger.png'/>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <p 
                                        align='left'
                                        style={{
                                            color:'#D7DBFF',
                                            fontSize:'25px',
                                        }}>
                                        {t('opendigger')}
                                    </p>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    {/* X-lab Logo */}
                    <Row>

                    </Row>
                </Col>
            </Row>
            
            {/* X-lab Logo */}
            <Row>

            </Row>
            {/* ---- */}
            <Row style={{marginTop:'40px'}} align='middle' justify='center'>
                <Col>
                    <Image 
                        preview={false}
                        src='/pics/x-lab Logo.png'/>
                </Col>
                <Col style={{marginLeft:'20px'}}>
                    <Image 
                        preview={false}
                        src='/pics/Powered by X-lab.png'/>
                </Col>
            </Row>
        </Footer>
    );
}

export default MyFooter;