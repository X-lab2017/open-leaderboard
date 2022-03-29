import { Col, Row } from 'antd';
import 'antd/dist/antd.css';
import { Layout, Image } from 'antd';
const { Footer } = Layout;

function MyFooter(props){
    return (
        <Footer style={{backgroundColor:'rgba(0,0,0,0)'}}>
            <div>
                <Row align='middle' justify='center'>
                    <Col>
                        <h1 className='myFontColor'>Data Powered by</h1>
                    </Col>
                </Row>
                <Row align='middle' justify='center' gutter={20} style={{minHeight:'100px'}}>
                    <Col>
                        <img src='/pics/OD.png' style={{height:'80px',width:'80px'}}/><span style={{marginLeft:'5px',fontSize:'18px'}}>OpenDigger</span>
                    </Col>
                </Row>
                <Row align='middle' justify='center'>
                    <Col>
                        <h1 className='myFontColor'>Membership</h1>
                    </Col>
                </Row>
                <Row align='middle' justify='center' style={{minHeight:'100px'}}>
                    <Col>
                        <span style={{fontSize:'18px',width:'100%'}}>Leave a seat vacant for you.</span>
                    </Col>
                </Row>
                <Row align='middle' justify='center' style={{marginTop:'50px'}}>
                    <Col>
                        <span>Copyright ©2022 X-lab </span>
                    </Col>
                </Row>
                <Row align='middle' justify='center'>
                    <Col>
                        <a href='https://github.com/X-lab2017/open-digger' target={'_blank'}><img src='/pics/GitHub.png' style={{width:'30px',height:'30px'}} /></a>
                    </Col>
                </Row>
            </div>
        </Footer>
    );
}

export default MyFooter;