import ReactDOM from 'react-dom'
import { Table, Tag, Space, Col, Row } from 'antd';
import 'antd/dist/antd.css';
import { Layout, Menu, Breadcrumb, Image } from 'antd';
const { Header, Content, Footer } = Layout;

function MyFooter(props){
    return (
        <Footer style={{
            zIndex:10,
            paddingTop:'50px',
            minHeight: '1000px',
            textAlign: 'center',
            backgroundColor:'rgba(0,0,0,0)',
            backgroundImage:'url("/pics/Footer BG.png")',
            backgroundRepeat:'no-repeat',
            backgroundSize:'100% 100%',
            }}>
            <Row style={{marginTop:'400px'}}></Row>
            <Row align='middle'>
                <Col span={1} offset={5}>
                    <Image
                        preview={false}
                        src='/pics/Main Logo.png'/>
                </Col>
                <Col span={3}>
                    <Image 
                        style={{margin:'auto 0'}}
                        preview={false}
                        src='/pics/OpenInsight.png'/>
                </Col>
                <Col span={1} offset={3}>
                    <Image 
                        preview={false}
                        src='/pics/OD.png'/>
                </Col>
                <Col span={3}>
                    <Image
                        preview={false}
                        src='/pics/OpenDigger.png'/>
                </Col>
            </Row>
            <Row style={{marginTop:'20px'}}>
                <Col span={6} offset={5} >
                    <p 
                        align='left'
                        style={{
                            color:'#D7DBFF',
                            fontSize:'25px'
                        }} 
                        >
                        OpenInsight 是一个集开源数据采集、开源数据开发、开源数据可视化一整套工具，一站式解决开源数据分析与报告，专业并且具有深度的了解各个开源项目各项指标，帮助社区合理运营。
                    </p>
                </Col>
                <Col span={6} offset={1}>
                    <p 
                        align='left'
                        style={{
                            color:'#D7DBFF',
                            fontSize:'25px',
                        }}>
                        OpenDigger is an open source analysis report project for all open source data initiated by X-lab, this project aims to combine the wisdom of global developers to jointly analyze and insight into open source related data to help everyone better understand and participate in open source.
                    </p>
                </Col>
            </Row>
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