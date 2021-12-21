import ReactDOM from 'react-dom'
import 'antd/dist/antd.css';
import { Row, Col, Layout, Image, Card } from 'antd';
import MyFooter from '../../components/footer';
import MyHeader from '../../components/header';
import MyTable from './table';
import { Tabs } from 'antd';
import './tab.css'
import './index.css'

const { TabPane } = Tabs;
const { Content } = Layout;

function callback(key) {
    console.log(key);
}

ReactDOM.render(
    <Layout className="layout" style={{minWidth:'980px',backgroundColor:'rgba(0,0,0,0)'}}>
        <Image 
            preview={false}
            style={{zIndex:0,position:'absolute'}}
            width={'100%'} src="/pics/Slide Background.png"/>
        <MyHeader />
        <Content style={{  background: '#fff' }}>
            <Row style={{marginTop: '200px' }}></Row>
            <Row>
                <Col span={4} offset={4}>
                    <Image
                        style={{paddingRight:'20px'}}
                        preview={false} 
                        src='/pics/Ellipse BG.png'/>
                    <span className='myFontColor'>2021 年 11 月 10 日更新</span>
                </Col>
            </Row>
            <Row style={{marginTop:'10px'}}>
                <Col span={5} offset={4}>
                    <p className='myFontColor'>欢迎来到 OpenInsight，我们对 GitHub 上国内的企业、项目及机器人账号进行了活跃度和影响力的排名</p>
                </Col>
            </Row>
            <Row>
                <Col span={18} offset={3}>
                    <Tabs 
                        onChange={callback} centered
                        tabBarGutter={50}
                        tabBarStyle={{ borderBottom:'0px solid #f0f0f0'}}
                        >
                        <TabPane tab="活跃度" key="1">
                            <Card
                                style={{
                                    zIndex:10,
                                    bottom:'20px',
                                    margin:'20px auto',
                                    width:'80%',
                                    background: '#FFFFFF',
                                    boxShadow:'0px 25px 50px 25px #F7F7FF',
                                    borderRadius: '42px'
                                }}
                                >
                                <MyTable year={"2021"} month={3} />
                            </Card>
                            
                        </TabPane>
                        <TabPane tab="影响力" key="2">
                            Content of Tab Pane 2
                        </TabPane>
                    </Tabs>
                </Col>
            </Row>
        </Content>
        <Image 
            style={{
                zIndex:0,
                position:'absolute',
                bottom:'-500px',
                }}
            preview={false}
            src='/pics/Bubble BG.png'/>
        <MyFooter />
    </Layout>,
    document.getElementById('root')
);