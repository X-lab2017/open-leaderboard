import ReactDOM from 'react-dom'
import { Table, Tag, Space, Col, Row } from 'antd';
import 'antd/dist/antd.css';
import { Layout, Menu, Breadcrumb, Image } from 'antd';
const { Header, Content, Footer } = Layout;

function MyFooter(props){
    return (
        <Footer style={{
            zIndex:10,
            marginTop:'100px',
            height: '500px',
            textAlign: 'center',
            backgroundColor:'rgba(0,0,0,0)',
            backgroundImage:'url("/pics/Footer BG.png")',
            backgroundRepeat:'no-repeat',
            backgroundSize:'100%',
            }}>
            <Row style={{marginTop:'200px'}}></Row>
            <Row align='middle'>
                <Col span={9} offset={2}>
                    <Image
                        preview={false}
                        src='/pics/Main Logo.png'/>
                    <Image 
                        style={{margin:'auto 0'}}
                        preview={false}
                        src='/pics/OpenInsight.png'/>
                </Col>
                <Col span={9} offset={2}>
                </Col>
            </Row>
            <Row>
                <Col>
                </Col>
            </Row>
        </Footer>
    );
}

export default MyFooter;