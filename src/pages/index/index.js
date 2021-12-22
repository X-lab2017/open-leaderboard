import ReactDOM from 'react-dom'
import 'antd/dist/antd.css';
import { Row, Col, Layout, Image, Card } from 'antd';
import MyFooter from '../../components/footer';
import MyHeader from '../../components/header';
import MyTable from '../../components/table';
import { Tabs } from 'antd';

import {
    ArrowDownOutlined,
    ArrowUpOutlined,
  } from '@ant-design/icons';

import './tab.css'
import './index.css'

const { TabPane } = Tabs;
const { Content } = Layout;

function callback(key) {
    console.log(key);
}


const activityColumns = [
    {
        title: 'Rank',
        dataIndex: 'rank',
        sorter: (a, b) => a.rank - b.rank,
        width: '5%',
    },
    {
        title: '',
        dataIndex: 'diff_rank',
        render:(text, row, index)=>{
            if(text=='UNKNOWN'){
                return ''
            }
            if(text==0){
                return ''
            }
            else if(text<0){
                return <>
                    <ArrowDownOutlined style={{color:'green'}}/>{-1*text}
                </>
            }else{
                return <>
                    <ArrowUpOutlined style={{color:'red'}}/>{text}
                </>
            }
            return text
        },
        width: '5%',
    },
    {
        title: 'Company',
        dataIndex: 'company',
        sorter: true,
        width: '20%',
    },
    {
        title: 'Activity',
        dataIndex: 'activity',
        sorter: true,
        width: '20%',
    },
];

const influenceColumns = [
    {
        title: 'Rank',
        dataIndex: 'rank',
        sorter: (a, b) => a.rank - b.rank,
        width: '5%',
    },
    {
        title: '',
        dataIndex: 'diff_rank',
        render:(text, row, index)=>{
            if(text=='UNKNOWN'){
                return ''
            }
            if(text==0){
                return ''
            }
            else if(text<0){
                return <>
                    <ArrowDownOutlined style={{color:'green'}}/>{-1*text}
                </>
            }else{
                return <>
                    <ArrowUpOutlined style={{color:'red'}}/>{text}
                </>
            }
            return text
        },
        width: '5%',
    },
    {
        title: 'Company',
        dataIndex: 'company',
        sorter: true,
        width: '20%',
    },
    {
        title: 'Influence',
        dataIndex: 'influence',
        sorter: true,
        width: '20%',
    },
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
                        tabBarStyle={{zIndex:5}}
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
                bottom:'-500px',
                }}
            preview={false}
            src='/pics/Bubble BG.png'/>
        <MyFooter />
    </Layout>,
    document.getElementById('root')
);