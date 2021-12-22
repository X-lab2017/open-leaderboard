import ReactDOM from 'react-dom'
import 'antd/dist/antd.css';
import { Row, Col, Layout, Image, Card } from 'antd';
import MyFooter from '../../components/footer';
import MyHeader from '../../components/header';
import MyTable from '../../components/table';
import { Tabs } from 'antd';

import './tab.css'
import './index.css'
import ArrowRender from '../../components/arrow';
import PointRender from '../../components/changeNumber';

import RoundFloat from '../../components/resolveFloat';
import Trophy from '../../components/rankTrophy';

const { TabPane } = Tabs;
const { Content } = Layout;

function callback(key) {
    console.log(key);
}


const activityColumns = [
    {
        title: 'Rank',
        dataIndex: 'rank',
        width: '5%',
        align: 'center',
        render: Trophy,
    },
    {
        title: '',
        dataIndex: 'diff_rank',
        render: ArrowRender,
        align:'left',
        width: '5%',
    },
    {
        title: 'Company',
        dataIndex: 'company',
        align:'center',
        width: '20%',
    },
    {
        title: 'Activity',
        dataIndex: 'activity',
        align:'right',
        width: '20%',
    },
    {
        title:'',
        dataIndex:'diff_activity',
        width:'10%',
        align:'left',
        render: PointRender,
    }
];

const influenceColumns = [
    {
        title: 'Rank',
        dataIndex: 'rank',
        width: '5%',
        render: Trophy,
        align: 'center',
    },
    {
        title: '',
        dataIndex: 'diff_rank',
        render: ArrowRender,
        align:'left',
        width: '5%',
    },
    {
        title: 'Company',
        dataIndex: 'company',
        width: '20%',
        align:'center',
    },
    {
        title: 'Influence',
        dataIndex: 'influence',
        width: '20%',
        align:'right',
        render:(text, row, index)=>{
            return RoundFloat(text)
        }
    },
    {
        title:'',
        dataIndex:'diff_influence',
        width:'10%',
        align: 'left',
        render: (text, row, index)=>{
            text = RoundFloat(text)
            return PointRender(text, row, index)
        },
    }
];


ReactDOM.render(
    <Layout className="layout" style={{
        minWidth:'980px',
        minHeight:'1800px',
        backgroundColor:'rgba(0,0,0,0)',
        }}>
        <Image 
            preview={false}
            style={{zIndex:-1,position:'absolute'}}
            width={'100%'} src="/pics/Slide Background.png"/>
        <MyHeader />
        <Content style={{ 
            backgroundColor:'rgba(0,0,0,0)',
            }}>
            <Row style={{ marginTop: '200px' }}></Row>
            <Row >
                <Col span={4} offset={4} >
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
                        onChange={callback} 
                        centered
                        tabBarGutter={50}
                        style={{zIndex:5}}
                        size={'large'}
                        tabBarStyle={{
                            zIndex:5,
                        }}
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
                                <MyTable 
                                    year={"2021"} 
                                    month={10} 
                                    item={"activity"}
                                    object={'company'}
                                    columns={activityColumns}/>
                            </Card>
                            
                        </TabPane>
                        <TabPane tab="影响力" key="2">
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
                                <MyTable 
                                    year={"2021"} 
                                    month={10} 
                                    item={"influence"}
                                    object={'company'}
                                    columns={influenceColumns}/>
                            </Card>
                        </TabPane>
                    </Tabs>
                </Col>
            </Row>
        </Content>
        <Image 
            style={{
                zIndex:-1,
                position:'absolute',
                height:'2000px',
                bottom:'-1000px',
                }}
            preview={false}
            src='/pics/Bubble BG.png'/>
        <MyFooter />
    </Layout>,
    document.getElementById('root')
);